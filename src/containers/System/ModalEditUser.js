import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import _ from "lodash";
import { emitter } from "../../utils/emitter";

const ModalEditUser = (props) => {
  const defaulUserData = {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    gender: "",
    roleId: "",
  };

  const validInputsDefault = {
    email: true,
    firstName: true,
    lastName: true,
    address: true,
    phoneNumber: true,
    gender: true,
    roleId: true,
  };

  const toggle = () => {
    props.toggleUserModal();
  };

  const [userData, setUserData] = useState(defaulUserData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);

  useEffect(() => {
    let user = props.currentUser;
    // check ko rỗng
    if (user && !_.isEmpty(user)) {
      setUserData({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        roleId: user.roleId,
      });
    }
  }, []);

  const handleOnChangeInput = (value, name) => {
    let _userData = _.cloneDeep(userData);
    _userData[name] = value;

    setUserData(_userData);
  };

  const checkValidateInputs = () => {
    let arrInput = [
      "email",
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

  const handleEditUser = () => {
    let isValid = checkValidateInputs();
    if (isValid === true) {
      // call api create model
      props.editUser(userData);
    }
    // console.log("data", userData);
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
        <ModalHeader toggle={toggle}>Edit user</ModalHeader>
        <ModalBody>
          <form className="row g-3">
            <div className="form-group col-sm-6">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email..."
                name="email"
                value={userData.email}
                onChange={(e) => handleOnChangeInput(e.target.value, "email")}
                disabled
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="*******"
                name="password"
                disabled
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="firstName" className="form-label">
                First Name
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
                Last Name
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
                Address
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
                Phone Number
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
              <label className="form-label">Sex</label>
              <select
                className="form-select"
                onChange={(e) => handleOnChangeInput(e.target.value, "gender")}
                value={userData.gender}
              >
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </div>
            <div className="form-group col-sm-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                onChange={(e) => handleOnChangeInput(e.target.value, "roleId")}
                value={userData.roleId}
              >
                <option value="1">Admin</option>
                <option value="2">Doctor</option>
                <option value="3">Patient</option>
              </select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} className="px-3">
            Close
          </Button>
          <Button color="primary" className="px-3" onClick={handleEditUser}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalEditUser;
