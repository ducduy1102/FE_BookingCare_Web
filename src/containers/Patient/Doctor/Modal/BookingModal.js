import React from "react";
import { useSelector } from "react-redux";
import { Modal } from "reactstrap";
import { CommonUtils, LANGUAGES } from "../../../../utils";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import { DatePicker } from "../../../../components/Input";
import { fetchGenderStart } from "../../../../store/actions";
import Select from "react-select";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

const BookingModal = ({ isOpenModal, closeBookingModal, dataTime }) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const genderRedux = useSelector((state) => state.admin.genders);
  const [isShowLoading, setIsShowLoading] = useState(false);

  const defaultValueBooking = {
    fullname: "",
    phoneNumber: "",
    email: "",
    address: "",
    reason: "",
    birthday: "",
    selectedGender: "",
    doctorId: "",
  };

  const [valueBooking, setValueBooking] = useState(defaultValueBooking);
  const [selectedGender, setSelectedGender] = useState("");

  const fetchGenderRedux = () => dispatch(fetchGenderStart());

  useEffect(() => {
    fetchGenderRedux();
  }, []);

  useEffect(() => {
    // Logic when language changes if needed
    if (language || genderRedux.length > 0) {
      setValueBooking({
        ...valueBooking,
        listGenders: buildDataGender(genderRedux),
        selectedGender: selectedGender,
      });
    }
  }, [language, genderRedux, selectedGender]);

  useEffect(() => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let doctorId = dataTime.doctorId;
      let timeType = dataTime.timeType;
      setValueBooking({
        ...valueBooking,
        doctorId: doctorId,
        timeType: timeType,
      });
    }
  }, [dataTime]);

  const buildDataGender = (data) => {
    let result = [];
    if (data && data.length > 0) {
      data.forEach((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  const handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...valueBooking };
    stateCopy[id] = valueInput;
    setValueBooking({ ...stateCopy });

    //c2
    // setValueBooking((prevState) => ({
    //   ...prevState,
    //   [id]: valueInput,
    // }));
  };

  const handleOnChangeDatePicker = (date) => {
    setValueBooking({ ...valueBooking, birthday: date[0] });
  };

  const handleChangeSelected = (selectedOptions) => {
    setSelectedGender(selectedOptions);
    // setValueBooking({ ...valueBooking, selectedGender: selectedOptions });
  };
  // console.log("valueBooking", valueBooking);

  const buildTimeBooking = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      date = CommonUtils.capitalizeFirstLetter(date);
      return `${time} &nbsp; ${date}`;
    }
    return "";
  };

  const buildDoctorName = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;

      return `${name}`;
    }
    return "";
  };

  const handleConfirmBooking = async () => {
    // validate input
    // let date = new Date(valueBooking.birthday).getTime();
    setIsShowLoading(true);
    let timeString = buildTimeBooking(dataTime);
    let doctorName = buildDoctorName(dataTime);
    let res = await postPatientBookAppointment({
      fullname: valueBooking.fullname,
      phoneNumber: valueBooking.phoneNumber,
      email: valueBooking.email,
      address: valueBooking.address,
      reason: valueBooking.reason,
      date: dataTime.date,
      selectedGender: valueBooking.selectedGender.value,
      doctorId: valueBooking.doctorId,
      timeType: valueBooking.timeType,
      language: language,
      timeString: timeString,
      doctorName: doctorName,
    });

    if (res && res.errCode === 0) {
      setIsShowLoading(false);
      toast.success(res.message);
      closeBookingModal();
    } else {
      setIsShowLoading(false);
      toast.error(res.message);
    }
  };

  return (
    <LoadingOverlay active={isShowLoading} spinner text="Loading...">
      <Modal
        isOpen={isOpenModal}
        className="booking-modal-container"
        size="lg"
        centered
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="header-title">
              <FormattedMessage id="patient.booking-modal.title" />
            </span>
            <span className="header-close" onClick={closeBookingModal}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            <div className="doctor-infor">
              <ProfileDoctor
                doctorId={dataTime?.doctorId}
                isShowDescriptionDoctor={false}
                dataTime={dataTime}
              />
            </div>
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label" htmlFor="fullname">
                  <FormattedMessage id="patient.booking-modal.fullname" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullname"
                  value={valueBooking.fullname}
                  onChange={(e) => handleOnChangeInput(e, "fullname")}
                />
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="phoneNumber">
                  <FormattedMessage id="patient.booking-modal.phoneNumber" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  value={valueBooking.phoneNumber}
                  onChange={(e) => handleOnChangeInput(e, "phoneNumber")}
                />
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="">
                  <FormattedMessage id="patient.booking-modal.email" />
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={valueBooking.email}
                  onChange={(e) => handleOnChangeInput(e, "email")}
                />
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="">
                  <FormattedMessage id="patient.booking-modal.address" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  value={valueBooking.address}
                  onChange={(e) => handleOnChangeInput(e, "address")}
                />
              </div>
              <div className="">
                <label className="form-label" htmlFor="">
                  <FormattedMessage id="patient.booking-modal.reason" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="reason"
                  value={valueBooking.reason}
                  onChange={(e) => handleOnChangeInput(e, "reason")}
                />
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="">
                  <FormattedMessage id="patient.booking-modal.birthday" />
                </label>
                <DatePicker
                  onChange={handleOnChangeDatePicker}
                  className="form-control date-picker"
                  value={valueBooking.birthday}
                />
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="">
                  <FormattedMessage id="patient.booking-modal.gender" />
                </label>
                <Select
                  placeholder={
                    <FormattedMessage id="patient.booking-modal.selectGender" />
                  }
                  defaultValue={selectedGender}
                  onChange={handleChangeSelected}
                  // options={genders}
                  options={valueBooking.listGenders}
                />
              </div>
            </div>
          </div>
          <div className="booking-modal-footer">
            <button
              className="btn-booking-confirm"
              onClick={() => handleConfirmBooking()}
            >
              <FormattedMessage id="patient.booking-modal.btnConfirm" />
            </button>
            <button className="btn-booking-cancel" onClick={closeBookingModal}>
              <FormattedMessage id="patient.booking-modal.btnCancel" />
            </button>
          </div>
        </div>
      </Modal>
    </LoadingOverlay>
  );
};

export default BookingModal;
