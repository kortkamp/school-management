import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

export interface IGetUser {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    enroll_id: string;
    CPF: string;
    phone: string;
    sex: string;
    birth: '2022-06-06T10:13:55.072Z';
  };
}

const initialRegistration = async ({ args: data }: IApiFuncParams) => {
  const response = await api.post('/users/initial-registration', data);
  return response.data;
};

const getByCPF = async ({ token, args }: IApiFuncParams) =>
  (await api.get(`/users/CPF/${args.CPF}`, { headers: { Authorization: `Bearer ${token}` } })).data as IGetUser;

export const usersService = {
  initialRegistration,
  getByCPF,
};
