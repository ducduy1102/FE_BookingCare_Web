import React from "react";
import { useSelector } from "react-redux";
import HomeHeader from "../../Home/HomeHeader";
import "./DetailDoctor.scss";
import { getDetailInforDoctorService } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import { useEffect, useState } from "react";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfor from "./DoctorExtraInfor";
import Comment from "../SocialPlugin/Comment";
import LikeAndShare from "../SocialPlugin/LikeAndShare";

const DetailDoctor = (props) => {
  const language = useSelector((state) => state.app.language);

  const [detailDoctor, setDetailDoctor] = useState({});
  const [currentDoctorId, setCurrentDoctorId] = useState(-1);

  let currentURL =
    +process.env.REACT_APP_IS_LOCALHOST === 1
      ? "https://monkey-blogging-sooty.vercel.app/"
      : window.location.href;

  let nameVi = "";
  let nameEn = "";

  useEffect(() => {
    getDetailInforDoctor();
  }, []);

  const getDetailInforDoctor = async () => {
    if (props.match?.params?.id) {
      let id = props.match.params.id;
      setCurrentDoctorId(id);
      let res = await getDetailInforDoctorService(id);
      if (res && res.errCode === 0) {
        setDetailDoctor(res.data);
      }
    }
  };

  if (detailDoctor?.positionData) {
    nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
    nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
  }

  return (
    <>
      <HomeHeader isShowBanner={false} />
      <div className="doctor-detail-container">
        <div className="container intro-doctor">
          <div
            className="content-left"
            style={{
              backgroundImage: `url(${
                detailDoctor?.image ? detailDoctor.image : ""
              })`,
            }}
          ></div>
          <div className="content-right">
            <div className="content-right-title">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="content-right-desc">
              {detailDoctor?.Markdown?.description && (
                <span>{detailDoctor.Markdown.description}</span>
              )}
              <div className="like-share-plugin">
                <LikeAndShare dataHref={currentURL} />
              </div>
            </div>
          </div>
        </div>
        <div className="container schedule-doctor">
          <div className="content-left">
            <DoctorSchedule doctorIdFromParent={currentDoctorId} />
          </div>
          <div className="content-right">
            <DoctorExtraInfor doctorIdFromParent={currentDoctorId} />
          </div>
        </div>
        <div className="detail-info-doctor">
          {detailDoctor?.Markdown?.contentHTML && (
            <div
              className="container"
              dangerouslySetInnerHTML={{
                __html: detailDoctor.Markdown.contentHTML,
              }}
            ></div>
          )}
        </div>
        <div className="comment-doctor">
          <Comment dataHref={currentURL} width={"100%"} />
        </div>
      </div>
    </>
  );
};

export default DetailDoctor;
