import React from "react";
import { useSelector } from "react-redux";
import "./DoctorSchedule.scss";
import { LANGUAGES } from "../../../utils";
import { useEffect, useState } from "react";
import moment from "moment";
import localization from "moment/locale/vi";
import { getScheduleDoctorByDateService } from "../../../services/userService";
import { CommonUtils } from "../../../utils";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";

const DoctorSchedule = (props) => {
  const language = useSelector((state) => state.app.language);
  const [allDays, setAllDays] = useState([]);
  const [allAvailableTime, setAllAvailableTime] = useState([]);
  const [isOpenModalBooking, setIsOpenModalBooking] = useState(false);
  const [dataScheduleTimeModal, setDataScheduleTimeModal] = useState({});

  useEffect(() => {
    const allDays = getArrDays(language);
    setAllDays(allDays);
  }, [language]);

  useEffect(() => {
    const fetchData = async () => {
      const allDays = getArrDays(language);
      if (props.doctorIdFromParent) {
        try {
          const res = await getScheduleDoctorByDateService(
            props.doctorIdFromParent,
            allDays[0].value
          );
          setAllAvailableTime(res?.data || []);
        } catch (error) {
          console.error("Error fetching doctor schedule:", error);
        }
      }
    };

    fetchData();
  }, [props.doctorIdFromParent]);

  const getArrDays = (language) => {
    const allDays = [];
    const isVietnamese = language === LANGUAGES.VI;
    const todayLabel = isVietnamese ? "Hôm nay" : "Today";

    for (let i = 0; i < 7; i++) {
      const currentDay =
        language === LANGUAGES.VI
          ? moment().add(i, "days")
          : moment().add(i, "days").locale("en");
      const formattedDate = currentDay.format("DD/MM");
      const dayLabel =
        i === 0
          ? `${todayLabel} - ${formattedDate}`
          : currentDay.format(isVietnamese ? "dddd - DD/MM" : "ddd - DD/MM");

      const object = {
        label: CommonUtils.capitalizeFirstLetter(dayLabel),
        value: currentDay.startOf("day").valueOf(),
      };

      allDays.push(object);
    }

    return allDays;
  };

  const handleOnChangeSelectDate = async (e) => {
    if (props.doctorIdFromParent && props.doctorIdFromParent !== -1) {
      let doctorId = props.doctorIdFromParent;
      let date = e.target.value;
      let res = await getScheduleDoctorByDateService(doctorId, date);
      if (res && res.errCode === 0) {
        setAllAvailableTime(res.data ? res.data : []);
      }
      // console.log("check res schedule", res);
    }
  };

  const handleScheduleTime = (time) => {
    setIsOpenModalBooking(true);
    setDataScheduleTimeModal(time);
  };

  return (
    <>
      <div className="doctor-schedule-container">
        <div className="all-schedule">
          <select onChange={(e) => handleOnChangeSelectDate(e)}>
            {allDays &&
              allDays.length > 0 &&
              allDays.map((item, index) => {
                return (
                  <option key={`allday-${index}`} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="all-available-time">
          <div className="text-calendar">
            <i className="fas fa-calendar-alt"></i>
            <span>
              <FormattedMessage id="patient.detail-doctor.schedule" />
            </span>
          </div>
          <div className="time-content">
            {allAvailableTime && allAvailableTime.length > 0 ? (
              <>
                <div className="time-content-btns">
                  {allAvailableTime.map((item, index) => {
                    let timeDisplay =
                      language === LANGUAGES.VI
                        ? item.timeTypeData.valueVi
                        : item.timeTypeData.valueEn;
                    return (
                      <button
                        key={`time-${index}`}
                        className={
                          language === LANGUAGES.VI ? "btn-vi" : "btn-en"
                        }
                        onClick={() => handleScheduleTime(item)}
                      >
                        {timeDisplay}
                      </button>
                    );
                  })}
                </div>
                <div className="book-free">
                  <span>
                    <FormattedMessage id="patient.detail-doctor.choose" />
                    <i className="far fa-hand-point-up"></i>
                    <FormattedMessage id="patient.detail-doctor.book-free" />
                  </span>
                </div>
              </>
            ) : (
              <div className="no-schedule">
                <FormattedMessage id="patient.detail-doctor.no-schedule" />
              </div>
            )}
          </div>
        </div>
      </div>
      <BookingModal
        isOpenModal={isOpenModalBooking}
        closeBookingModal={() => setIsOpenModalBooking(!isOpenModalBooking)}
        dataTime={dataScheduleTimeModal}
      />
    </>
  );
};

export default DoctorSchedule;
