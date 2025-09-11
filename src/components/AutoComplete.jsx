import React, { useState } from "react";

const AutoComplete = () => {
  const [search, setSearch] = useState('');

  const handleChange = (e) => {
    setSearch(e.target.value);
  }

  return (
    <div className="m-4">
      <div className="inputWrap ">
        <input value={search} type="text" placeholder="Search" className="border w-1/2" onChange={handleChange}/>
      </div>

      <div className="dataCompone border p-2 w-1/2 scroll-auto">
        <div className="dataWrap">
          <div className="data">Data</div>
          <div className="data">Data</div>
          <div className="data">Data</div>
        </div>
      </div>
    </div>
  );
};

export default AutoComplete;
