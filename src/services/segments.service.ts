import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  api.get(
    `/segments?per_page=${per_page}&page=${page}&orderBy=name&orderType=DESC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => api.post('/segments', data);

const remove = async (id: object) => api.delete('/segments/' + id);

const update = async (id: string, data: object) => api.put('/segments/' + id, data);

const getById = async (id: string) => api.get('/segments/' + id);

export const segmentsService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
