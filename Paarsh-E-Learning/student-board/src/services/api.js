// src/services/api.js

/* =====================================================
   ✅ PRODUCTION BACKEND URL (Render server)
===================================================== */
const API_BASE_URL = "https://paarsh-e-learning-2.onrender.com/api";


/* =====================================================
   ✅ Helper Functions
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

  const response = await fetch(
    `${API_BASE_URL}/courses${query ? `?${query}` : ""}`
  );

  if (!response.ok) throw new Error("Failed to fetch courses");

  return response.json();
};


export const enrollInCourse = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/courses/enroll`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ courseId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Enrollment failed");
  }

  return response.json();
};


export const batchEnrollCourses = async (courseIds) => {
  const response = await fetch(`${API_BASE_URL}/courses/enroll/batch`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ courseIds }),
  });

  if (!response.ok) throw new Error("Batch enrollment failed");

  return response.json();
};


export const getMyCourses = async () => {
  const response = await fetch(
    `${API_BASE_URL}/courses/enrolled/my-courses`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to fetch enrolled courses");

  return response.json();
};


export const checkEnrollment = async (courseId) => {
  const response = await fetch(
    `${API_BASE_URL}/courses/check-enrollment/${courseId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to check enrollment");

  return response.json();
};


export const updateCourseProgress = async (enrollmentId, progress) => {
  const response = await fetch(
    `${API_BASE_URL}/courses/progress/${enrollmentId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ progress }),
    }
  );

  if (!response.ok) throw new Error("Failed to update progress");

  return response.json();
};


/* =====================================================
   🔐 AUTH APIs
===================================================== */

export const registerStudent = async (studentData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Registration failed");
  }

  return response.json();
};


export const loginStudent = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Login failed");
  }

  const result = await response.json();

  /* Save login data */
  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.student));
  localStorage.setItem("userId", result.student.id);

  return result;
};


export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to get current user");

  return response.json();
};


/* =====================================================
   🩺 HEALTH CHECK
===================================================== */

export const testApiConnection = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) throw new Error("Server not reachable");

  return response.json();
};
