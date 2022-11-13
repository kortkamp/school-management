import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

interface IStudentsList {
  success: boolean;
  result: {
    id: string;
    name: string;
    enroll_id: string;
    phone: string;
    avatar_url: string;
  }[];
  total_filtered: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface IGetAllStudentsParams extends IApiFuncParams {
  args?: {
    page?: number;
    per_page?: number;
    course_id?: string;
    grade_id?: string;
    class_group_id?: string;
  };
}

const getAll = async ({ schoolId, token, args = {}, cancelToken }: IGetAllStudentsParams) =>
  (
    await api.get(
      `/${schoolId}/students?per_page=${args.per_page || 10}&page=${args.page || 1}&course_id=${
        args.course_id
      }&grade_id=${args.grade_id}&class_group_id=${args.class_group_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken,
      }
    )
  ).data as IStudentsList;

const create = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/students`, args, { headers: { Authorization: `Bearer ${token}` } })).data;

const getByAuthUser = async ({ schoolId, token }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/students/user`, { headers: { Authorization: `Bearer ${token}` } })).data;

const remove = async (id: object) => api.delete('/students/' + id);

const update = async ({ schoolId, token, args }: IApiFuncParams) =>
  (
    await api.put(`/${schoolId}/students/${args.id}`, args.data, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;

const getById = async (id: string) => api.get('/students/' + id);

export interface IStudentResults {
  id: string;
  name: string;
  enroll_id: string;
  results: {
    exam_id: string;
    value: number;
  }[];
}

const listResults = async (class_group_id: string, subject_id: string) => {
  const response = await api.get(`/students/results?class_group_id=${class_group_id}&subject_id=${subject_id}`);

  return response.data.students as IStudentResults[];
};

export const studentsService = {
  getAll,
  create,
  remove,
  update,
  getById,
  getByAuthUser,
  listResults,
};
