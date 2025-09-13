import { useEffect, useState, useCallback } from "react";

const useFetch = (
  query,
  transformData,
  promise,
  autoComplete
) => {
 
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
   async (query, transformData, signal) => {
      try {
        const response = await promise(query, signal);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        console.log(data);
        setData(transformData(data.query.search));
      } catch (e) {
        console.log(e);
        if (!signal.aborted) setError(e);
      }
    },
    [promise]
  );

  useEffect(() => {
    if (!query || !autoComplete) {
      setData(null);
      setError(null);
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;
    fetchData(query, transformData, signal);
    return () => {
      controller.abort();
    };
  }, [query, transformData, fetchData, autoComplete]);

  return [data, setData, error];
};

export default useFetch;
