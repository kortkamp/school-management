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
    birth: Date;
    user: { id: string };
    addresses: {
      id: string;
      street: string;
      number: string;
      complement: string;
      district: string;
      city: string;
      state: string;
      CEP: string;
    }[];
    contact: {
      person_id: string;
      email: string;
      phone: string;
      cel_phone: string;
    };
  };
}

const create = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/persons`, args, { headers: { Authorization: `Bearer ${token}` } })).data;

const getByCPF = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/persons/cpf/${args.cpf}`, { headers: { Authorization: `Bearer ${token}` } }))
    .data as IGetPerson;

const getById = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/persons/${args.id}`, { headers: { Authorization: `Bearer ${token}` } })).data
    .person as IGetPerson['person'];

const update = async ({ schoolId, token, args }: IApiFuncParams) =>
  (
    await api.put(`/${schoolId}/persons/${args.id}`, args.data, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;

export const personsService = {
  create,
  getById,
  getByCPF,
  update,
};
