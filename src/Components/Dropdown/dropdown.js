import React from "react";

const Dropdown = (props) => {
  const { setSlotsDuration, TimeDiffrence } = props;

  return (
    <div className="select-dropdown">
      <select onChange={(event) => setSlotsDuration(event.target.value)} value={TimeDiffrence}>
        <option>60</option>
        <option>30</option>
      </select>
    </div>
  );
};

export default Dropdown;
