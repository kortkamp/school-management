import api from './api.service';

export interface IListTerms {
  id: string;
  name: string;
  year: string;
  start_at: Date;
  end_at: Date;
}

const getAll = async () => (await api.get(`/terms`)).data.terms as IListTerms[];

const create = async (data: object) => api.post('/terms', data);

const remove = async (id: string) => api.delete('/terms/' + id);

const update = async (id: string, data: object) => api.put('/terms/' + id, data);

const getById = async (id: string) => (await api.get('/terms/' + id)).data.term as IListTerms;

export const termsService = {
  getAll,
  create,
  remove,
  update,
  getById,
};
