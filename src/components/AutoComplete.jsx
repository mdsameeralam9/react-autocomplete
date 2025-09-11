import React, { useEffect, useMemo, useRef, useState } from "react";

const AutoComplete = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const controller = useRef(null);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  // simple debounce so we don’t call the API on every keystroke
  const debounced = useMemo(() => {
    let t;
    return (value, cb, delay = 100) => {
      clearTimeout(t);
      t = setTimeout(() => cb(value), delay);
    };
  }, []);

  const doSearch = async (q) => {
    controller.current = new AbortController();
    try {
      setLoading(true);
      setErr(null);
      const url =
        "https://en.wikipedia.org/w/api.php" +
        `?action=query&list=search&format=json&utf8=&srlimit=10` +
        `&origin=*` + // CORS fix
        `&srsearch=${encodeURIComponent(q)}`;
      const response = await fetch(url, { signal: controller.current.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      const items = json?.query?.search ?? [];
      setResults(items);
    } catch (e) {
      console.log(e);
      if (e.name === "AbortError") return;
      setErr(e.message || "Request failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setErr(null);
      return;
    }

    debounced(search, doSearch);

    return () => {
      controller.current?.abort();
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
          {!loading && !err && (
            <div className="flex flex-col gap-2">
              {results.length === 0 && (
                <p className="text-sm text-gray-500">No results</p>
              )}
              {results.map((item) => (
                <a
                  key={item.pageid}
                  className="data hover:underline"
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                    item.title
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  // snippet is HTML; render safely by stripping tags or using it carefully
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
