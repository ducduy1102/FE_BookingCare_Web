import React from "react";
import { useSelector } from "react-redux";
import { LANGUAGES } from "../../utils";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from "../Home/HomeHeader";
import "./VerifyEmail.scss";

const VerifyEmail = (props) => {
  const language = useSelector((state) => state.app.language);

  const [statusVerify, setStatusVerify] = useState(false);
  const [errCode, setErrCode] = useState(0);

  useEffect(() => {
    fetchVerifyBookAppointment();
  }, []);

  const fetchVerifyBookAppointment = async () => {
    if (props?.location?.search) {
      let urlParams = new URLSearchParams(props.location.search);
      let token = urlParams.get("token");
      let doctorId = urlParams.get("doctorId");
      let res = await postVerifyBookAppointment({
        doctorId: doctorId,
        token: token,
      });
      if (res && res.errCode === 0) {
        setStatusVerify(true);
        setErrCode(res.errCode);
      } else {
        setStatusVerify(true);
        setErrCode(res && res.errCode ? res.errCode : -1);
      }
    }
  };

  useEffect(() => {
    // Logic when language changes if needed
  }, [language]);

  return (
    <>
      <HomeHeader isShowBanner={false} />
      <div className="container verify-email-container">
        {statusVerify === false ? (
          <div>Loading data...</div>
        ) : (
          <div>
            {+errCode === 0 ? (
              <div className="infor-booking-success">
                <FormattedMessage id="patient.verify-email.success" />
              </div>
            ) : (
              <div className="infor-booking-failed">
                <FormattedMessage id="patient.verify-email.failed" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default VerifyEmail;
