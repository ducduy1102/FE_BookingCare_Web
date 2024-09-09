import React from "react";
import { useSelector } from "react-redux";
import { LANGUAGES } from "../../utils";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

const DefaultClass = (props) => {
  const language = useSelector((state) => state.app.language);

  useEffect(() => {
    // Logic when language changes if needed
  }, [language]);

  return <></>;
};

export default DefaultClass;
