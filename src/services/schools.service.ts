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

    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    CEP: string;

    userSchoolRoles: {
      user_id: string;
      role_id: string;
      school_id: string;
      created_at: Date;
    }[];

    created_at: Date;
    updated_at: Date;
  };
}

interface ISchoolParameters {
  school_id: string;
  passing_result: number;
  minimum_attendance: number;
  result_calculation: string;
  term_period: string;
  term_number: number;
  recovering_period: string;
  recovering_type: string;
  final_recovering: null;
  class_length: number;
}

interface IGetSchoolByIdData {
  success: boolean;
  school: {
    id: string;
    name: string;
    full_name: string;
    CNPJ: string;
    email: string;
    phone: string;
    mobile: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    CEP: string;
    parameters: ISchoolParameters;
  };
}

const create = async ({ token, args: data }: IApiFuncParams) => {
  const response = await api.post('/schools', data, { headers: { Authorization: `Bearer ${token}` } });
  return response.data as ICreateSchoolResponseData;
};

const update = async ({ token, schoolId, args: data }: IApiFuncParams) => {
  const response = await api.put(`/schools/${schoolId}`, data, { headers: { Authorization: `Bearer ${token}` } });
  return response.data as ICreateSchoolResponseData;
};

const getById = async ({ token, schoolId }: IApiFuncParams) =>
  (await api.get(`/schools/${schoolId}`, { headers: { Authorization: `Bearer ${token}` } })).data as IGetSchoolByIdData;

const createSchoolParameters = async ({ token, schoolId, args: data }: IApiFuncParams) => {
  const response = await api.post(`/${schoolId}/parameters`, data, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

const getSchoolParameters = async ({ token, schoolId }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/parameters`, { headers: { Authorization: `Bearer ${token}` } }))
    .data as ISchoolParameters;

export const schoolsService = {
  create,
  update,
  getById,
  createSchoolParameters,
  getSchoolParameters,
};
