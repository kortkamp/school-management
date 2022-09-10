import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

interface IEmployeesList {
  success: boolean;
  result: {
    id: string;
    name: string;
    role: string;
    role_id: string;
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
  };
}

interface IDeleteEmployeeProps extends IApiFuncParams {
  args?: { user_id: string; role_id: string };
}

const getAll = async ({ schoolId, token, args = {}, cancelToken }: IGetAllTeachersParams) =>
  (
    await api.get(
      `/${schoolId}/employees?per_page=${args.per_page || 10}&page=${args.page || 1}&${
        !!args.filterValue
          ? `&filterBy=${args.filterBy}&filterValue=${args.filterValue}&filterType=${args.filterType}`
          : ''
      }`,
      { headers: { Authorization: `Bearer ${token}` }, cancelToken }
    )
  ).data as IEmployeesList;

const create = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/employees`, args, { headers: { Authorization: `Bearer ${token}` } })).data;

const createRole = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/employees/roles`, args, { headers: { Authorization: `Bearer ${token}` } })).data;

const remove = async ({ schoolId, token, args }: IDeleteEmployeeProps) =>
  (await api.delete(`/${schoolId}/employees/`, { data: args, headers: { Authorization: `Bearer ${token}` } })).data;

export const employeesService = {
  create,
  remove,
  createRole,
  getAll,
};
