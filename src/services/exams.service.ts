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

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') => {
  const response = await api.get(
    `/exams?per_page=${per_page}&page=${page}&orderBy=date&orderType=ASC${
      filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );
  return response.data.exams as IExamListResponse;
};
const getResultsByClassSubject = async (class_id: string, subject_id: string) =>
  api.get(`/exams/subject/?class_id=${class_id}&subject_id=${subject_id}`);

const create = async (data: object) => api.post('/exams', data);

const remove = async (id: string) => api.delete(`/exams/${id}`);

const update = async (id: string, data: object) => api.put(`/exams/${id}`, data);

const getById = async (id: string) => (await api.get(`/exams/${id}`)).data.exam as IExam;

const saveResults = async (data: object) => api.post('/exams/results', data);

export const examsService = {
  getAll,
  create,
  remove,
  update,
  getById,
  getResultsByClassSubject,
  saveResults,
};
