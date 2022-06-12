import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  await api.get(
    `/teachers?per_page=${per_page}&page=${page}&orderBy=name&orderType=ASC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => await api.post('/teachers', data);

const remove = async (id: object) => await api.delete('/teachers/' + id);

const update = async (id: string, data: object) => await api.put('/teachers/' + id, data);

const getById = async (id: object) => await api.get('/teachers/' + id);

export const teachersService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
