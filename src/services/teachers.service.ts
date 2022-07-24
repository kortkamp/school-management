import api from './api.service';

const getAll = async (per_page = 1000, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  api.get(
    `/teachers?per_page=${per_page}&page=${page}&orderBy=name&orderType=ASC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => api.post('/teachers', data);

const remove = async (id: object) => api.delete('/teachers/' + id);

const addTeacherSubjects = async (data: { teacher_id: string; subjects_ids: string[] }) =>
  api.post('/teachers/subjects/', { ...data });

const removeTeacherSubject = async (data: { teacher_id: string; subject_id: string }) =>
  api.delete('/teachers/subjects/', { data });

const update = async (id: string, data: object) => api.put('/teachers/' + id, data);

const getById = async (id: object) => api.get('/teachers/' + id);

export const teachersService = {
  getAll,
  create,
  remove,
  addTeacherSubjects,
  removeTeacherSubject,
  update,
  getById,
};
