import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./HomeHeader.scss";
import logo from "../../assets/images/logo.svg";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions";
import viFlag from "../../assets/images/vietnam-flag.svg";
import enFlag from "../../assets/images/en-flag.svg";

const HomeHeader = (props) => {
  const dispatch = useDispatch();
  // const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const language = useSelector((state) => state.app.language);
  // const processLogout = () => dispatch(actions.processLogout());

  const changeLanguage = (language) => {
    //fire redux event (actions)
    dispatch(changeLanguageApp(language));
  };

  return (
    <>
      <div className=" home-header-container">
        <div className="container home-header-content">
          <div className="left-content">
            <i className="fas fa-bars"></i>
            <Link to="/home">
              <img src={logo} alt="Booking Care" className="header-logo" />
            </Link>
          </div>
          <div className="center-content">
            <div className="child-content">
              <div>
                <b>
                  <FormattedMessage id="home-header.specialty" />
                </b>
              </div>
              <div className="sub-title">
                <FormattedMessage id="home-header.search-doctor" />
              </div>
            </div>
            <div className="child-content">
              <div>
                <b>
                  <FormattedMessage id="home-header.health-facility" />
                </b>
              </div>
              <div className="sub-title">
                <FormattedMessage id="home-header.choose-hospital" />
              </div>
            </div>
            <div className="child-content">
              <div>
                <b>
                  <FormattedMessage id="home-header.doctor" />
                </b>
              </div>
              <div className="sub-title">
                <FormattedMessage id="home-header.choose-doctor" />
              </div>
            </div>
            <div className="child-content">
              <div>
                <b>
                  <FormattedMessage id="home-header.fee" />
                </b>
              </div>
              <div className="sub-title">
                <FormattedMessage id="home-header.general-health-check" />
              </div>
            </div>
          </div>
          <div className="right-content">
            <div className="support">
              <i className="fas fa-question-circle"></i>
              <FormattedMessage id="home-header.support" />
            </div>
            <div
              className={
                language === "vi" ? "language-vi active" : "language-vi"
              }
            >
              <img
                src={viFlag}
                alt=""
                className="img-vi"
                onClick={() => changeLanguage(LANGUAGES.VI)}
              />
              <span
                className="text-vi"
                onClick={() => changeLanguage(LANGUAGES.VI)}
              >
                VN
              </span>
            </div>
            <div
              className={
                language === "en" ? "language-en active" : "language-en"
              }
            >
              <img
                src={enFlag}
                alt=""
                className="img-en"
                onClick={() => changeLanguage(LANGUAGES.EN)}
              />
              <span
                className="text-en"
                onClick={() => changeLanguage(LANGUAGES.EN)}
              >
                EN
              </span>
            </div>
          </div>
        </div>
      </div>
      {props.isShowBanner && (
        <div className="home-header-banner">
          <div className="overlay"></div>
          <div className="content-up">
            <div className="main-title">
              <FormattedMessage id="banner.main-title" />
            </div>
            <div className="slogan">
              <FormattedMessage id="banner.slogan" />
            </div>
            <div className="search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Tìm chuyên khoa khám bệnh..."
              />
            </div>
          </div>
          <div className="content-down">
            <div className="options">
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-hospital"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.specialty" />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.remote" />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-procedures"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.general" />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-flask"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.medical-test" />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-user-md"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.mental-health" />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-briefcase-medical"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.dental" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeHeader;
