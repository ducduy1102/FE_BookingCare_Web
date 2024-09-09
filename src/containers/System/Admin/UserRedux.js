import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
// import { getAllCodeService } from "../../../services/userService";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import {
  fetchGenderStart,
  fetchPositionStart,
  fetchRoleStart,
  createNewUserStart,
  editUserStart,
} from "../../../store/actions";
import "../UserManage.scss";
import "./UserRedux.scss";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";
import _ from "lodash";
import TableManageUser from "./TableManageUser";

const UserRedux = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const genderRedux = useSelector((state) => state.admin.genders);
  const positionRedux = useSelector((state) => state.admin.positions);
  const roleRedux = useSelector((state) => state.admin.roles);
  const isLoading = useSelector((state) => state.admin.isLoading);
  const usersRedux = useSelector((state) => state.admin.users);

  const createNewUser = (data) => dispatch(createNewUserStart(data));
  const editUserRedux = (data) => dispatch(editUserStart(data));
  const [isOpen, setIsOpen] = useState(false);
  const [previewImgURL, setPreviewImgURL] = useState("");
  const [action, setAction] = useState("");

  // c2: call api trong redux rồi gọi ra
  useEffect(() => {
    dispatch(fetchGenderStart());
    dispatch(fetchPositionStart());
    dispatch(fetchRoleStart());
  }, []);

  // const [genderArr, setGenderArr] = useState([]);
  // useEffect(() => {
  //   setGenderArr(genderRedux);
  // }, [genderRedux]);

  const defaulUserData = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    gender: genderRedux && genderRedux.length > 0 ? genderRedux[0].keyMap : "",
    positionId:
      positionRedux && positionRedux.length > 0 ? positionRedux[0].keyMap : "",
    roleId: roleRedux && roleRedux.length > 0 ? roleRedux[0].keyMap : "",
    avatar: "",
  };

  const defaultValidInputs = {
    email: true,
    password: true,
    firstName: true,
    lastName: true,
    address: true,
    phoneNumber: true,
  };

  useEffect(() => {
    if (usersRedux) {
      setAction(CRUD_ACTIONS.CREATE);
      setPreviewImgURL("");
    }
  }, [usersRedux]);

  const [validInputs, setValidInputs] = useState(defaultValidInputs);
  const [userData, setUserData] = useState(defaulUserData);

  useEffect(() => {
    if (genderRedux && genderRedux.length > 0) {
      setUserData((prevData) => ({
        ...prevData,
        gender: genderRedux[0].keyMap,
      }));
    } else {
      return;
    }
  }, [genderRedux]);

  useEffect(() => {
    if (roleRedux && roleRedux.length > 0) {
      setUserData((prevData) => ({
        ...prevData,
        roleId: roleRedux[0].keyMap,
      }));
    } else {
      return;
    }
  }, [roleRedux]);

  useEffect(() => {
    if (positionRedux.length > 0) {
      setUserData((prevData) => ({
        ...prevData,
        positionId: positionRedux[0].keyMap,
      }));
    } else {
      return;
    }
  }, [positionRedux]);

  const handleOnChangeImage = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      // console.log("base64 file image: ", base64);
      let objectUrl = URL.createObjectURL(file);
      setPreviewImgURL(objectUrl);
      setUserData({ ...userData, avatar: base64 });
    }
  };

  const openPreviewImage = () => {
    if (!previewImgURL) return;
    setIsOpen(true);
  };

  const handleOnChangeInput = (value, name) => {
    let _userData = _.cloneDeep(userData);
    _userData[name] = value;

    setUserData(_userData);
  };

  const checkValidateInputs = () => {
    let arrInput = [
      "email",
      "password",
      "firstName",
      "lastName",
      "address",
      "phoneNumber",
    ];
    let isValid = true;
    for (let i = 0; i < arrInput.length; i++) {
      if (!userData[arrInput[i]]) {
        let _validInputs = _.cloneDeep(defaultValidInputs);
        _validInputs[arrInput[i]] = false;
        setValidInputs(_validInputs);
        alert("Missing parameters: " + arrInput[i]);

        isValid = false;
        break;
      }
    }

    return isValid;
  };

  const handleSaveUser = (event) => {
    event.preventDefault();
    let isValid = checkValidateInputs();
    if (isValid === false) return;
    if (action === CRUD_ACTIONS.CREATE) {
      createNewUser(userData);
    }
    if (action === CRUD_ACTIONS.EDIT) {
      editUserRedux({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        roleId: userData.roleId,
        positionId: userData.positionId,
        avatar: userData.avatar,
      });
    }
    setUserData(defaulUserData);
  };
  const handleEditUserFromParent = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }
    // console.log("check handle Edit User From Parent", user);
    setUserData({
      email: user.email,
      password: "HARDCODE",
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      roleId: user.roleId,
      positionId: user.positionId,
      avatar: "",
      id: user.id,
    });
    setPreviewImgURL(imageBase64);
    setAction(CRUD_ACTIONS.EDIT);
  };

  return (
    <div className="container user-redux-container">
      <div className="title">User Manage Redux</div>
      {isLoading === true ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="user-redux-body">
          <div className="container">
            <div className="row">
              <div className="row g-3">
                <div className="my-3 col-12">
                  <FormattedMessage id="manage-user.add" />
                </div>
                <div className="col-md-3">
                  <label htmlFor="email" className="form-label">
                    <FormattedMessage id="manage-user.email" />
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email..."
                    value={userData.email}
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "email")
                    }
                    disabled={action === CRUD_ACTIONS.EDIT ? true : false}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="password" className="form-label">
                    <FormattedMessage id="manage-user.password" />
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Enter your password..."
                    value={userData.password}
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "password")
                    }
                    disabled={action === CRUD_ACTIONS.EDIT ? true : false}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="firstName" className="form-label">
                    <FormattedMessage id="manage-user.first-name" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name..."
                    value={userData.firstName}
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "firstName")
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="lastName" className="form-label">
                    <FormattedMessage id="manage-user.last-name" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name..."
                    value={userData.lastName}
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "lastName")
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    <FormattedMessage id="manage-user.phone-number" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your phone number..."
                    value={userData.phoneNumber}
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "phoneNumber")
                    }
                  />
                </div>
                <div className="col-md-9">
                  <label htmlFor="address" className="form-label">
                    <FormattedMessage id="manage-user.address" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    placeholder="Enter your address..."
                    value={userData.address}
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "address")
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="gender" className="form-label">
                    <FormattedMessage id="manage-user.gender" />
                  </label>
                  <select
                    id="gender"
                    className="form-select"
                    name="gender"
                    value={userData.gender}
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "gender")
                    }
                  >
                    {genderRedux &&
                      genderRedux.length > 0 &&
                      genderRedux.map((item, index) => {
                        return (
                          <option key={`gender-${index}`} value={item.keyMap}>
                            {language === LANGUAGES.VI
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-md-3">
                  <label htmlFor="positionId" className="form-label">
                    <FormattedMessage id="manage-user.position" />
                  </label>
                  <select
                    id="positionId"
                    className="form-select"
                    name="positionId"
                    value={userData.positionId}
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "positionId")
                    }
                  >
                    {positionRedux &&
                      positionRedux.length > 0 &&
                      positionRedux.map((item, index) => {
                        return (
                          <option key={`position-${index}`} value={item.keyMap}>
                            {language === LANGUAGES.VI
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-md-3">
                  <label htmlFor="roleId" className="form-label">
                    <FormattedMessage id="manage-user.role" />
                  </label>
                  <select
                    id="roleId"
                    className="form-select"
                    name="roleId"
                    value={userData.roleId}
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "roleId")
                    }
                  >
                    {roleRedux &&
                      roleRedux.length > 0 &&
                      roleRedux.map((item, index) => {
                        return (
                          <option key={`role-${index}`} value={item.keyMap}>
                            {language === LANGUAGES.VI
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-md-3">
                  <label htmlFor="avatar" className="form-label">
                    <FormattedMessage id="manage-user.avatar" />
                  </label>
                  <div className="preview-img-container">
                    <input
                      type="file"
                      name="avatar"
                      id="preview-img"
                      onChange={(e) => handleOnChangeImage(e)}
                      hidden
                    />
                    <label className="label-upload" htmlFor="preview-img">
                      <FormattedMessage id="manage-user.upload-image" />{" "}
                      <i className="fas fa-cloud-upload-alt"></i>
                    </label>
                    <div
                      className="preview-img"
                      style={{
                        backgroundImage: `url(${previewImgURL})`,
                      }}
                      onClick={() => openPreviewImage()}
                    ></div>
                  </div>
                </div>
                <div className="my-3 col-12">
                  <button
                    type="button"
                    className={
                      action === CRUD_ACTIONS.EDIT
                        ? "btn btn-warning"
                        : "btn btn-primary"
                    }
                    onClick={(e) => handleSaveUser(e)}
                  >
                    {action === CRUD_ACTIONS.EDIT ? (
                      <FormattedMessage id="manage-user.edit" />
                    ) : (
                      <FormattedMessage id="manage-user.save" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <TableManageUser
            handleEditUserFromParentKey={handleEditUserFromParent}
          />
        </div>
      )}
      {isOpen === true && (
        <Lightbox
          mainSrc={previewImgURL}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserRedux;
