import React from "react";

const Dropdown = (props) => {
  const { setTimeDiffrence, TimeDiffrence } = props;
  return (
    <div className="select-dropdown">
      <select onChange={(event) => setTimeDiffrence(event.target.value)}>
        <option>60</option>
        <option>30</option>
      </select>
    </div>
  );
};

export default Dropdown;
