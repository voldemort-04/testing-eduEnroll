package com.enrollment.service;

import com.enrollment.model.Course;
import com.enrollment.model.Enrollment;
import com.enrollment.model.Student;
import com.enrollment.repository.CourseRepository;
import com.enrollment.repository.EnrollmentRepository;
import com.enrollment.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             StudentRepository studentRepository,
                             CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public Optional<Enrollment> getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id);
    }

    public List<Enrollment> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<Enrollment> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    public Enrollment enrollStudent(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé avec l'id: " + studentId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé avec l'id: " + courseId));

        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("L'étudiant est déjà inscrit à ce cours");
        }

        // Check max students
        long currentEnrollments = enrollmentRepository.countByCourseId(courseId);
        if (currentEnrollments >= course.getMaxStudents()) {
            throw new RuntimeException("Ce cours est complet (maximum " + course.getMaxStudents() + " étudiants)");
        }

        if (!course.getActive()) {
            throw new RuntimeException("Ce cours n'est plus disponible");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setPaymentStatus("PENDING");
        enrollment.setEnrollmentDate(LocalDateTime.now());
        enrollment.setAmountPaid(0.0);
        enrollment.setProgress(0);

        return enrollmentRepository.save(enrollment);
    }

    /**
     * Simulates a payment — changes the status to "PAID" and records payment details.
     * In a real app, this would integrate with Stripe, PayPal, etc.
     */
    public Enrollment processPayment(Long enrollmentId, String paymentMethod) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée avec l'id: " + enrollmentId));

        if ("PAID".equals(enrollment.getPaymentStatus())) {
            throw new RuntimeException("Le paiement a déjà été effectué pour cette inscription");
        }

        enrollment.setPaymentStatus("PAID");
        enrollment.setPaymentDate(LocalDateTime.now());
        enrollment.setAmountPaid(enrollment.getCourse().getPrice());
        enrollment.setPaymentMethod(paymentMethod != null ? paymentMethod : "CARD");

        return enrollmentRepository.save(enrollment);
    }

    /**
     * Process a refund — changes the status to "REFUNDED".
     */
    public Enrollment processRefund(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée avec l'id: " + enrollmentId));

        if (!"PAID".equals(enrollment.getPaymentStatus())) {
            throw new RuntimeException("Seuls les paiements effectués peuvent être remboursés");
        }

        enrollment.setPaymentStatus("REFUNDED");
        return enrollmentRepository.save(enrollment);
    }

    /**
     * Update course progress for a student.
     */
    public Enrollment updateProgress(Long enrollmentId, Integer progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée avec l'id: " + enrollmentId));

        if (progress < 0 || progress > 100) {
            throw new RuntimeException("La progression doit être entre 0 et 100");
        }

        enrollment.setProgress(progress);
        return enrollmentRepository.save(enrollment);
    }

    // Dashboard statistics
    public long countTotalEnrollments() {
        return enrollmentRepository.count();
    }

    public long countByStatus(String status) {
        return enrollmentRepository.countByPaymentStatus(status);
    }

    public long countEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.countByStudentId(studentId);
    }
}
