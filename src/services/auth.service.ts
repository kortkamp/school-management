import api from './api.service';

interface IAuthValues {
  email: string;
  password: string;
}

export interface IAuthUserResult {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  class_group_id?: string;
  token: string;
}

const loginWithEmail = async (values: IAuthValues) => {
  const response = await api.post('/sessions', values);
  const userData = response.data as IAuthUserResult;

  return userData;
};

const confirmEmail = async (token: string) => {
  const response = await api.get('/users/confirm-user/?token=' + token);
  const email = response.data;
  return email;
};

export const sessionService = { loginWithEmail, confirmEmail };
