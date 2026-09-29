-- ═══════════════════════════════════════════════════════════
-- EduEnroll — Seed Data
-- ═══════════════════════════════════════════════════════════

-- Teachers (role = TEACHER)
INSERT INTO student (name, email, password, role, phone, registration_date) VALUES
('Prof. Marie Laurent', 'marie.laurent@eduenroll.com', 'teacher123', 'TEACHER', '+33 6 12 34 56 78', '2026-01-15 09:00:00');
INSERT INTO student (name, email, password, role, phone, registration_date) VALUES
('Prof. Ahmed Benali', 'ahmed.benali@eduenroll.com', 'teacher123', 'TEACHER', '+33 6 98 76 54 32', '2026-02-01 10:30:00');

-- Sample Courses (assigned to teachers)
INSERT INTO course (title, description, price, category, duration_hours, level, teacher_id, teacher_name, max_students, active) VALUES
('Introduction au Testing', 'Apprenez les bases du testing logiciel : tests unitaires, tests d''intégration et TDD. Ce cours couvre les fondamentaux essentiels pour tout développeur.', 49.99, 'Testing', 20, 'Débutant', 1, 'Prof. Marie Laurent', 30, true);

INSERT INTO course (title, description, price, category, duration_hours, level, teacher_id, teacher_name, max_students, active) VALUES
('Selenium WebDriver', 'Maîtrisez l''automatisation des tests web avec Selenium et Java. Apprenez à créer des suites de tests robustes et maintenables.', 79.99, 'Testing', 35, 'Intermédiaire', 1, 'Prof. Marie Laurent', 25, true);

INSERT INTO course (title, description, price, category, duration_hours, level, teacher_id, teacher_name, max_students, active) VALUES
('API Testing avec Postman', 'Découvrez comment tester vos APIs REST avec Postman et Newman. Automatisez vos collections de tests et intégrez-les dans votre CI/CD.', 59.99, 'Testing', 15, 'Débutant', 2, 'Prof. Ahmed Benali', 40, true);

INSERT INTO course (title, description, price, category, duration_hours, level, teacher_id, teacher_name, max_students, active) VALUES
('Java Avancé', 'Plongez dans les fonctionnalités avancées de Java : Streams, Lambdas, Concurrency, Modules et patterns de conception.', 89.99, 'Développement', 40, 'Avancé', 2, 'Prof. Ahmed Benali', 20, true);

INSERT INTO course (title, description, price, category, duration_hours, level, teacher_id, teacher_name, max_students, active) VALUES
('Spring Boot Masterclass', 'Créez des applications web professionnelles avec Spring Boot, Spring Security, JPA et les microservices.', 99.99, 'Développement', 50, 'Intermédiaire', 1, 'Prof. Marie Laurent', 35, true);

INSERT INTO course (title, description, price, category, duration_hours, level, teacher_id, teacher_name, max_students, active) VALUES
('DevOps & CI/CD', 'Maîtrisez Docker, Kubernetes, Jenkins et GitHub Actions pour automatiser vos déploiements.', 69.99, 'DevOps', 30, 'Intermédiaire', 2, 'Prof. Ahmed Benali', 30, true);
