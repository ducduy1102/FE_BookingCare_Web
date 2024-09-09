import React from "react";
import { useSelector } from "react-redux";
import { LANGUAGES } from "../../../utils";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import "./DoctorExtraInfor.scss";
import { getExtraInforDoctorByIdService } from "../../../services/userService";
import NumberFormat from "react-number-format";

const DoctorExtraInfor = (props) => {
  const language = useSelector((state) => state.app.language);

  const [isShowDetailInfor, setIsShowDetailInfor] = useState(false);
  const [extraInfor, setExtraInfor] = useState({});

  useEffect(() => {
    // Logic when language changes if needed
  }, [language]);

  useEffect(() => {
    const fetchData = async () => {
      if (props.doctorIdFromParent) {
        try {
          const res = await getExtraInforDoctorByIdService(
            props.doctorIdFromParent
          );

          if (res && res.errCode === 0) {
            setExtraInfor(res.data);
          }
        } catch (error) {
          console.error("Error fetching extra infor doctor", error);
        }
      }
    };

    fetchData();
  }, [props.doctorIdFromParent]);

  return (
    <div className="doctor-extra-infor-container">
      <div className="content-up">
        <div className="text-address">
          <FormattedMessage id="patient.extra-infor-doctor.text-address" />
        </div>
        <div className="name-clinic">{extraInfor?.nameClinic || ""}</div>
        <div className="detail-address">{extraInfor?.addressClinic || ""}</div>
      </div>
      <div className="content-down">
        {!isShowDetailInfor ? (
          <div className="short-infor">
            <FormattedMessage id="patient.extra-infor-doctor.price" />:
            {extraInfor?.priceTypeData && language === LANGUAGES.VI && (
              <NumberFormat
                className="currency"
                value={extraInfor.priceTypeData.valueVi}
                displayType={"text"}
                thousandSeparator={true}
                suffix={"VND"}
              />
            )}
            {extraInfor?.priceTypeData && language === LANGUAGES.EN && (
              <NumberFormat
                className="currency"
                value={extraInfor.priceTypeData.valueEn}
                displayType={"text"}
                thousandSeparator={true}
                suffix={"$"}
              />
            )}
            <span className="detail" onClick={() => setIsShowDetailInfor(true)}>
              {" "}
              <FormattedMessage id="patient.extra-infor-doctor.detail" />
            </span>
          </div>
        ) : (
          <>
            <div className="title-price">
              <FormattedMessage id="patient.extra-infor-doctor.price" />
            </div>
            <div className="up-container">
              <div className="left">
                <div className="left-title">
                  <FormattedMessage id="patient.extra-infor-doctor.price" />
                </div>
                <div className="note">{extraInfor?.note || ""}</div>
              </div>
              <div className="right">
                <div className="price">
                  {extraInfor?.priceTypeData && language === LANGUAGES.VI && (
                    <NumberFormat
                      value={extraInfor.priceTypeData.valueVi}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={"VND"}
                    />
                  )}
                  {extraInfor?.priceTypeData && language === LANGUAGES.EN && (
                    <NumberFormat
                      value={extraInfor.priceTypeData.valueEn}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={"$"}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="down-container">
              <div className="payment">
                <FormattedMessage id="patient.extra-infor-doctor.payment" />:{" "}
                {extraInfor?.paymentTypeData && language === LANGUAGES.VI
                  ? extraInfor.paymentTypeData.valueVi
                  : " "}
                {extraInfor?.paymentTypeData && language === LANGUAGES.EN
                  ? extraInfor.paymentTypeData.valueEn
                  : " "}
              </div>
            </div>
            <div className="hide-price">
              <span onClick={() => setIsShowDetailInfor(false)}>
                <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorExtraInfor;
