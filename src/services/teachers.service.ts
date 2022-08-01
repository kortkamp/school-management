import api from './api.service';

const getAll = async (school_id: string, per_page = 1000, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  api.get(
    `/${school_id}/teachers?per_page=${per_page}&page=${page}&orderBy=name&orderType=ASC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (school_id: string, data: object) => api.post(`/${school_id}/teachers`, data);

const remove = async (id: object) => api.delete('/${school_id}/teachers/' + id);

const addTeacherSubjects = async (school_id: string, data: { teacher_id: string; subjects_ids: string[] }) =>
  api.post(`/${school_id}/teachers/subjects/`, { ...data });

const removeTeacherSubject = async (school_id: string, data: { teacher_id: string; subject_id: string }) =>
  api.delete(`/${school_id}/teachers/subjects/`, { data });

const update = async (school_id: string, id: string, data: object) => api.put(`/${school_id}/teachers/` + id, data);

const getById = async (school_id: string, id: object) => api.get(`/${school_id}/teachers/` + id);

export const teachersService = {
  getAll,
  create,
  remove,
  addTeacherSubjects,
  removeTeacherSubject,
  update,
  getById,
};
