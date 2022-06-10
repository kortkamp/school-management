import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  await api.get(
    `/segments?per_page=${per_page}&page=${page}&orderBy=name&orderType=DESC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => await api.post('/segments', data);

const remove = async (id: object) => await api.delete('/segments/' + id);

const update = async (id: string, data: object) => await api.put('/segments/' + id, data);

const getById = async (id: string) => await api.get('/segments/' + id);

export const segmentsService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
