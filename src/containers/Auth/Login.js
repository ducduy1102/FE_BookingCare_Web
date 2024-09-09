import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../store/actions";
import "./Login.scss";
import { handleLogin } from "../../services/userService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  // C1
  // const userLoginSuccess = (userInfo) =>
  //   dispatch(actions.userLoginSuccess(userInfo));

  const handleUserLogin = async () => {
    setErrorMessage("");

    try {
      let data = await handleLogin(username, password);
      if (data && data.errCode !== 0) {
        setErrorMessage(data.message);
      }
      if (data && data.errCode === 0) {
        // C1
        // userLoginSuccess(data.user);

        // C2
        dispatch(actions.userLoginSuccess(data.user));
      }
    } catch (error) {
      if (error?.response?.data) {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      handleUserLogin();
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-content row">
          <div className="text-login">Login</div>
          <div className="form-group login-input">
            <label className="text-label">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              className="form-control"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group login-input">
            <label className="text-label">Password</label>
            <div className="custom-input-password">
              <input
                type={isShowPassword ? "text" : "password"}
                name="password"
                value={password}
                className="form-control"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
              />
              <span onClick={() => setIsShowPassword(!isShowPassword)}>
                <i
                  className={isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}
                ></i>
              </span>
            </div>
          </div>
          <div className="" style={{ color: "red" }}>
            {errorMessage}
          </div>
          <div className="">
            <button className="btn-login" onClick={() => handleUserLogin()}>
              Login
            </button>
          </div>
          <div className="">
            <span className="forgot-password">Forgot your password</span>
          </div>
          <div className="mt-3 text-center">
            <span className="text-other-login">Or Login With</span>
          </div>
          <div className="social-login">
            <i className="fab fa-google-plus-g google"></i>
            <i className="fab fa-facebook-f facebook"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
