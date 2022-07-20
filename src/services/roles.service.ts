import api from './api.service';

export interface IRole {
  id: string;
  name: string;
}

const getAll = async () => {
  const response = await api.get(`/roles`);
  return response.data.roles as IRole[];
};

export const rolesService = {
  getAll,
};
