import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  await api.get(
    `/users?per_page=${per_page}&page=${page}&orderBy=created_at&orderType=DESC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => await api.post('/users', data);

const remove = async (id: object) => await api.delete('/users/' + id);

const update = async (id: string, data: object) => await api.put('/users/' + id, data);

const getById = async (id: object) => await api.get('/users/' + id);

const recoveryPassword = async (email: string) => await api.post('/password/forgot', { email });

const resetPassword = async (data: string) => await api.post('/password/reset', data);

export const teachersService = {
  getAll,
  create,
  remove,
  update,
  getById,
  recoveryPassword,
  resetPassword,
};
