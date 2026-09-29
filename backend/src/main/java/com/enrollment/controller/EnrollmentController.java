package com.enrollment.controller;

import com.enrollment.model.Enrollment;
import com.enrollment.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enrollment> getEnrollmentById(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<Enrollment> getEnrollmentsByStudent(@PathVariable Long studentId) {
        return enrollmentService.getEnrollmentsByStudent(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<Enrollment> getEnrollmentsByCourse(@PathVariable Long courseId) {
        return enrollmentService.getEnrollmentsByCourse(courseId);
    }

    /**
     * Enroll a student in a course.
     * Expects JSON body: { "studentId": 1, "courseId": 2 }
     */
    @PostMapping
    public ResponseEntity<?> enrollStudent(@RequestBody Map<String, Long> request) {
        try {
            Long studentId = request.get("studentId");
            Long courseId = request.get("courseId");
            Enrollment enrollment = enrollmentService.enrollStudent(studentId, courseId);
            return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Simulate payment for an enrollment.
     * Optionally accepts a paymentMethod in the body.
     */
    @PutMapping("/{id}/pay")
    public ResponseEntity<?> processPayment(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        try {
            String paymentMethod = body != null ? body.get("paymentMethod") : "CARD";
            Enrollment enrollment = enrollmentService.processPayment(id, paymentMethod);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Process a refund for an enrollment.
     */
    @PutMapping("/{id}/refund")
    public ResponseEntity<?> processRefund(@PathVariable Long id) {
        try {
            Enrollment enrollment = enrollmentService.processRefund(id);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Update course progress for a student enrollment.
     */
    @PutMapping("/{id}/progress")
    public ResponseEntity<?> updateProgress(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        try {
            Integer progress = body.get("progress");
            Enrollment enrollment = enrollmentService.updateProgress(id, progress);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Dashboard statistics
    @GetMapping("/stats/total")
    public long countTotalEnrollments() {
        return enrollmentService.countTotalEnrollments();
    }

    @GetMapping("/stats/status/{status}")
    public long countByStatus(@PathVariable String status) {
        return enrollmentService.countByStatus(status);
    }

    @GetMapping("/stats/student/{studentId}")
    public long countByStudent(@PathVariable Long studentId) {
        return enrollmentService.countEnrollmentsByStudent(studentId);
    }
}
