import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import _ from "lodash";
import { useSelector } from "react-redux";
import { emitter } from "../../utils/emitter";
import { getAllCodeService } from "../../services/userService";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";

const ModalUser = (props) => {
  const defaulUserData = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    gender: "",
    roleId: "",
  };

  const validInputsDefault = {
    email: true,
    password: true,
    firstName: true,
    lastName: true,
    address: true,
    phoneNumber: true,
    gender: true,
    roleId: true,
  };

  // useEffect(()=> {
  //   emitter.on("EVENT_CLEAR_MODAL_DATA", );
  // })

  const toggle = () => {
    props.toggleUserModal();
  };

  const [userData, setUserData] = useState(defaulUserData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);
  const language = useSelector((state) => state.app.language);
  const [genderArr, setGenderArr] = useState([]);
  const [roleArr, setRoleArr] = useState([]);

  const listenToEmitter = () => {
    emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
      setUserData(defaulUserData);
    });
  };

  const fetchAllCode = async () => {
    try {
      let resGender = await getAllCodeService("GENDER");
      let resRole = await getAllCodeService("ROLE");

      if (resGender && resGender.errCode === 0) {
        setGenderArr(resGender.data);
      }
      if (resRole && resRole.errCode === 0) {
        setRoleArr(resRole.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllCode();
    listenToEmitter();
  }, []);

  const handleOnChangeInput = (value, name) => {
    let _userData = _.cloneDeep(userData);
    _userData[name] = value;

    setUserData(_userData);
  };

  const checkValidateInputs = () => {
    // setValidInputs(validInputsDefault);
    // console.log("valid inpust", validInputs);
    let arrInput = [
      "email",
      "password",
      "firstName",
      "lastName",
      "address",
      "phoneNumber",
      "gender",
      "roleId",
    ];
    let isValid = true;
    for (let i = 0; i < arrInput.length; i++) {
      if (!userData[arrInput[i]]) {
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[arrInput[i]] = false;
        setValidInputs(_validInputs);
        alert("Missing parameters: " + arrInput[i]);

        // toast.error(`Empty input ${arrInput[i]}`);
        isValid = false;
        break;
      }
    }

    return isValid;
  };

  const handleAddNewUser = () => {
    let isValid = checkValidateInputs();
    if (isValid === true) {
      // call api create model
      // console.log("userData", userData);

      // console.log("gender", userData.gender);
      // console.log("role", userData.roleId);

      if (userData.gender === "Nam" || userData.gender === "Male") {
        userData.gender = 1;
      }
      if (userData.gender === "Nữ" || userData.gender === "Female") {
        userData.gender = 0;
      }
      if (userData.gender === "Khác" || userData.gender === "Other") {
        userData.gender = -1;
      }

      if (userData.roleId === "Quản trị viên" || userData.roleId === "Admin") {
        userData.roleId = 1;
      }
      if (userData.roleId === "Bác sĩ" || userData.roleId === "Doctor") {
        userData.roleId = 2;
      }
      if (userData.roleId === "Bệnh nhân" || userData.roleId === "Patient") {
        userData.roleId = 3;
      }
      props.confirmCreateNewUser(userData);
    }
  };

  return (
    <div>
      <Modal
        className="modal-user-container"
        isOpen={props.isOpen}
        toggle={toggle}
        size="lg"
        centered
      >
        <ModalHeader toggle={toggle}>
          <FormattedMessage id="manage-user.add" />
        </ModalHeader>
        <ModalBody>
          <form className="row g-3">
            <div className="form-group col-sm-6">
              <label htmlFor="email" className="form-label">
                <FormattedMessage id="manage-user.email" />
              </label>
              <input
                type="email"
                className={
                  validInputs.email ? "form-control" : "form-control is-invalid"
                }
                // className="form-control"
                placeholder="Enter your email..."
                name="email"
                value={userData.email}
                onChange={(e) => handleOnChangeInput(e.target.value, "email")}
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="password" className="form-label">
                <FormattedMessage id="manage-user.password" />
              </label>
              <input
                type="password"
                className={
                  validInputs.password
                    ? "form-control"
                    : "form-control is-invalid"
                }
                // className="form-control"
                placeholder="Enter your password..."
                name="password"
                value={userData.password}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "password")
                }
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="firstName" className="form-label">
                <FormattedMessage id="manage-user.first-name" />
              </label>
              <input
                type="text"
                className={
                  validInputs.firstName
                    ? "form-control"
                    : "form-control is-invalid"
                }
                // className="form-control"
                placeholder="Enter your first name..."
                name="firstName"
                value={userData.firstName}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "firstName")
                }
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="lastName" className="form-label">
                <FormattedMessage id="manage-user.last-name" />
              </label>
              <input
                type="text"
                className={
                  validInputs.lastName
                    ? "form-control"
                    : "form-control is-invalid"
                }
                // className="form-control"
                placeholder="Enter your last name..."
                name="lastName"
                value={userData.lastName}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "lastName")
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                <FormattedMessage id="manage-user.address" />
              </label>
              <input
                type="text"
                className={
                  validInputs.address
                    ? "form-control"
                    : "form-control is-invalid"
                }
                placeholder="Enter your address..."
                name="address"
                value={userData.address}
                onChange={(e) => handleOnChangeInput(e.target.value, "address")}
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="phoneNumber" className="form-label">
                <FormattedMessage id="manage-user.phone-number" />
              </label>
              <input
                type="text"
                className={
                  validInputs.phoneNumber
                    ? "form-control"
                    : "form-control is-invalid"
                }
                placeholder="Enter your phoneNumber..."
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "phoneNumber")
                }
              />
            </div>
            <div className="form-group col-sm-3">
              <label className="form-label">
                <FormattedMessage id="manage-user.gender" />
              </label>
              <select
                className="form-select"
                onChange={(e) => handleOnChangeInput(e.target.value, "gender")}
                value={userData.gender}
              >
                {genderArr &&
                  genderArr.length > 0 &&
                  genderArr.map((item, index) => {
                    return (
                      <option key={`gender-${index}`}>
                        {language === LANGUAGES.VI
                          ? item.valueVi
                          : item.valueEn}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="form-group col-sm-3">
              <label className="form-label">
                <FormattedMessage id="manage-user.role" />
              </label>
              <select
                className="form-select"
                onChange={(e) => handleOnChangeInput(e.target.value, "roleId")}
                value={userData.roleId}
              >
                {roleArr &&
                  roleArr.length > 0 &&
                  roleArr.map((item, index) => {
                    return (
                      <option key={`role-${index}`}>
                        {language === LANGUAGES.VI
                          ? item.valueVi
                          : item.valueEn}
                      </option>
                    );
                  })}
              </select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} className="px-3">
            Close
          </Button>
          <Button color="primary" className="px-3" onClick={handleAddNewUser}>
            Create
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalUser;
