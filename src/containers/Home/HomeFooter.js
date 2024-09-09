import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import { FormattedMessage } from "react-intl";

const HomeFooter = () => {
  return (
    <footer className="home-footer">
      <div className="container">
        <p>
          &copy; Copyright 2024 Duc Duy. More information, please visit my
          Facebook.
          <a
            href="https://www.facebook.com/ducduy1110"
            target="_blank"
            rel="noreferrer"
          >
            &#8594; Click here &#8592;
          </a>
        </p>
      </div>
    </footer>
  );
};

export default HomeFooter;
