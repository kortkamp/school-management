import { IApiFuncParams } from '../api/useApi';
import api from './api.service';
import { RoutineType } from './models/IRoutine';

export interface IRoutine {
  id: string;
  day_time: string;
  start_at: string;
  end_at: string;
}

export interface IRoutineSubject {
  routine_id: string;
  subject_id: string;
  class_group_id: string;
  week_day: number;
}

export interface IRoutineData {
  week_day: number;
  subject: {
    id: string;
    name: string;
  };
  classGroup: {
    id: string;
    name: string;
  };
}
export interface IClassGroupRoutine {
  id: string;
  start_at: string;
  end_at: string;
  routineSubjects: IRoutineData[];
}

interface IDeleteRoutineGroupProps extends IApiFuncParams {
  args?: { id?: string };
}

interface IDeleteResponseData {
  success: boolean;
  message?: string;
}

export interface IRoutineGroup {
  id: string;
  name: string;
  routines: {
    id: string;
    start_at: string;
    duration: string;
    type: RoutineType;
  }[];
}

interface IListRoutineGroupsResponse {
  success: boolean;
  message?: string;
  routineGroups: IRoutineGroup[];
}

interface ICreateRoutineGroupResponse {
  success: boolean;
  routineGroup: {
    id: string;
    name: string;
    routines: any[];
  };
}

interface ICreateRoutineResponse {
  success: true;
  routine: {
    id: string;
    routine_group_id: string;
    start_at: string;
    duration: string;
  };
}

const getAll = async () => (await api.get(`/routines`)).data.routines as IRoutine[];

const getAllRoutineGroups = async ({ schoolId, token, cancelToken }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/routine-groups`, { headers: { Authorization: `Bearer ${token}` }, cancelToken }))
    .data as IListRoutineGroupsResponse;

const getRoutineSubjectsByClassGroup = async (id: string) =>
  (await api.get('/routines/subjects/class-group/' + id)).data.routineSubjects as IRoutineSubject[];

const saveRoutineSubjects = async (data: { routine_subjects: IRoutineSubject[] }) =>
  api.post('/routines/subjects', data);

const getRoutinesByClassGroup = async (id: string) =>
  (await api.get('/routines/class-group/' + id)).data.routines as IClassGroupRoutine[];

const getRoutinesByUser = async (id: string) =>
  (await api.get('/routines/user/' + id)).data.routines as IClassGroupRoutine[];

const createRoutineGroup = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/routine-groups`, args.data, { headers: { Authorization: `Bearer ${token}` } }))
    .data as ICreateRoutineGroupResponse;

const removeRoutineGroup = async ({ schoolId, token, args }: IDeleteRoutineGroupProps) =>
  (await api.delete(`/${schoolId}/routine-groups/` + args?.id, { headers: { Authorization: `Bearer ${token}` } }))
    .data as IDeleteResponseData;

const updateRoutineGroup = async ({ schoolId, token, args }: IApiFuncParams) =>
  (
    await api.put(`/${schoolId}/routine-groups/${args.id}`, args.data, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data as ICreateRoutineGroupResponse;

const createRoutine = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/routines`, args.data, { headers: { Authorization: `Bearer ${token}` } }))
    .data as ICreateRoutineResponse;

const removeRoutine = async ({ schoolId, token, args }: IDeleteRoutineGroupProps) =>
  (await api.delete(`/${schoolId}/routines/` + args?.id, { headers: { Authorization: `Bearer ${token}` } }))
    .data as IDeleteResponseData;

// const create = async (data: object) => await api.post('/routines', data);

// const remove = async (id: string) => await api.delete('/routines/' + id);

// const update = async (id: string, data: object) => await api.put('/routines/' + id, data);

// const getById = async (id: string) => (await api.get('/routines/' + id)).data.routine as IRoutine;

export const routinesService = {
  getAll,
  getRoutineSubjectsByClassGroup,
  saveRoutineSubjects,
  getRoutinesByClassGroup,
  getRoutinesByUser,
  getAllRoutineGroups,
  createRoutineGroup,
  removeRoutineGroup,
  updateRoutineGroup,
  createRoutine,
  removeRoutine,
  // create,
  // remove,
  // update,
  // getById,
};
