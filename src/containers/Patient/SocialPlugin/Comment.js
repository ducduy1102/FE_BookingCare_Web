import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";

const Comment = ({ width, dataHref, numPost }) => {
  const language = useSelector((state) => state.app.language);

  useEffect(() => {
    initFaceBookSDK();
  }, [language]);

  // useEffect(() => {
  //   // if (window.FB) {
  //   //   window.FB.XFBML.parse();
  //   // }
  // }, [language]);

  const initFaceBookSDK = () => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }

    let locale = language === LANGUAGES.VI ? "vi_VN" : "en_US";
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v2.5",
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

  return (
    <div
      className="fb-comments"
      data-href={dataHref}
      data-width={width || ""}
      data-share={numPost || 5}
    ></div>
  );
};

export default Comment;
