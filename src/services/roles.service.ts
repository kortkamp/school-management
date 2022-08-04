import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

export interface IRole {
  id: string;
  type: string;
  name: string;
}

const getAll = async ({ token }: IApiFuncParams) => {
  const response = await api.get(`/roles`, { headers: { Authorization: `Bearer ${token}` } });
  return response.data.roles as IRole[];
};

export const rolesService = {
  getAll,
};
