import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

// const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
//   api.get(
//     `/segments?per_page=${per_page}&page=${page}&orderBy=name&orderType=DESC${
//       !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
//     }`
//   );

export interface ISegment {
  id: string;
  name: string;
  phases_number: number;
  phase_name: string;
  starting_phase: number;
}

interface IListSegmentsResponse {
  success: true;
  segments: ISegment[];
}

const getAll = async ({ schoolId, token, cancelToken }: IApiFuncParams) =>
  (await api.get(`/${schoolId}/segments`, { headers: { Authorization: `Bearer ${token}` }, cancelToken })).data
    .segments as IListSegmentsResponse['segments'];

const create = async (data: object) => api.post('/segments', data);

const remove = async (id: object) => api.delete('/segments/' + id);

const update = async (id: string, data: object) => api.put('/segments/' + id, data);

const getById = async (id: string) => api.get('/segments/' + id);

export const segmentsService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
