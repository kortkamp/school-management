import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

export interface ICourse {
  id: string;
  name: string;
  segment_id: string;
  total_hours: number | '';
  phase_name: string;
  phases_number: number | '';
  grades: {
    id: string;
    name: string;
    total_hours: number;
    days: number;
    class_groups: {
      id: string;
      name: string;
    }[];
  }[];
}

interface ICoursesResponseData {
  success: boolean;
  course: ICourse;
}

const create = async ({ token, schoolId, args: data }: IApiFuncParams) => {
  const response = await api.post(`/${schoolId}/courses`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as ICoursesResponseData;
};

const update = async ({ token, schoolId, args }: IApiFuncParams) => {
  const response = await api.put(`/${schoolId}/courses/${args.id}`, args.data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as ICoursesResponseData;
};

const getAll = async ({ token, schoolId }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/courses/`, { headers: { Authorization: `Bearer ${token}` } })).data.courses as ICourse[];

const remove = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.delete(`/${schoolId}/courses/` + args?.id, { headers: { Authorization: `Bearer ${token}` } })).data;

export const coursesService = {
  create,
  update,
  remove,
  getAll,
};
