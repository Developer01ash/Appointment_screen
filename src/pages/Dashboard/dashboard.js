import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import CustomPopup from '../../Components/CustomPopup/customPopup'
import Dropdown from '../../Components/Dropdown/dropdown'
import rightArrow from '../../assests/images/chevron-right.png'
import checkIcon from '../../assests/images/circle-check.png'
import "./dashboard.css";

const API_URL = 'https://app.appointo.me/scripttag/mock_timeslots?'

const createFromatedDate = (custumDate) => {
  return `${custumDate.getFullYear()}-${(custumDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${custumDate.getDate().toString().padStart(2, "0")}`
}

const Dashboard = () => {
  const [currentDateData, setCurrentDateData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(createFromatedDate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState("");
  const [timeDifference, setTimeDifference] = useState("60");

  const fetchAvailableSlots = async () => {
    try {
      const { data } = await axios.get(
        API_URL,
        {
          params: {
            start_date: createFromatedDate(new Date()),
          }
        }
      );
      const filteredSlots = data.filter((slot) => slot.date === selectedDate);
      setCurrentDateData(filteredSlots);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const setSlotsDuration = (value) => {
    setTimeDifference(value)
  }

  const handleDateChange = async (selected, event) => {
    try {
      const formattedDate = `${selected.getFullYear()}-${(selected.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${`${selected.getDate() + 1}`.toString().padStart(2, "0")}`;

      const { data } = await axios.get(API_URL, {
        params: {
          start_date: createFromatedDate(new Date()),
          end_date: formattedDate
        }
      });

      const date = `${selected.getFullYear()}-${(selected.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${`${selected.getDate()}`.toString().padStart(2, "0")}`;
      const filteredSlots = data?.filter((slot) => slot.date === date);
      setCurrentDateData(filteredSlots);

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

    } catch (error) {
      alert(error)
    }
  };

  const getTimeDifference = (start, end) => {
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
              timeDifference={timeDifference}
              setSlotsDuration={setSlotsDuration}
            />
            <p className="date-time">
              {selectedDate?.toUpperCase()} - Available Slots
            </p>
            {currentDateData?.length > 0 &&
              currentDateData?.[0]?.slots.filter(
                (item) =>
                  getTimeDifference(item.start_time, item.end_time) ===
                  Number(timeDifference)
              )?.length ? (
              currentDateData?.[0]?.slots.map((item, index) => (
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
              ))
            ) : (
              <p
                className="date-time"
                style={{ textAlign: "center", marginTop: "40%" }}
              >
                No Slots Available For This
                {!currentDateData?.[0]?.slots?.find(
                  ({ start_time, end_time }) =>
                    getTimeDifference(start_time, end_time) === timeDifference
                ) && currentDateData.length
                  ? " Time Range"
                  : " Date"}
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
