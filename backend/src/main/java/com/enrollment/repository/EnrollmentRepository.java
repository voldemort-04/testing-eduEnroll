package com.enrollment.repository;

import com.enrollment.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findByCourseId(Long courseId);
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
    long countByStudentId(Long studentId);
    long countByCourseId(Long courseId);
    long countByPaymentStatus(String paymentStatus);
    List<Enrollment> findByPaymentStatus(String paymentStatus);
}
