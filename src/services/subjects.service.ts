import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

export interface ISubject {
  id: string;
  name: string;
  segment_id: string;
}

export interface IUserSubject {
  user_id: string;
  subject_id: string;
  type: string;
  subject: {
    id: string;
    name: string;
    segment: {
      id: string;
      name: string;
    };
  };
}

const getAll = async ({ schoolId, token, cancelToken }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/subjects`, { headers: { Authorization: `Bearer ${token}` }, cancelToken })).data
    .subjects as ISubject[];

const getByUser = async ({ schoolId, token, cancelToken, args }: IApiFuncParams) =>
  (
    await api.get(`/${schoolId}/subjects/user/${args.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cancelToken,
    })
  ).data.user_subjects as IUserSubject[];

const create = async (data: object) => api.post('/subjects', data);

const remove = async (id: object) => api.delete('/subjects/' + id);

const update = async (id: string, data: object) => api.put('/subjects/' + id, data);

const getById = async (id: string) => api.get('/subjects/' + id);

export const subjectsService = {
  getAll,
  getByUser,
  create,
  remove,
  update,
  getById,
};
