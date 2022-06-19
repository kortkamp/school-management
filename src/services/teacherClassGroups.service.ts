import api from './api.service';

const getAll = async (per_page = 1000, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  await api.get(
    `/teacher-classes?per_page=${per_page}&page=${page}${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => await api.post('/teacher-classes', data);

const remove = async (data: object) => await api.delete('/teacher-classes/', { data });

export const teacherClassGroupsService = {
  getAll,
  create,
  remove,
};
