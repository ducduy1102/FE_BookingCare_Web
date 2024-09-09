import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";

const LikeAndShare = ({ dataHref }) => {
  const language = useSelector((state) => state.app.language);

  useEffect(() => {
    const initFaceBookSDK = () => {
      if (window.FB) {
        window.FB.XFBML.parse();
      }

      let locale = language === LANGUAGES.VI ? "vi_VN" : "en_US";
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
          cookie: true, // enable cookies to allow the server to access the version
          xfbml: true, // parse social plugins on this page
          version: "v2.5", // version
        });
      };

      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = `//connect.facebook.net/${locale}/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    };

    initFaceBookSDK();
  }, [language]); // Runs when `language` changes

  return (
    <div
      className="fb-like"
      data-href={dataHref}
      data-width=""
      data-layout="standard"
      data-action="like"
      data-size="small"
      data-share="true"
    ></div>
  );
};

export default LikeAndShare;
