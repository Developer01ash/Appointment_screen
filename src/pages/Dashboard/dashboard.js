import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import CustomPopup from "../../Components/CustomPopup/customPopup";
import Dropdown from "../../Components/Dropdown/dropdown";
import rightArrow from "../../assests/images/chevron-right.png";
import checkIcon from "../../assests/images/circle-check.png";
import "./dashboard.css";

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [currentDateData, setCurrentDateData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`
  );
  const [selectedSlot, setSelectedSlot] = useState("");
  const [TimeDiffrence, setTimeDiffrence] = useState("60");
  const fetchAvailableSlots = async () => {
    try {
      const { data } = await axios.get(
        "https://app.appointo.me/scripttag/mock_timeslots?start_date=2024-01-20&end_date=2024-01-30"
      );
      const filteredSlots = data.filter((slot) => slot.date === selectedDate);
      setCurrentDateData(filteredSlots);
      setSlots(data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const handleDateChange = (selected, event) => {
    const formattedDate = `${selected.getFullYear()}-${(selected.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${selected.getDate().toString().padStart(2, "0")}`;
    const filteredSlots = slots.filter((slot) => slot.date === formattedDate);

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = weekdays[selected.getDay()];

    setSelectedDate(
      `${day}, ${selected.toLocaleString("default", {
        month: "long",
      })} ${selected.getDate()}`
    );
    setCurrentDateData(filteredSlots);
  };

  const getTimeDiff = (start, end) => {
    const diff = Math.abs(new Date(start) - new Date(end));
    return Math.floor(diff / 1000 / 60);
  };

  return (
    <>
      <div className="wrapper">
        <div className="dashboard">
          <div className="calendar-view">
            <h1>Test Service</h1>
            <h3>
              TimeZone: <span>Asia/Calcutta</span>{" "}
            </h3>
            <Calendar
              className="calendar"
              minDate={new Date()}
              value={new Date()}
              onChange={(value, event) => handleDateChange(value, event)}
              defaultView="month"
              next2Label={null}
              prev2Label={null}
            />
          </div>
          <div className="dropdown-side">
            <Dropdown
              TimeDiffrence={TimeDiffrence}
              setTimeDiffrence={setTimeDiffrence}
            />
            <p className="date-time">
              {selectedDate?.toUpperCase()} - Available Slots
            </p>
            {currentDateData.length > 0 &&
            currentDateData[0].slots.filter(
              (item) =>
                getTimeDiff(item.start_time, item.end_time) ===
                Number(TimeDiffrence)
            ).length ? (
              currentDateData[0].slots.map((item, index) => (
                <>
                  {getTimeDiff(item.start_time, item.end_time) ===
                    Number(TimeDiffrence) && (
                    <div
                      key={index}
                      style={{
                        backgroundColor:
                          selectedSlot === item.start_time ? "#378760" : "#fff",
                        height: "48px",
                        width: "auto",
                        border: "1px solid #378760",
                        marginBottom: "12px",
                        borderRadius: "10px",
                        padding: "0px 12px",
                        display: selectedSlot === item.start_time ? "flex" : "",
                        justifyContent:
                          selectedSlot === item.start_time
                            ? "space-between"
                            : "",
                        alignItems:
                          selectedSlot === item.start_time ? "center" : "",
                      }}
                      onClick={() => {
                        setSelectedSlot(item.start_time);
                      }}
                    >
                      <p
                        className="slot-time"
                        style={{
                          color:
                            selectedSlot === item.start_time ? "white" : "",
                        }}
                      >
                        {new Date(item.start_time).toLocaleTimeString("hi-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hourCycle: "h12",
                          timeZone: "Asia/Kolkata",
                        })}{" "}
                        -{" "}
                        {new Date(item.end_time).toLocaleTimeString("hi-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hourCycle: "h12",
                          timeZone: "Asia/Kolkata",
                        })}
                      </p>
                      {selectedSlot === item.start_time && (
                        <img src={checkIcon} alt="" />
                      )}
                    </div>
                  )}
                </>
              ))
            ) : (
              <p
                className="date-time"
                style={{ textAlign: "center", marginTop: "40%" }}
              >
                No Slots Available For This
                {!currentDateData?.[0]?.slots?.find(
                  ({ start_time, end_time }) =>
                    getTimeDiff(start_time, end_time) === TimeDiffrence
                ) && currentDateData.length
                  ? "Time Range"
                  : "Date"}
              </p>
            )}
          </div>
        </div>
        <div className="footer">
          <p>Powered By Appointo</p>
          <button onClick={() => setOpenPopup(true)}>
            Next <img src={rightArrow} alt="" />
          </button>
        </div>
      </div>
      {openPopup && (
        <CustomPopup openPopup={openPopup} setOpenPopup={setOpenPopup} />
      )}
    </>
  );
};

export default Dashboard;
