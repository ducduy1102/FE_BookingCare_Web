import React from "react";
import { useSelector } from "react-redux";
import { LANGUAGES } from "../../../utils";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import "./DetailClinic.scss";
import HomeHeader from "../../Home/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getAllCodeService,
  getDetailClinicByIdService,
} from "../../../services/userService";
import _ from "lodash";

const DetailClinic = (props) => {
  const language = useSelector((state) => state.app.language);
  const [dataDetailClinic, setDataDetailClinic] = useState([]);
  const [arrDoctorId, setArrDoctorId] = useState([]);
  useEffect(() => {
    // Logic when language changes if needed
    getDetailClinicById();
  }, []);

  const getDetailClinicById = async () => {
    if (props.match?.params?.id) {
      let id = props.match.params.id;
      let res = await getDetailClinicByIdService({
        id: id,
      });

      if (res?.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorClinic;
          if (arr && arr.length > 0) {
            arr.forEach((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }
        setDataDetailClinic(res.data);
        setArrDoctorId(arrDoctorId);
      }
    }
  };

  return (
    <div className="detail-clinic-container">
      <HomeHeader isShowBanner={false} />
      <div className="description-clinic">
        <div className="container">
          {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
            <>
              <div className="name-clinic">{dataDetailClinic.name}</div>
              <div
                className="container"
                dangerouslySetInnerHTML={{
                  __html: dataDetailClinic.descriptionHTML,
                }}
              ></div>
            </>
          )}
        </div>
      </div>
      <div className="child-doctor-container">
        <div className="container">
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

export default DetailClinic;
