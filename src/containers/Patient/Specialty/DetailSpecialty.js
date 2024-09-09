import React from "react";
import { useSelector } from "react-redux";
import { LANGUAGES } from "../../../utils";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import "./DetailSpecialty.scss";
import HomeHeader from "../../Home/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getAllCodeService,
  getDetailSpecialtyByIdService,
} from "../../../services/userService";
import _ from "lodash";

const DetailSpecialty = (props) => {
  const language = useSelector((state) => state.app.language);
  const [dataDetailSpecialty, setDataDetailSpecialty] = useState([]);
  const [arrDoctorId, setArrDoctorId] = useState([]);
  const [listProvince, setListProvince] = useState([]);
  useEffect(() => {
    // Logic when language changes if needed
    getDetailSpecialtyById();
  }, []);

  const getDetailSpecialtyById = async () => {
    if (props.match?.params?.id) {
      let id = props.match.params.id;
      let res = await getDetailSpecialtyByIdService({
        id: id,
        location: "ALL",
      });
      let resProvince = await getAllCodeService("PROVINCE");

      if (res?.errCode === 0 && resProvince?.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorSpecialty;
          if (arr && arr.length > 0) {
            arr.forEach((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }

        let dataProvince = resProvince.data;
        if (dataProvince && dataProvince.length > 0) {
          dataProvince.unshift({
            createdAt: null,
            keyMap: "ALL",
            type: "PROVINCE",
            valueEn: "All",
            valueVi: "Toàn quốc",
          });
        }

        setDataDetailSpecialty(res.data);
        setArrDoctorId(arrDoctorId);
        setListProvince(dataProvince ? dataProvince : []);
      }
    }
  };

  const handleOnChangeSelectedProvince = async (event) => {
    if (props.match?.params?.id) {
      let id = props.match.params.id;
      let location = event.target.value;
      let res = await getDetailSpecialtyByIdService({
        id: id,
        location: location,
      });

      // console.log("res", res);
      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorSpecialty;
          if (arr && arr.length > 0) {
            arr.forEach((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }

        setDataDetailSpecialty(res.data);
        setArrDoctorId(arrDoctorId);
      }
    }
  };

  return (
    <div className="detail-specialty-container">
      <HomeHeader isShowBanner={false} />
      <div className="description-specialty">
        <div className="container">
          {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
            <div
              className="container"
              dangerouslySetInnerHTML={{
                __html: dataDetailSpecialty.descriptionHTML,
              }}
            ></div>
          )}
        </div>
      </div>
      <div className="child-doctor-container">
        <div className="container">
          <div className="search-specialty-doctor">
            <select onChange={(e) => handleOnChangeSelectedProvince(e)}>
              {listProvince &&
                listProvince.length > 0 &&
                listProvince.map((item, index) => {
                  return (
                    <option key={`province-${index}`} value={item.keyMap}>
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </option>
                  );
                })}
            </select>
          </div>
          {arrDoctorId &&
            arrDoctorId.length > 0 &&
            arrDoctorId.map((item, index) => {
              return (
                <div className="child-doctor" key={`detail-doctor-${index}`}>
                  <div className="detail-content-left">
                    <div className="profile-doctor">
                      <ProfileDoctor
                        doctorId={item}
                        isShowDescriptionDoctor={true}
                        isShowLinkDetail={true}
                        isShowPrice={false}
                        // dataTime={dataTime}
                      />
                    </div>
                  </div>
                  <div className="detail-content-right">
                    <div className="doctor-schedule">
                      <DoctorSchedule doctorIdFromParent={item} />
                    </div>
                    <div className="doctor-extra-infor">
                      <DoctorExtraInfor doctorIdFromParent={item} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DetailSpecialty;
