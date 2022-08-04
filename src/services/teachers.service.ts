import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

interface ITeachersList {
  success: boolean;
  result: [
    {
      id: string;
      name: string;
      phone: null;
    }[]
  ];
  total_filtered: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface IGetAllTeachersParams extends IApiFuncParams {
  args?: {
    page?: number;
    per_page?: number;
    filterBy?: string;
    filterType?: string;
    filterValue?: string;
  };
}

const getAll = async ({ schoolId, token, args = {} }: IGetAllTeachersParams) =>
  (
    await api.get(
      `/${schoolId}/teachers?per_page=${args.per_page || 10}&page=${args.page || 1}&orderBy=name&orderType=ASC${
        !!args.filterValue
          ? `&filterBy=${args.filterBy}&filterValue=${args.filterValue}&filterType=${args.filterType}`
          : ''
      }`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
  ).data as ITeachersList;

const create = async (school_id: string, data: object) => api.post(`/${school_id}/teachers`, data);

const remove = async (id: object) => api.delete('/${school_id}/teachers/' + id);

const addTeacherSubjects = async (school_id: string, data: { teacher_id: string; subjects_ids: string[] }) =>
  api.post(`/${school_id}/teachers/subjects/`, { ...data });

const removeTeacherSubject = async (school_id: string, data: { teacher_id: string; subject_id: string }) =>
  api.delete(`/${school_id}/teachers/subjects/`, { data });

const update = async (school_id: string, id: string, data: object) => api.put(`/${school_id}/teachers/` + id, data);

const getById = async (school_id: string, id: object) => api.get(`/${school_id}/teachers/` + id);

export const teachersService = {
  getAll,
  create,
  remove,
  addTeacherSubjects,
  removeTeacherSubject,
  update,
  getById,
};
