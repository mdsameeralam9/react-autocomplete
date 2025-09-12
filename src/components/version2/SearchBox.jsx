import { useState } from "react";
import useFetchPromise from "./useFetchPromise";
const SearchBox = ({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  styles,
  debounceWait,
  listBox,
  noItemMessage,
  errorMessage,
  transformData,
  promise
}) => {
  const [query, setQuery] = useState("");
  const [isAutoComplete, setIsAutoComplete] = useState(autoComplete);
  const [activeIndex, setActiveIndex] = useState(null);
  const [data, setData, error] = useFetchPromise(
    query,
    transformData,
    promise,
    debounceWait,
    isAutoComplete
  );
  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyUp = (event) => {
    const keyCode = event.keyCode;
    if (keyCode === 13) {
      // user enter
      if (activeIndex === null) return;
      console.log(data[activeIndex].name);
      setQuery(data[activeIndex].name);
      setData(null);
      setActiveIndex(null);
      setIsAutoComplete(false);
      return;
    }
    setIsAutoComplete(true);
    if (!data || data.length === 0) return;
    if (keyCode === 40) {
      // move down
      if (activeIndex === null || activeIndex === data.length - 1) {
        setActiveIndex(0);
      } else {
        setActiveIndex((prevIndex) => prevIndex + 1);
      }
    } else if (keyCode === 38) {
      // move up
      if (activeIndex === 0) setActiveIndex(data.length - 1);
      else setActiveIndex((prevIndex) => prevIndex - 1);
    }
  };
  return (
    <>
      <label className={styles.label} for={name}>
        {label}
      </label>
      <br />
      <input
        name={name}
        className={styles.input}
        id={id}
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        onKeyUp={handleKeyUp}
      />
      {data && data.length > 0 && listBox(data, activeIndex)}
      {query && data && data.length === 0 && noItemMessage()}
      {error && errorMessage()}
    </>
  );
};

export default SearchBox;
