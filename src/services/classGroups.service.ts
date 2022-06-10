import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  await api.get(
    `/class-groups?per_page=${per_page}&page=${page}&orderBy=name&orderType=DESC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => await api.post('/class-groups', data);

const remove = async (id: object) => await api.delete('/class-groups/' + id);

const update = async (id: string, data: object) => await api.put('/class-groups/' + id, data);

const getById = async (id: string) => await api.get('/class-groups/' + id);

export const classGroupsService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
