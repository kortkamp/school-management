import { IApiFuncParams } from '../api/useApi';
import api from './api.service';
import { TermType } from './models/ITerm';

export interface ISchoolYear {
  id: string;
  name: string;
  start_at: Date;
  end_at: Date;
  terms: {
    id: string;
    name: string;
    start_at: Date;
    end_at: Date;
    type: TermType;
  }[];
}

interface ISchoolYearResponseData {
  success: boolean;
  schoolYear: ISchoolYear;
}

const create = async ({ token, schoolId, args }: IApiFuncParams) => {
  const response = await api.post(`/${schoolId}/school-years`, args.data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as ISchoolYearResponseData;
};

const update = async ({ token, schoolId, args }: IApiFuncParams) => {
  const response = await api.put(`/${schoolId}/school-years/${args.id}`, args.data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as ISchoolYearResponseData;
};

const getBySchool = async ({ token, schoolId }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/school-years/current`, { headers: { Authorization: `Bearer ${token}` } }))
    .data as ISchoolYearResponseData;

const close = async ({ token, schoolId, args }: IApiFuncParams) => {
  const response = await api.post(
    `/${schoolId}/school-years/close/${args.id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data as ISchoolYearResponseData;
};

export const schoolYearsService = {
  create,
  update,
  getBySchool,
  close,
};
