import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

const initialRegistration = async ({ args: data }: IApiFuncParams) => {
  const response = await api.post('/users/initial-registration', data);
  return response.data;
};

export const usersService = {
  initialRegistration,
};
