import { useCallback } from "react";
import { useSelector } from "react-redux";
import { LANGUAGES } from "../../../utils";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import "./ManagePatient.scss";
import { DatePicker } from "../../../components/Input";
import {
  getAllPatientForDoctorService,
  postSendRemedyService,
} from "../../../services/userService";
import RemedyModal from "./RemedyModal";
import LoadingOverlay from "react-loading-overlay";

const ManagePatient = (props) => {
  const language = useSelector((state) => state.app.language);
  const userInfo = useSelector((state) => state.user.userInfo);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [dataPatient, setDataPatient] = useState([]);
  const [isOpenRemedyModal, setIsOpenRemedyModal] = useState(false);
  const [dataModal, setDataModal] = useState({});
  const [isShowLoading, setIsShowLoading] = useState(false);

  useEffect(() => {
    // Logic when language changes if needed
  }, [language]);

  useEffect(() => {
    getDataPatient();
  }, [currentDate]);

  const getDataPatient = async () => {
    let formatedDate = new Date(
      new Date(currentDate).setHours(0, 0, 0, 0)
    ).getTime();
    let res = await getAllPatientForDoctorService({
      doctorId: userInfo.id,
      date: formatedDate,
    });

    if (res && res.errCode === 0) {
      setDataPatient(res.data);
    }
  };

  const handleOnChangeDatePicker = async (date) => {
    setCurrentDate(date[0]);
    await getDataPatient();
  };

  const handleConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    setDataModal(data);
    setIsOpenRemedyModal(!isOpenRemedyModal);
  };

  const closeRemedyModal = () => {
    setIsOpenRemedyModal(!isOpenRemedyModal);
    setDataModal({});
  };
  const handleCancel = (item) => {
    console.log("item", item);
  };

  const sendRemedy = async (dataChild) => {
    setIsShowLoading(true);
    let res = await postSendRemedyService({
      ...dataChild,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: language,
      patientName: dataModal.patientName,
    });
    if (res && res.errCode === 0) {
      setIsShowLoading(false);
      toast.success(res.message);
      closeRemedyModal();
      await getDataPatient();
    } else {
      setIsShowLoading(false);
      toast.error(res.message);
    }
  };

  return (
    <>
      <LoadingOverlay active={isShowLoading} spinner text="Loading...">
        <div className="manage-patient-container">
          <div className="manage-patient-title">
            <FormattedMessage id="manage-patient.title" />
          </div>
          <div className="container manage-patient-body">
            <div className="row g-3">
              <div className="col-4">
                <label htmlFor="" className="form-label">
                  <FormattedMessage id="manage-patient.select-date" />
                </label>
                <DatePicker
                  onChange={handleOnChangeDatePicker}
                  className="form-control date-picker"
                  value={currentDate}
                />
              </div>
              <div className="mt-3 mb-5 table-manage-patient">
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Id</th>
                      <th>
                        <FormattedMessage id="manage-user.email" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-patient.time" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-patient.fullname" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-user.address" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-user.gender" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-user.phone-number" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-user.actions" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        return (
                          <tr key={`patient-${index}`}>
                            <th scope="row">{item.id}</th>
                            <td>{item?.patientData.email}</td>
                            <td>
                              {language === LANGUAGES.VI
                                ? item?.timeTypeDataPatient.valueVi
                                : item?.timeTypeDataPatient.valueEn}
                            </td>
                            <td>{item?.patientData.firstName}</td>
                            <td>{item?.patientData.address}</td>
                            <td>
                              {language === LANGUAGES.VI
                                ? item?.patientData?.genderData.valueVi
                                : item?.patientData.genderData.valueEn}
                            </td>
                            <td>{item?.patientData.phoneNumber}</td>
                            <td>
                              <button
                                className="btn-confirm"
                                onClick={() => handleConfirm(item)}
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                type="submit"
                                className="btn-cancel"
                                onClick={() => handleCancel(item)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <>
                        <tr>
                          <td colSpan={8} className="text-center">
                            <FormattedMessage id="manage-patient.not-found-patient" />
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <RemedyModal
          isOpenModal={isOpenRemedyModal}
          dataModal={dataModal}
          closeRemedyModal={closeRemedyModal}
          sendRemedy={sendRemedy}
        />
      </LoadingOverlay>
    </>
  );
};

export default ManagePatient;
