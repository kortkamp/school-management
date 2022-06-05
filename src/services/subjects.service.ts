import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  await api.get(
    `/subjects?per_page=${per_page}&page=${page}&orderBy=created_at&orderType=DESC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => await api.post('/subjects', data);

const remove = async (id: object) => await api.delete('/subjects/' + id);

const update = async (id: string, data: object) => await api.put('/subjects/' + id, data);

const getById = async (id: string) => await api.get('/subjects/' + id);

export const subjectsService = {
  getAll,
  create,
  remove,
  update,
  getById,
};