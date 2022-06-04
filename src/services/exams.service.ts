import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  api.get(
    `/exams?per_page=${per_page}&page=${page}&orderBy=created_at&orderType=DESC${
      filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => api.post('/users', data);

const remove = async (id: object) => api.delete(`/users/${id}`);

const update = async (id: string, data: object) => api.put(`/users/${id}`, data);

const getById = async (id: string) => api.get(`/users/${id}`);

export const examsService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
