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
    <div className="w-full max-w-md">
      <input
        value={search}
        type="text"
        placeholder="Search Wikipedia..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onChange={handleChange}
      />
      {search && (
        <div>
          {loading && <div className="text-sm text-gray-500 p-2">Loading…</div>}
          {!loading && err && <div className="text-sm text-red-600 p-2">{err}</div>}
          {!loading && !err && results.length === 0 && (
            <div className="text-sm text-gray-500 p-2">Sorry no results found</div>
          )}
          {!loading && !err && results.length > 0 && (
            <ul className="border border-gray-300 border-t-0 rounded-b-md bg-white shadow-lg max-h-60 overflow-y-auto">
              {results.map((item) => (
                <li key={item.pageid} className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-900">
                  <a
                    className="block hover:underline"
                    href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                      item.title
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    title={item.snippet.replace(/<[^>]*>?/gm, "")}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
