import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

interface ITeachersList {
  success: boolean;
  result: {
    id: string;
    person: {
      id: string;
      name: string;
      sex: string;
      birth: string;
    };
  }[];
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
    filter?: '' | 'active' | 'inactive';
  };
}

export interface ITeacherClassSubject {
  classGroup: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    person: {
      id: string;
      name: string;
    };
  };
  subject: {
    id: string;
    name: string;
  };
  routines: {
    routine_id: string;
    week_day: number;
  }[];
}

const getAll = async ({ schoolId, token, args = {}, cancelToken }: IGetAllTeachersParams) =>
  (
    await api.get(
      `/${schoolId}/teachers?per_page=${args.per_page || 10}&page=${args.page || 1}&orderBy=name&orderType=ASC${
        !!args.filterValue
          ? `&filterBy=${args.filterBy}&filterValue=${args.filterValue}&filterType=${args.filterType}`
          : ''
      }${args.filter === 'active' ? '&active=true' : ''}${args.filter === 'inactive' ? '&active=false' : ''}`,
      { headers: { Authorization: `Bearer ${token}` }, cancelToken }
    )
  ).data as ITeachersList;

const getTeacherClasses = async ({ schoolId, token, args = {}, cancelToken }: IApiFuncParams) =>
  (
    await api.get(
      `/${schoolId}/teacher-classes?${args.teacher_id ? 'teacher_id=' + args.teacher_id : ''}${
        args.class_group_id ? '&class_group_id=' + args.class_group_id : ''
      }`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken,
      }
    )
  ).data.teacherClasses as ITeacherClassSubject[];

// return the teacher classes of the logged user
const getTeacherClassesByTeacher = async ({ schoolId, token, cancelToken }: IApiFuncParams) =>
  (
    await api.get(`/${schoolId}/teacher-classes/teacher`, {
      headers: { Authorization: `Bearer ${token}` },
      cancelToken,
    })
  ).data.teacherClasses as ITeacherClassSubject[];

const create = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/teachers`, args, { headers: { Authorization: `Bearer ${token}` } })).data;

const remove = async (id: object) => api.delete('/${school_id}/teachers/' + id);

const addTeacherSubjects = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/teacher-classes/`, args, { headers: { Authorization: `Bearer ${token}` } })).data;

//TODO preciso associar o userSubject a uma escola!!!!!!!!!!!
// const addTeacherSubjects2 = async (school_id: string, data: { teacher_id: string; subjects_id: string }) =>
//   api.post(`/${school_id}/teachers/subjects/`, { ...data });

// const removeTeacherSubject = async (school_id: string, data: { teacher_id: string; subject_id: string }) =>
//   api.delete(`/${school_id}/teachers/subjects/`, { data });

const removeTeacherSubject = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.delete(`/${schoolId}/teacher-classes/`, { data: args, headers: { Authorization: `Bearer ${token}` } }))
    .data;

const update = async (school_id: string, id: string, data: object) => api.put(`/${school_id}/teachers/` + id, data);

const getById = async (school_id: string, id: object) => api.get(`/${school_id}/teachers/` + id);

export const teachersService = {
  getTeacherClasses,
  getTeacherClassesByTeacher,
  getAll,
  create,
  remove,
  addTeacherSubjects,
  removeTeacherSubject,
  update,
  getById,
};
