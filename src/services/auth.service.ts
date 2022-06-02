import api from './api.service';

interface IAuthValues {
  email: string;
  password: string;
}

const loginWithEmail = async (values: IAuthValues) => {
  const response = await api.post('/sessions', values);
  const userData = response.data;

  return userData;
};

export const sessionService = { loginWithEmail };
