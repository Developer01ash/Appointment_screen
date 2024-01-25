import React from "react";
import "./customPopup.css";

const CustomPopup = ({ openPopup, setOpenPopup }) => {
  return (
    <div className={`popup ${openPopup ? "open" : "close"}`}>
      <div>
        <h2>Congrats!!</h2>
        <span className="description">
          You have successfully booked the slot!!
        </span>
        <div>
          <button onClick={() => setOpenPopup(false)} className="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
