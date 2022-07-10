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

export const sessionService = { loginWithEmail };
