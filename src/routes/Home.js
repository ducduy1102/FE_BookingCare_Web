import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const linkToRedirect = isLoggedIn ? "/system/user-manage" : "/home";

  return <Redirect to={linkToRedirect} />;
};

export default Home;
