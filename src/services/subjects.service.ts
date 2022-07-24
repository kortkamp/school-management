import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  api.get(
    `/subjects?per_page=${per_page}&page=${page}&orderBy=created_at&orderType=DESC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const getByUser = async (user_id: string) => api.get('/subjects/user/' + user_id);

const create = async (data: object) => api.post('/subjects', data);

const remove = async (id: object) => api.delete('/subjects/' + id);

const update = async (id: string, data: object) => api.put('/subjects/' + id, data);

const getById = async (id: string) => api.get('/subjects/' + id);

export const subjectsService = {
  getAll,
  getByUser,
  create,
  remove,
  update,
  getById,
};
