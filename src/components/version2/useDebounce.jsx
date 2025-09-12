import React, { useEffect, useState } from "react";

const useDebounce = (query, wait = 1000) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    let timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, wait);

    return () => {
      clearTimeout(timerId);
    };
  }, [query, wait]);

  debouncedQuery;
};

export default useDebounce;
