import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

interface IEmployeesList {
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

const getAll = async ({ schoolId, token, args = {}, cancelToken }: IGetAllTeachersParams) =>
  (
    await api.get(
      `/${schoolId}/teachers?per_page=${args.per_page || 10}&page=${args.page || 1}&orderBy=name&orderType=ASC${
        !!args.filterValue
          ? `&filterBy=${args.filterBy}&filterValue=${args.filterValue}&filterType=${args.filterType}`
          : ''
      }`,
      { headers: { Authorization: `Bearer ${token}` }, cancelToken }
    )
  ).data as IEmployeesList;

const create = async ({ schoolId, token, args }: IApiFuncParams) =>
  (await api.post(`/${schoolId}/employees`, args, { headers: { Authorization: `Bearer ${token}` } })).data;

export const employeesService = {
  create,
  getAll,
};
