import api from './api.service';

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

const getAll = async () => (await api.get(`/routines`)).data.routines as IRoutine[];

const getRoutineSubjectsByClassGroup = async (id: string) =>
  (await api.get('/routines/subjects/class-group/' + id)).data.routineSubjects as IRoutineSubject[];

const saveRoutineSubjects = async (data: { routine_subjects: IRoutineSubject[] }) =>
  api.post('/routines/subjects', data);

const getRoutinesByClassGroup = async (id: string) =>
  (await api.get('/routines/class-group/' + id)).data.routines as IClassGroupRoutine[];

const getRoutinesByUser = async (id: string) =>
  (await api.get('/routines/user/' + id)).data.routines as IClassGroupRoutine[];

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
  // create,
  // remove,
  // update,
  // getById,
};
