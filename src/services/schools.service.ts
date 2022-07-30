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
    address_id: string;
    created_at: Date;
    updated_at: Date;
  };
}

const create = async (data: object) => {
  const response = await api.post('/schools', data);
  return response.data as ICreateSchoolResponseData;
};

export const schoolsService = {
  create,
};
