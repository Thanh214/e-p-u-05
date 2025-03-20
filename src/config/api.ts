
// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// API endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  
  // Courses
  COURSES: '/courses',
  COURSE_BY_ID: (id: string) => `/courses/${id}`,
  
  // Resources
  RESOURCES: '/resources',
  RESOURCE_BY_ID: (id: string) => `/resources/${id}`,
  
  // Blog
  BLOG_POSTS: '/blog',
  BLOG_POST_BY_ID: (id: string) => `/blog/${id}`,
  
  // Payment
  PAYMENTS: '/payment',
  CREATE_PAYMENT: '/payment/create',
  PAYMENT_STATUS: (id: string) => `/payment/${id}/status`,
};
