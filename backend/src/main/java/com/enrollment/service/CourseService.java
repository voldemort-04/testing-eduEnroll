package com.enrollment.service;

import com.enrollment.model.Course;
import com.enrollment.model.Student;
import com.enrollment.repository.CourseRepository;
import com.enrollment.repository.EnrollmentRepository;
import com.enrollment.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseService(CourseRepository courseRepository,
                         StudentRepository studentRepository,
                         EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getActiveCourses() {
        return courseRepository.findByActiveTrue();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByTeacher(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId);
    }

    public List<Course> getCoursesByCategory(String category) {
        return courseRepository.findByCategory(category);
    }

    /**
     * Create a new course (teacher only).
     */
    public Course createCourse(Course course) {
        if (course.getTeacherId() != null) {
            Student teacher = studentRepository.findById(course.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouvé avec l'id: " + course.getTeacherId()));
            if (!"TEACHER".equals(teacher.getRole())) {
                throw new RuntimeException("Seuls les enseignants peuvent créer des cours");
            }
            course.setTeacherName(teacher.getName());
        }
        return courseRepository.save(course);
    }

    /**
     * Update an existing course.
     */
    public Course updateCourse(Long id, Course updates) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé avec l'id: " + id));

        if (updates.getTitle() != null) course.setTitle(updates.getTitle());
        if (updates.getDescription() != null) course.setDescription(updates.getDescription());
        if (updates.getPrice() != null) course.setPrice(updates.getPrice());
        if (updates.getCategory() != null) course.setCategory(updates.getCategory());
        if (updates.getDurationHours() != null) course.setDurationHours(updates.getDurationHours());
        if (updates.getLevel() != null) course.setLevel(updates.getLevel());
        if (updates.getMaxStudents() != null) course.setMaxStudents(updates.getMaxStudents());
        if (updates.getActive() != null) course.setActive(updates.getActive());

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public long getEnrolledStudentCount(Long courseId) {
        return enrollmentRepository.countByCourseId(courseId);
    }
}
