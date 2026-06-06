import api from './api';

/**
 * Generic CRUD client for a backend resource (e.g. "courses").
 * Sends multipart/form-data when an image File is present.
 */
const buildFormData = (values, imageField) => {
  const fd = new FormData();
  Object.entries(values).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    if (key === imageField && val instanceof File) {
      fd.append(key, val);
    } else if (Array.isArray(val) || typeof val === 'object') {
      fd.append(key, JSON.stringify(val));
    } else {
      fd.append(key, val);
    }
  });
  return fd;
};

const hasFile = (values, imageField) => values[imageField] instanceof File;

export const createResourceApi = (endpoint, imageField = 'image') => ({
  list: (params) => api.get(`/${endpoint}`, { params }).then((r) => r.data),
  getOne: (id) => api.get(`/${endpoint}/${id}`).then((r) => r.data.data),
  create: (values) => {
    if (hasFile(values, imageField)) {
      return api.post(`/${endpoint}`, buildFormData(values, imageField)).then((r) => r.data.data);
    }
    return api.post(`/${endpoint}`, values).then((r) => r.data.data);
  },
  update: (id, values) => {
    if (hasFile(values, imageField)) {
      return api.put(`/${endpoint}/${id}`, buildFormData(values, imageField)).then((r) => r.data.data);
    }
    return api.put(`/${endpoint}/${id}`, values).then((r) => r.data.data);
  },
  remove: (id) => api.delete(`/${endpoint}/${id}`).then((r) => r.data),
});
