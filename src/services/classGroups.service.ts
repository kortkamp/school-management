import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  api.get(
    `/class-groups?per_page=${per_page}&page=${page}&orderBy=name&orderType=DESC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => api.post('/class-groups', data);

const remove = async (id: object) => api.delete('/class-groups/' + id);

const update = async (id: string, data: object) => api.put('/class-groups/' + id, data);

const getById = async (id: string) => api.get('/class-groups/' + id);

export const classGroupsService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
