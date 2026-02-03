// src/services/api.js

/* =====================================================
   ✅ PRODUCTION BACKEND (Render)
===================================================== */
const API_BASE_URL = "https://paarsh-e-learning-4.onrender.com";



/* =====================================================
   ✅ Helper
===================================================== */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};


/* =====================================================
   🎓 COURSES APIs
===================================================== */

export const getCourses = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();

  const res = await fetch(
    `${API_BASE_URL}/api/courses${query ? `?${query}` : ""}`
  );

  if (!res.ok) throw new Error("Failed to fetch courses");

  return res.json();
};


export const enrollInCourse = async (courseId) => {
  const res = await fetch(`${API_BASE_URL}/api/courses/enroll`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ courseId }),
  });

  if (!res.ok) throw new Error("Enrollment failed");

  return res.json();
};


export const batchEnrollCourses = async (courseIds) => {
  const res = await fetch(`${API_BASE_URL}/api/courses/enroll/batch`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ courseIds }),
  });

  if (!res.ok) throw new Error("Batch enrollment failed");

  return res.json();
};


export const getMyCourses = async () => {
  const res = await fetch(
    `${API_BASE_URL}/api/courses/enrolled/my-courses`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) throw new Error("Failed to fetch enrolled courses");

  return res.json();
};


export const checkEnrollment = async (courseId) => {
  const res = await fetch(
    `${API_BASE_URL}/api/courses/check-enrollment/${courseId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) throw new Error("Failed to check enrollment");

  return res.json();
};


export const updateCourseProgress = async (enrollmentId, progress) => {
  const res = await fetch(
    `${API_BASE_URL}/api/courses/progress/${enrollmentId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ progress }),
    }
  );

  if (!res.ok) throw new Error("Failed to update progress");

  return res.json();
};


/* =====================================================
   🔐 AUTH APIs  ⭐ (FIXED ROUTES)
===================================================== */

/* REGISTER */
export const registerStudent = async (studentData) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }

  const result = await res.json();

  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.student));

  return result;
};


/* LOGIN */
export const loginStudent = async (credentials) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  const result = await res.json();

  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.student));

  return result;
};


/* CURRENT USER */
export const getCurrentUser = async () => {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to get current user");

  return res.json();
};


/* =====================================================
   🩺 HEALTH
===================================================== */
export const testApiConnection = async () => {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return res.json();
};
