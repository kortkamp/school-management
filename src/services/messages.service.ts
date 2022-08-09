import { IApiFuncParams } from '../api/useApi';
import api from './api.service';

export interface IListMessages {
  success: boolean;
  result: {
    id: string;
    type: string;
    title: string;
    text: string;
    link: string;
    created_at: Date;
    sender: {
      id: string;
      name: string;
      avatar: string;
      avatar_url: string;
    };
  }[];
}

const getAllByUser = async ({ token, cancelToken }: IApiFuncParams) =>
  (await api.get(`/messages/user`, { headers: { Authorization: `Bearer ${token}` }, cancelToken }))
    .data as IListMessages;

const create = async ({ token, args }: IApiFuncParams) =>
  api.post(`/messages`, args.data, { headers: { Authorization: `Bearer ${token}` } });

const remove = async ({ token, args }: IApiFuncParams) =>
  api.delete('/messages/' + args.id, { headers: { Authorization: `Bearer ${token}` } });

export const messagesService = {
  getAllByUser,
  create,
  remove,
};
