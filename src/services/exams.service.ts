import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  api.get(
    `/exams?per_page=${per_page}&page=${page}&orderBy=created_at&orderType=DESC${
      filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );
const getResultsByClassSubject = async (class_id: string, subject_id: string) =>
  api.get(`/exams/subject/?class_id=${class_id}&subject_id=${subject_id}`);

const create = async (data: object) => api.post('/exams', data);

const remove = async (id: string) => api.delete(`/exams/${id}`);

const update = async (id: string, data: object) => api.put(`/exams/${id}`, data);

const getById = async (id: string) => api.get(`/exams/${id}`);

const saveResults = async (data: object) => api.post('/exams/results', data);

export const examsService = {
  getAll,
  create,
  remove,
  update,
  getById,
  getResultsByClassSubject,
  saveResults,
};
