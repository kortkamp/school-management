import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

export interface IListTerms {
  success: boolean;
  terms: {
    id: string;
    name: string;
    type: string;
    start_at: Date;
    end_at: Date;
  }[];
}

const getAll = async ({ schoolId, token, cancelToken }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/terms`, { headers: { Authorization: `Bearer ${token}` }, cancelToken }))
    .data as IListTerms;

const create = async ({ schoolId, token, args }: IApiFuncParams) =>
  api.post(`/${schoolId}/terms`, args.data, { headers: { Authorization: `Bearer ${token}` } });

const remove = async (id: string) => api.delete('/terms/' + id);

const update = async (id: string, data: object) => api.put('/terms/' + id, data);

const getById = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/terms/${args.id}`, { headers: { Authorization: `Bearer ${token}` } })).data
    .term as IListTerms['terms'][number];

export const termsService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
