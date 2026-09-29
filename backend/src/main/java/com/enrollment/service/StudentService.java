package com.enrollment.service;

import com.enrollment.model.Student;
import com.enrollment.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> getStudentsByRole(String role) {
        return studentRepository.findByRole(role);
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    /**
     * Register a new student account.
     */
    public Student createStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Un étudiant avec cet email existe déjà: " + student.getEmail());
        }
        if (student.getRole() == null || student.getRole().isEmpty()) {
            student.setRole("STUDENT");
        }
        student.setRegistrationDate(LocalDateTime.now());
        return studentRepository.save(student);
    }

    /**
     * Authenticate a user by email and password.
     * Returns the student if credentials are valid.
     */
    public Student login(String email, String password) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
        if (!student.getPassword().equals(password)) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }
        return student;
    }

    /**
     * Update student profile information.
     */
    public Student updateProfile(Long id, Student updates) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé avec l'id: " + id));

        if (updates.getName() != null && !updates.getName().isEmpty()) {
            student.setName(updates.getName());
        }
        if (updates.getPhone() != null) {
            student.setPhone(updates.getPhone());
        }
        // Do not allow changing email to an already-existing one
        if (updates.getEmail() != null && !updates.getEmail().equals(student.getEmail())) {
            if (studentRepository.existsByEmail(updates.getEmail())) {
                throw new RuntimeException("Cet email est déjà utilisé par un autre compte");
            }
            student.setEmail(updates.getEmail());
        }
        if (updates.getPassword() != null && !updates.getPassword().isEmpty()) {
            student.setPassword(updates.getPassword());
        }

        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public long countStudents() {
        return studentRepository.countByRole("STUDENT");
    }

    public long countTeachers() {
        return studentRepository.countByRole("TEACHER");
    }
}
