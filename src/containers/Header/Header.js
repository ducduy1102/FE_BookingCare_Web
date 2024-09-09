// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Navigator from "../../components/Navigator";
// import { adminMenu, doctorMenu } from "./menuApp";
// import "./Header.scss";
// import { processLogout, changeLanguageApp } from "../../store/actions";
// import { LANGUAGES, USER_ROLE } from "../../utils";
// // import { changeLanguageApp } from "../../store/actions";
// import viFlag from "../../assets/images/vietnam-flag.svg";
// import enFlag from "../../assets/images/en-flag.svg";
// import { FormattedMessage } from "react-intl";
// import { useState } from "react";
// import _ from "lodash";
// import { useEffect } from "react";

// const Header = () => {
//   const dispatch = useDispatch();
//   const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
//   const userInfo = useSelector((state) => state.user.userInfo);
//   const processLogoutRedux = () => dispatch(processLogout());
//   const language = useSelector((state) => state.app.language);

//   const [menuApp, setMenuApp] = useState([]);

//   const changeLanguage = (language) => {
//     //fire redux event (actions)
//     dispatch(changeLanguageApp(language));
//   };

//   const updateMenu = () => {
//     let menu = [];
//     if (userInfo && !_.isEmpty(userInfo)) {
//       const role = userInfo.roleId;
//       if (role === USER_ROLE.ADMIN) {
//         menu = adminMenu;
//       }
//       if (role === USER_ROLE.DOCTOR) {
//         menu = doctorMenu;
//       }
//     }
//     setMenuApp(menu);
//   };

//   useEffect(() => {
//     updateMenu();
//   }, [userInfo]);

//   return (
//     <div className="header-container">
//       <div className="header-tabs-container">
//         <Navigator menus={menuApp} />
//       </div>

//       <div className="languages">
//         <span className="welcome">
//           <FormattedMessage id="home-header.welcome" />,{" "}
//           {userInfo?.firstName ? userInfo.firstName : "User"} !
//         </span>
//         <div
//           className={language === "vi" ? "language-vi active" : "language-vi"}
//         >
//           <img
//             src={viFlag}
//             alt=""
//             className="img-vi"
//             onClick={() => changeLanguage(LANGUAGES.VI)}
//           />
//           <span
//             className="text-vi"
//             onClick={() => changeLanguage(LANGUAGES.VI)}
//           >
//             VN
//           </span>
//         </div>
//         <div
//           className={language === "en" ? "language-en active" : "language-en"}
//         >
//           <img
//             src={enFlag}
//             alt=""
//             className="img-en"
//             onClick={() => changeLanguage(LANGUAGES.EN)}
//           />
//           <span
//             className="text-en"
//             onClick={() => changeLanguage(LANGUAGES.EN)}
//           >
//             EN
//           </span>
//         </div>
//         {/* nút logout */}
//         <div
//           className="btn btn-logout"
//           onClick={processLogoutRedux}
//           title="Log out"
//         >
//           <i className="fas fa-sign-out-alt"></i>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;

// c2
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu } from "./menuApp";
import "./Header.scss";
import { LANGUAGES, USER_ROLE } from "../../utils";
import { processLogout, changeLanguageApp } from "../../store/actions";
import viFlag from "../../assets/images/vietnam-flag.svg";
import enFlag from "../../assets/images/en-flag.svg";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

const Header = (props) => {
  const [menuApp, setMenuApp] = useState([]);

  const changeLanguage = (language) => {
    props.changeLanguageAppRedux(language);
  };

  const updateMenu = () => {
    const { userInfo } = props;
    let menu = [];
    if (userInfo && !_.isEmpty(userInfo)) {
      const role = userInfo.roleId;
      if (role === USER_ROLE.ADMIN) {
        menu = adminMenu;
      }
      if (role === USER_ROLE.DOCTOR) {
        menu = doctorMenu;
      }
    }
    setMenuApp(menu);
  };

  useEffect(() => {
    updateMenu();
  }, [props.userInfo]);

  const { processLogout, language, userInfo } = props;

  return (
    <div className="header-container">
      {/* thanh navigator */}
      <div className="header-tabs-container">
        <Navigator menus={menuApp} />
      </div>

      <div className="languages">
        <span className="welcome">
          <FormattedMessage id="home-header.welcome" />,{" "}
          {userInfo?.firstName ? userInfo.firstName : "User"} !
        </span>
        <div
          className={language === "vi" ? "language-vi active" : "language-vi"}
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
          className={language === "en" ? "language-en active" : "language-en"}
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
        {/* nút logout */}
        <div className="btn btn-logout" onClick={processLogout} title="Log out">
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(processLogout()),
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
