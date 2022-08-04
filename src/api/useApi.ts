import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { toast } from 'react-toastify';

export interface IApiFuncParams {
  token: string | undefined;
  schoolId: string | undefined;
  args?: any;
}

export type IApiFunc = (data: IApiFuncParams) => any;

export const useApi = <T extends IApiFunc>(apiFunc: T, args?: Parameters<T>[0]['args']) => {
  const [data, setData] = useState<Awaited<ReturnType<typeof apiFunc>>>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [appState] = useAppStore();

  const schoolId = appState.currentSchool?.id;

  const token = appState.currentUser?.token;

  const callApi = async () => {
    setLoading(true);
    try {
      const result = await apiFunc({ token, schoolId, args });

      setData(result);
    } catch (err: any) {
      const message = err.response.data.message || err.message || 'Erro Inesperado!';
      toast.error(message, { theme: 'colored' });
      console.log(err);
      setError(message);
      setData(undefined);
    } finally {
      setLoading(false);
    }
  };

  const memoArgs = useMemo(() => args, Object.values(args || {}));

  useEffect(() => {
    callApi();
  }, [appState.currentSchool, memoArgs]);

  return {
    data,
    error,
    loading,
  };
};
