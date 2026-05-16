import { useState, useEffect, useCallback, useRef } from 'react';

export function useFetch(fetchFn, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchCount, setRefetchCount] = useState(0);
  const isMounted = useRef(true);

  const { immediate = true, onSuccess, onError } = options;

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn(...args);
      if (isMounted.current) {
        setData(result);
        if (onSuccess) onSuccess(result);
      }
      return result;
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Произошла ошибка');
        if (onError) onError(err);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, onSuccess, onError]);

  const refetch = useCallback(() => {
    setRefetchCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    if (immediate) {
      execute();
    }
    return () => {
      isMounted.current = false;
    };
  }, [execute, immediate, refetchCount]);

  return {
    data,
    loading,
    error,
    execute,
    refetch
  };
}