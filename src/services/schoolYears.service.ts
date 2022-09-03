import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

interface ISchoolYearResponseData {
  success: boolean;
  schoolYear: {
    id: string;
    name: string;
    school_id: string;
    start_at: Date;
    end_at: Date;
  };
}

const create = async ({ token, schoolId, args: data }: IApiFuncParams) => {
  const response = await api.post(`/${schoolId}/school-years`, data, { headers: { Authorization: `Bearer ${token}` } });
  return response.data as ISchoolYearResponseData;
};

const update = async ({ token, schoolId, args: data }: IApiFuncParams) => {
  const response = await api.put(`/${schoolId}/school-years/`, data, { headers: { Authorization: `Bearer ${token}` } });
  return response.data as ISchoolYearResponseData;
};

const getById = async ({ token, schoolId }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/school-years`, { headers: { Authorization: `Bearer ${token}` } }))
    .data as ISchoolYearResponseData;

export const schoolYearsService = {
  create,
  update,
  getById,
};
