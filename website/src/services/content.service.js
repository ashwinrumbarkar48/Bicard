import api from './api';

// Public, read-only endpoints consumed by the website.
export const fetchCourses = (params) => api.get('/courses/public', { params }).then((r) => r.data);
export const fetchCourseBySlug = (slug) => api.get(`/courses/slug/${slug}`).then((r) => r.data.data);

export const fetchBlogs = (params) => api.get('/blogs/public', { params }).then((r) => r.data);
export const fetchBlogBySlug = (slug) => api.get(`/blogs/slug/${slug}`).then((r) => r.data.data);

export const fetchFaculty = (params) => api.get('/faculty/public', { params }).then((r) => r.data);
export const fetchPartners = (params) => api.get('/placement-partners/public', { params }).then((r) => r.data);
export const fetchTestimonials = (params) => api.get('/testimonials/public', { params }).then((r) => r.data);
export const fetchGallery = (params) => api.get('/gallery/public', { params }).then((r) => r.data);

export const fetchPage = (slug) => api.get(`/pages/slug/${slug}`).then((r) => r.data.data);

export const fetchSettings = () => api.get('/settings').then((r) => r.data.data);

export const submitContact = (payload) => api.post('/leads/contact', payload).then((r) => r.data);
export const submitInquiry = (payload) => api.post('/leads/inquiry', payload).then((r) => r.data);
