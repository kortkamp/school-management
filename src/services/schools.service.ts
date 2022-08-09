import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

interface ICreateSchoolResponseData {
  success: boolean;
  school: {
    id: string;
    name: string;
    CNPJ: string;
    email: string;
    phone: string;
    mobile: string;
    address: {
      id: string;
      street: string;
      number: string;
      complement: string;
      district: string;
      city: string;
      state: string;
      CEP: string;
      created_at: Date;
    };
    userSchoolRoles: {
      user_id: string;
      role_id: string;
      school_id: string;
      created_at: Date;
    }[];
    address_id: string;
    created_at: Date;
    updated_at: Date;
  };
}

const create = async ({ token, args: data }: IApiFuncParams) => {
  const response = await api.post('/schools', data, { headers: { Authorization: `Bearer ${token}` } });
  return response.data as ICreateSchoolResponseData;
};

const createSchoolConfigs = async ({ token, args: data }: IApiFuncParams) => {
  const response = await api.post('/schools/configs', data, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const schoolsService = {
  create,
  createSchoolConfigs,
};
