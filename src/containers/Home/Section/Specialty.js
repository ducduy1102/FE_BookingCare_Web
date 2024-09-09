import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import { getAllSpecialtyService } from "../../../services/userService";
import "./Specialty.scss";
import { useHistory } from "react-router-dom";

const Specialty = (props) => {
  const { settings } = props;
  const history = useHistory();
  const [dataSpecialty, setDataSpecialty] = useState([]);

  useEffect(() => {
    fetchAllSpecialty();
  }, []);

  const fetchAllSpecialty = async () => {
    let res = await getAllSpecialtyService();
    if (res && res.errCode === 0) {
      setDataSpecialty(res.data ? res.data : []);
    }
  };

  const handleViewDetailSpecialty = (specialty) => {
    history.push(`/detail-specialty/${specialty.id}`);
  };

  return (
    <div className="section-share section-specialty">
      <div className="container">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.specialty-popular" />
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...settings}>
              {dataSpecialty &&
                dataSpecialty.length > 0 &&
                dataSpecialty.map((item, index) => {
                  return (
                    <div
                      className="section-custom specialty-child"
                      key={`specialty-${index}`}
                      onClick={() => handleViewDetailSpecialty(item)}
                    >
                      <div
                        className="bg-img section-specialty"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <div className="section-title specialty-name">
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

export default Specialty;
