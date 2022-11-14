import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

export interface IStudentResult {
  value: number;
  student: {
    id: string;
    name: string;
  };
}

export interface IExam {
  id: string;
  type: string;
  sub_type: string;
  reference_id: string;
  status: string;
  value: number;
  weight: number;
  teacher_id: string;
  subject_id: string;
  class_id: string;
  date: Date;
  created_at: string;
  updated_at: string;
  subject: {
    id: string;
    name: string;
  };
  class_group: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    name: string;
  };
  term: {
    id: string;
    name: string;
  };
  results: IStudentResult[];
}

interface IExamListResponse {
  total_filtered: number;
  page: number;
  per_page: number;
  total_pages: number;
  result: IExam[];
}

const getAll = async ({ schoolId, token, args = {}, cancelToken }: IApiFuncParams) =>
  (
    await api.get(
      `/${schoolId}/exams?per_page=${args.per_page}&page=${args.page}${args.status ? '&status=' + args.status : ''}${
        args.type ? '&type=' + args.type : ''
      }${args.class_group_id ? '&class_group_id=' + args.class_group_id : ''}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken,
      }
    )
  ).data as IExamListResponse;

const getAllByTeacherUser = async ({ schoolId, token, args = {}, cancelToken }: IApiFuncParams) =>
  (
    await api.get(
      `/${schoolId}/exams/teacher?per_page=${args.per_page}&page=${args.page}${
        args.status ? '&status=' + args.status : ''
      }${args.type ? '&type=' + args.type : ''}${args.class_group_id ? '&class_group_id=' + args.class_group_id : ''}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken,
      }
    )
  ).data as IExamListResponse;

const getResultsByClassSubject = async (class_id: string, subject_id: string) =>
  api.get(`/exams/subject/?class_id=${class_id}&subject_id=${subject_id}`);

const create = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/exams`, args, { headers: { Authorization: `Bearer ${token}` } })).data;

const remove = async ({ schoolId, token, args: { id } }: IApiFuncParams) =>
  (await api.delete(`/${schoolId}/exams/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

const update = async ({ schoolId, token, args: { data, id } }: IApiFuncParams) =>
  (await api.put(`/${schoolId}/exams/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })).data;

const getById = async (id: string) => (await api.get(`/exams/${id}`)).data.exam as IExam;

const saveResults = async (data: object) => api.post('/exams/results', data);

export const examsService = {
  getAll,
  getAllByTeacherUser,
  create,
  remove,
  update,
  getById,
  getResultsByClassSubject,
  saveResults,
};
