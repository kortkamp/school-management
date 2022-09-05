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

/**
 * Note: Handles api call providing state, useEffect, error handling, toasts and a much more.
 * Usage: const [data, error, loading, callApi] = useApi(apiFunc, args, configs);
 * @param {function} apiFunc - api function which accepts IApiFuncParams
 * @param {object} args - optional data to be passed to apiFunc and triggers a new HTTP request when changed
 * @param {object} configs - optional configs { silent: do not call toast on errors }
 */
export const useApi = <T extends IApiFunc>(
  apiFunc: T,
  args?: Parameters<T>[0]['args'],
  configs?: { isRequest?: boolean; silent?: boolean }
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
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'Erro Inesperado!';
      if (!configs?.silent) {
        console.log(err);
        toast.error(message, { theme: 'colored' });
      }
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

export const useRequestApi = <T extends IApiFunc>(
  apiFunc: T
): [(args: Parameters<T>[0]['args']) => Promise<ReturnType<typeof apiFunc> | undefined>, boolean, string] => {
  const [, error, loading, callApi] = useApi(apiFunc, {}, { isRequest: true });

  return [callApi, loading, error];
};

export const useApiCallback = () => {
  //remember to implement this
};
