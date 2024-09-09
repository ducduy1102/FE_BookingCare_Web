/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import { fetchAllDoctors, fetchAllScheduleTime } from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { DatePicker } from "../../../components/Input";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctorService } from "../../../services/userService";

const ManageSchedule = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const language = useSelector((state) => state.app.language);
  const allDoctorsRedux = useSelector((state) => state.admin.allDoctors);
  const allScheduleTimeRedux = useSelector(
    (state) => state.admin.allScheduleTime
  );

  const [listDoctor, setListDoctor] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [rangeTime, setRangeTime] = useState([]);

  useEffect(() => {
    dispatch(fetchAllDoctors());
    dispatch(fetchAllScheduleTime());
  }, []);

  const buildDataInputSelect = useCallback(
    (inputData) => {
      let result = [];
      if (inputData && inputData.length > 0) {
        inputData.forEach((item) => {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;

          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object);
        });
      }
      return result;
    },
    [language]
  );

  useEffect(() => {
    if (allDoctorsRedux !== listDoctor) {
      let dataSelect = buildDataInputSelect(allDoctorsRedux);
      setListDoctor(dataSelect);
    }
  }, [allDoctorsRedux, buildDataInputSelect]);

  useEffect(() => {
    if (language !== listDoctor) {
      let dataSelect = buildDataInputSelect(allDoctorsRedux);
      setListDoctor(dataSelect);
    }
  }, [language, buildDataInputSelect]);

  useEffect(() => {
    if (allScheduleTimeRedux !== rangeTime) {
      let data = allScheduleTimeRedux;

      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }

      setRangeTime(data);
    }
  }, [allScheduleTimeRedux]);

  const handleChangeSelected = async (selectedDoctor) => {
    setSelectedDoctor(selectedDoctor);
    const dataSelect = buildDataInputSelect(allDoctorsRedux);
    setListDoctor(dataSelect);
  };

  const handleOnChangeDatePicker = (date) => {
    setCurrentDate(date[0]);
  };

  const handleClickBtnTime = (time) => {
    if (rangeTime && rangeTime.length > 0) {
      const updateRangetime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      setRangeTime(updateRangetime);
    }
  };

  const handleSaveSchedule = async () => {
    let result = [];
    if (selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("Please select doctor");
      return;
    }
    if (!currentDate) {
      toast.error("Invalid date");
      return;
    }
    // let formattedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
    let formattedDate = new Date(currentDate).getTime();

    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected);

      if (selectedTime && selectedTime.length > 0) {
        selectedTime.map((schedule) => {
          let object = {};
          object.doctorId = selectedDoctor.value;
          object.date = formattedDate;
          object.timeType = schedule.keyMap;
          result.push(object);
          return result;
        });
      } else {
        toast.error("Invalid selected time!");
        return;
      }
    }

    let res = await saveBulkScheduleDoctorService({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      formattedDate: formattedDate,
    });

    if (res && res.errCode === 0) {
      toast.success("Save info successfully!");
    } else {
      toast.error(res.message);
    }
    // console.log("result", result);
  };

  return (
    <div className="manage-schedule-container">
      <div className="manage-schedule-title">
        <FormattedMessage id="manage-schedule.title" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-6 form-group">
            <label className="label">
              <FormattedMessage id="manage-schedule.choose-doctor" />
            </label>
            <Select
              placeholder={
                <FormattedMessage id="manage-schedule.selectDoctor" />
              }
              defaultValue={selectedDoctor}
              onChange={handleChangeSelected}
              options={listDoctor}
            />
          </div>
          <div className="col-6 form-group">
            <label className="label">
              <FormattedMessage id="manage-schedule.choose-date" />
            </label>
            <DatePicker
              onChange={handleOnChangeDatePicker}
              className="form-control date-picker"
              value={currentDate[0]}
              minDate={new Date().setHours(0, 0, 0, 0)}
            />
          </div>
        </div>
        <div className="pick-hour-container">
          {rangeTime &&
            rangeTime.length > 0 &&
            rangeTime.map((item, index) => {
              return (
                <button
                  key={`time-${index}`}
                  className={
                    item.isSelected
                      ? "btn btn-schedule active"
                      : "btn btn-schedule"
                  }
                  onClick={() => handleClickBtnTime(item)}
                >
                  {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                </button>
              );
            })}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => handleSaveSchedule()}
        >
          <FormattedMessage id="manage-schedule.save" />
        </button>
      </div>
    </div>
  );
};

export default ManageSchedule;
