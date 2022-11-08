import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

interface IClassGroup {
  id: string;
  name: string;
  grade: {
    id: string;
    name: string;
    course: {
      id: string;
      name: string;
    };
  } | null;
  routineGroup: {
    id: string;
    name: string;
  } | null;
  students_count: number;
}

export interface IClassGroupDetail extends IClassGroup {
  students: any[];
  teachers: any[];
}

// const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
//   api.get(
//     `/class-groups?per_page=${per_page}&page=${page}&orderBy=name&orderType=DESC${
//       !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
//     }`
//   );

const getAll = async ({ schoolId, token, cancelToken }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/class-groups`, { headers: { Authorization: `Bearer ${token}` }, cancelToken })).data
    .classGroups as IClassGroup[];

const create = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/class-groups`, args, { headers: { Authorization: `Bearer ${token}` } })).data;

const remove = async (id: object) => api.delete('/class-groups/' + id);

const update = async (id: string, data: object) => api.put('/class-groups/' + id, data);

// const getById = async (id: string) => api.get('/class-groups/' + id);

const getById = async ({ schoolId, token, cancelToken, args }: IApiFuncParams) =>
  (
    await api.get(`/${schoolId}/class-groups/${args.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cancelToken,
    })
  ).data.classGroup as IClassGroupDetail;

export const classGroupsService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
