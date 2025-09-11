import React, { useEffect, useMemo, useRef, useState } from "react";

const AutoComplete = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const controllerRef = useRef(null);

  const handleChange = (e) => setSearch(e.target.value);

  // debounce wrapper
  const debounced = useMemo(() => {
    let t;
    return (value, cb, delay = 250) => {
      clearTimeout(t);
      t = setTimeout(() => cb(value), delay);
    };
  }, []);

  const doSearch = async (q) => {
    // abort any in-flight request
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setLoading(true);
      setErr(null);

      const url =
        "https://en.wikipedia.org/w/api.php" +
        `?action=query&list=search&format=json&utf8=&srlimit=10` +
        `&origin=*` +
        `&srsearch=${encodeURIComponent(q)}`;

      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const items = json?.query?.search ?? [];

      // ignore updates if this request was aborted
      if (controller.signal.aborted) return;

      setResults(items);
    } catch (e) {
      if (e.name === "AbortError") return; // ignore aborted requests
      setErr(e.message || "Request failed");
      setResults([]);
    } finally {
      // don't flip loading false if aborted by a newer request still running
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      // clear state when input is empty
      if (controllerRef.current) controllerRef.current.abort();
      setResults([]);
      setErr(null);
      setLoading(false);
      return;
    }
    debounced(search, doSearch);
    return () => {
      // abort on unmount or before next effect run
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [search, debounced]);

  return (
    <div className="w-[500px]">
      <div className="inputWrap">
        <input
          value={search}
          type="text"
          placeholder="Search"
          className="border-2 w-full rounded px-2"
          onChange={handleChange}
        />
      </div>

      {search && (
        <div className="w-full dataCompone border-2 rounded p-2 scroll-auto border-t-0 mt--1">
          {loading && <p className="text-sm text-gray-500">Loading…</p>}
          {!loading && err && <p className="text-sm text-red-600">{err}</p>}
          {!loading && !err && results.length === 0 && (
            <p className="text-sm text-gray-500">No results</p>
          )}
          {!loading && !err && results.length > 0 && (
            <div className="flex flex-col gap-2">
              {results.map((item) => (
                <a
                  key={item.pageid}
                  className="data hover:underline"
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                    item.title
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  title={item.snippet.replace(/<[^>]*>?/gm, "")}
                >
                  {item.title}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
