import { IApiFuncParams } from '../api/useApi';
import api from './api.service';
import { ITerm } from './models/ITerm';

export interface IListTerms {
  success: boolean;
  terms: {
    id: string;
    name: string;
    type: string;
    start_at: Date | '';
    end_at: Date | '';
  }[];
}

interface IDeleteTermProps extends IApiFuncParams {
  args?: { id?: string };
}

interface IDeleteTermResponseData {
  success: boolean;
  message?: string;
}

interface ICreateTermResponseData {
  success: boolean;
  message?: string;
  term?: ITerm;
}

const getAll = async ({ schoolId, token, cancelToken }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/terms`, { headers: { Authorization: `Bearer ${token}` }, cancelToken }))
    .data as IListTerms;

const create = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/terms`, args.data, { headers: { Authorization: `Bearer ${token}` } }))
    .data as ICreateTermResponseData;

const remove = async ({ schoolId, token, args }: IDeleteTermProps) =>
  (await api.delete(`/${schoolId}/terms/` + args?.id, { headers: { Authorization: `Bearer ${token}` } }))
    .data as IDeleteTermResponseData;

const update = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.put(`/${schoolId}/terms/${args.id}`, args.data, { headers: { Authorization: `Bearer ${token}` } }))
    .data as ICreateTermResponseData;

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
