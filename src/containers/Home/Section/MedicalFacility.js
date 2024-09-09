import React from "react";
import { useState } from "react";
import Slider from "react-slick";
import { getAllClinicService } from "../../../services/userService";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./MedicalFacility.scss";

const MedicalFacility = (props) => {
  const { settings } = props;
  const history = useHistory();

  const [dataClinics, setDataClinics] = useState([]);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    let res = await getAllClinicService();
    console.log("check res", res);
    if (res && res.errCode === 0) {
      setDataClinics(res.data ? res.data : []);
    }
  };

  const handleViewDetailClinic = (clinic) => {
    history.push(`/detail-clinic/${clinic.id}`);
  };

  return (
    <div className="section-share section-medical-facility">
      <div className="container">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.outstanding-medical-facilities" />
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...settings}>
              {dataClinics &&
                dataClinics.length > 0 &&
                dataClinics.map((item, index) => {
                  return (
                    <div
                      className="section-custom clinic-child"
                      key={`clinic-${index}`}
                      onClick={() => handleViewDetailClinic(item)}
                    >
                      <div
                        className="bg-img section-medical-facility"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <div className="section-title clinic-name">
                        {item.name}
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalFacility;
