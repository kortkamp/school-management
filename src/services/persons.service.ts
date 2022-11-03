import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

export interface IGetPerson {
  success: boolean;
  person: {
    id: string;
    name: string;
    cpf: string;
    rg: string;
    sex: string;
    birth: string;
    user: { id: string };
  };
}

const create = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/persons`, args, { headers: { Authorization: `Bearer ${token}` } })).data;

const getByCPF = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/persons/cpf/${args.cpf}`, { headers: { Authorization: `Bearer ${token}` } }))
    .data as IGetPerson;

export const personsService = {
  create,
  getByCPF,
};
