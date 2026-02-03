/* =========================================
   PRODUCTION BACKEND URL
========================================= */
// Make sure this matches your actual backend URL
const API_BASE_URL ="https://paarsh-e-learning-4.onrender.com";


/* =========================================
   Helper
========================================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};


/* =========================================
   COURSES
========================================= */

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


export const getMyCourses = async () => {
  const res = await fetch(
    `${API_BASE_URL}/api/courses/enrolled/my-courses`,
    { headers: getAuthHeaders() }
  );

  if (!res.ok) throw new Error("Failed to fetch courses");

  return res.json();
};

export const batchEnrollCourses = async (courseIds) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/enroll/batch`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ courseIds }),
  });

  if (!response.ok) {
    throw new Error("Batch enrollment failed");
  }

  return response.json();
};



/* =========================================
   AUTH
========================================= */

export const registerStudent = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Registration failed");

  return res.json();
};


export const loginStudent = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data),
  });

   if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed');
  }


   const result = await res.json();

 localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.student));

  return result;
};


/* =========================================
   HEALTH
========================================= */

export const testApiConnection = async () => {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return res.json();
};
