import { useEffect, useState, useCallback } from "react";
import useDebounce from "./useDebounce";

const useFetchPromise = (
  query,
  transformData,
  promise,
  debounceWait,
  autoComplete
) => {
  const delayQuery = useDebounce(query, debounceWait)
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
   async (query, transformData, signal) => {
      try {
        const response = await promise(query, signal);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        console.log(data);
        setData(transformData(data));
      } catch (e) {
        console.log(e);
        if (!signal.aborted) setError(e);
      }
    },
    []
  );

  useEffect(() => {
    if (!delayQuery || !autoComplete) {
      setData(null);
      setError(null);
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;

    fetchData(delayQuery, transformData, signal);

    return () => {
      controller.abort();
    };
  }, [delayQuery, transformData, fetchData, autoComplete]);

  return [data, setData, error];
};

export default useFetchPromise;
