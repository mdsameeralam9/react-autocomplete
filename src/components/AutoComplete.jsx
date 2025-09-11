import React, { useState } from "react";

const AutoComplete = () => {
  const [search, setSearch] = useState('');
  

  return (
    <div className="m-4">
      <div className="inputWrap ">
        <input type="text" placeholder="Search" className="border w-1/2" />
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
