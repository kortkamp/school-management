import api from './api.service';

export interface IRoutine {
  id: string;
  day_time: string;
  start_at: string;
  end_at: string;
}

interface IRoutineSubject {
  routine_id: string;
  subject_id: string;
  class_group_id: string;
  week_day: number;
}

const getAll = async () => (await api.get(`/routines`)).data.routines as IRoutine[];

const getRoutineSubjectsByClassGroup = async (id: string) =>
  (await api.get('/routines/subjects/class-group/' + id)).data.routineSubjects as IRoutineSubject[];

const saveRoutineSubjects = async (data: { routine_subjects: IRoutineSubject[] }) =>
  await api.post('/routines/subjects', data);

// const create = async (data: object) => await api.post('/routines', data);

// const remove = async (id: string) => await api.delete('/routines/' + id);

// const update = async (id: string, data: object) => await api.put('/routines/' + id, data);

// const getById = async (id: string) => (await api.get('/routines/' + id)).data.routine as IRoutine;

export const routinesService = {
  getAll,
  getRoutineSubjectsByClassGroup,
  saveRoutineSubjects,
  // create,
  // remove,
  // update,
  // getById,
};
