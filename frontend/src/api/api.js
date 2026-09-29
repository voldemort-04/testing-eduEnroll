const API_BASE = 'http://localhost:8081/api';

// ─── Helper ──────────────────────────────────────────────

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/students/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function register(student) {
  const res = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  return handleResponse(res);
}

// ─── Students ────────────────────────────────────────────

export async function getStudents() {
  const res = await fetch(`${API_BASE}/students`);
  return res.json();
}

export async function getStudentById(id) {
  const res = await fetch(`${API_BASE}/students/${id}`);
  return handleResponse(res);
}

export async function getStudentsByRole(role) {
  const res = await fetch(`${API_BASE}/students/role/${role}`);
  return res.json();
}

export async function updateProfile(id, updates) {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

// ─── Courses ─────────────────────────────────────────────

export async function getCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  return res.json();
}

export async function getActiveCourses() {
  const res = await fetch(`${API_BASE}/courses/active`);
  return res.json();
}

export async function getCourseById(id) {
  const res = await fetch(`${API_BASE}/courses/${id}`);
  return handleResponse(res);
}

export async function getCoursesByTeacher(teacherId) {
  const res = await fetch(`${API_BASE}/courses/teacher/${teacherId}`);
  return res.json();
}

export async function createCourse(course) {
  const res = await fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });
  return handleResponse(res);
}

export async function updateCourse(id, updates) {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

export async function deleteCourse(id) {
  const res = await fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression du cours');
}

export async function getEnrolledStudentCount(courseId) {
  const res = await fetch(`${API_BASE}/courses/${courseId}/enrolled-count`);
  return res.json();
}

// ─── Enrollments ─────────────────────────────────────────

export async function getEnrollments() {
  const res = await fetch(`${API_BASE}/enrollments`);
  return res.json();
}

export async function getEnrollmentsByStudent(studentId) {
  const res = await fetch(`${API_BASE}/enrollments/student/${studentId}`);
  return res.json();
}

export async function getEnrollmentsByCourse(courseId) {
  const res = await fetch(`${API_BASE}/enrollments/course/${courseId}`);
  return res.json();
}

export async function enrollStudent(studentId, courseId) {
  const res = await fetch(`${API_BASE}/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, courseId }),
  });
  return handleResponse(res);
}

export async function processPayment(enrollmentId, paymentMethod) {
  const res = await fetch(`${API_BASE}/enrollments/${enrollmentId}/pay`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentMethod: paymentMethod || 'CARD' }),
  });
  return handleResponse(res);
}

export async function processRefund(enrollmentId) {
  const res = await fetch(`${API_BASE}/enrollments/${enrollmentId}/refund`, {
    method: 'PUT',
  });
  return handleResponse(res);
}

export async function updateProgress(enrollmentId, progress) {
  const res = await fetch(`${API_BASE}/enrollments/${enrollmentId}/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ progress }),
  });
  return handleResponse(res);
}
