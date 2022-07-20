import api from './api.service';

const initialRegistration = async (data: object) => {
  const response = await api.post('/users/initial-registration', data);
  const responseData = response.data;
  return responseData.user;
};

export const usersService = {
  initialRegistration,
};
