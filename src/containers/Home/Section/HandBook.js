import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";

const HandBook = (props) => {
  const { settings } = props;

  return (
    <div className="section-share section-handbook">
      <div className="container">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cẩm nang</span>
            <button className="btn-section">Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...settings}>
              <div className="section-custom">
                <div className="bg-img section-handbook"></div>
                <div className="section-title">Cẩm nang</div>
              </div>
              <div className="section-custom">
                <div className="bg-img section-handbook"></div>
                <div className="section-title">Cẩm nang</div>
              </div>
              <div className="section-custom">
                <div className="bg-img section-handbook"></div>
                <div className="section-title">Cẩm nang</div>
              </div>
              <div className="section-custom">
                <div className="bg-img section-handbook"></div>
                <div className="section-title">Cẩm nang</div>
              </div>
              <div className="section-custom">
                <div className="bg-img section-handbook"></div>
                <div className="section-title">Cẩm nang</div>
              </div>
              <div className="section-custom">
                <div className="bg-img section-handbook"></div>
                <div className="section-title">Cẩm nang</div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandBook;
