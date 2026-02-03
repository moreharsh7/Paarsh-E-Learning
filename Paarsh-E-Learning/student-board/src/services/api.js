// src/services/api.js
const API_BASE_URL = 'https://paarsh-e-learning-73r4.onrender.com';

// Course API functions
export const getCourses = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.level) queryParams.append('level', filters.level);
    
    const url = `${API_BASE_URL}/courses${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    console.log('Fetching courses from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Fetched ${data.length} courses`);
    return data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const enrollInCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please login.');
    }
    
    const response = await fetch(`${API_BASE_URL}/courses/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ courseId })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Enrollment failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

// In src/services/api.js - Update batchEnrollCourses function
export const batchEnrollCourses = async (courseIds) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to enroll in courses');
    }
    
    console.log('📦 Batch enrolling courses:', courseIds);
    console.log('🔑 Using token:', token.substring(0, 20) + '...');
    
    const response = await fetch('http://localhost:5000/api/courses/enroll/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ courseIds })
    });
    
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse JSON response:', e);
      throw new Error('Invalid server response');
    }
    
    if (!response.ok) {
      console.error('❌ API Error:', result);
      throw new Error(result.message || `Enrollment failed: ${response.status}`);
    }
    
    console.log('✅ Batch enrollment successful:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error in batch enrollment:', error);
    throw error;
  }
};

export const getMyCourses = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to view your courses');
    }
    
    console.log('📚 Fetching enrolled courses...');
    console.log('🔑 Token:', token.substring(0, 20) + '...');
    
    const response = await fetch('http://localhost:5000/api/courses/enrolled/my-courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch enrolled courses:', errorText);
      throw new Error(`Failed to fetch enrolled courses: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.length} enrolled courses`);
    return data;
    
  } catch (error) {
    console.error('❌ Error fetching enrolled courses:', error);
    throw error;
  }
};

// Add this function to debug enrollments
export const debugEnrollments = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login');
    }
    
    const response = await fetch('http://localhost:5000/api/courses/debug/enrollments', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Debug error:', error);
    throw error;
  }
};

export const checkEnrollment = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please login.');
    }
    
    const response = await fetch(`${API_BASE_URL}/courses/check-enrollment/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to check enrollment status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking enrollment:', error);
    throw error;
  }
};

export const updateCourseProgress = async (enrollmentId, progress) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please login.');
    }
    
    const response = await fetch(`${API_BASE_URL}/courses/progress/${enrollmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ progress })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update progress');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

// Auth functions
export const registerStudent = async (studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginStudent = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();
    
    // Save token and user info to localStorage
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.student));
    localStorage.setItem('userId', result.student.id);
    
    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get current user');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('API connection test failed:', error);
    return { status: 'Server not reachable', error: error.message };
  }
};