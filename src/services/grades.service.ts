import api from './api.service';

const getAll = async (per_page = 100, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  api.get(
    `/grades?per_page=${per_page}&page=${page}&orderBy=name&orderType=DESC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => api.post('/grades', data);

const remove = async (id: object) => api.delete('/grades/' + id);

const update = async (id: string, data: object) => api.put('/grades/' + id, data);

const getById = async (id: string) => api.get('/grades/' + id);

export const gradesService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
