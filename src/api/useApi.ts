import { useEffect, useState } from 'react';
import { useAppStore } from '../store';

export interface IApiFuncParams {
  token: string | undefined;
  schoolId: string | undefined;
  args?: any;
}

export type IApiFunc = (data: IApiFuncParams) => any;

export const useApi = <T extends IApiFunc>(apiFunc: T, { ...args }) => {
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
      const message = err.message || 'Unexpected Error!';
      console.log(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callApi();
  }, [appState.currentSchool]);

  return {
    data,
    error,
    loading,
  };
};
