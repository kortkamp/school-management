import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { toast } from 'react-toastify';
import axios, { CancelToken } from 'axios';

export interface IApiFuncParams {
  token: string | undefined;
  schoolId: string | undefined;
  args?: any;
  cancelToken?: CancelToken;
}

export type IApiFunc = (data: IApiFuncParams) => any;

export const useApi = <T extends IApiFunc>(
  apiFunc: T,
  args?: Parameters<T>[0]['args'],
  configs?: { isRequest: boolean }
): [
  Awaited<ReturnType<typeof apiFunc>> | undefined,
  string,
  boolean,
  (args: Parameters<T>[0]['args']) => Promise<ReturnType<typeof apiFunc> | undefined>
] => {
  const source = axios.CancelToken.source();

  const [data, setData] = useState();
  //data:<Awaited<ReturnType<typeof apiFunc>>>
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [appState] = useAppStore();

  const schoolId = appState.currentSchool?.id;

  const token = appState.currentUser?.token;

  const callApi = async (requestArgs: Parameters<T>[0]['args']) => {
    setLoading(true);
    try {
      const result = await apiFunc({ token, schoolId, args: requestArgs, cancelToken: source.token });
      setData(result);
      setLoading(false);
      return result;
    } catch (err: any) {
      if (err.code === 'ERR_CANCELED') {
        return;
      }
      console.log(err);
      const message = err.response?.data?.message || err.message || 'Erro Inesperado!';
      toast.error(message, { theme: 'colored' });
      setError(message);
      setData(undefined);
    }
  };

  const memoArgs = useMemo(() => args, Object.values(args || {}));

  useEffect(() => {
    if (!configs?.isRequest) {
      callApi(args);
    }
    return () => {
      source.cancel();
    };
  }, [appState.currentSchool, memoArgs]);

  return [data, error, loading, callApi];
};
