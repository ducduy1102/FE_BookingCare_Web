import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewUser,
  deleteUser,
  editUser,
  getAllUsers,
} from "../../services/userService";
import "./UserManage.scss";
import ModalUser from "./ModalUser";
import { emitter } from "../../utils/emitter";
import ModalEditUser from "./ModalEditUser";

const UserManage = () => {
  const [arrUsers, setArrUsers] = useState([]);

  // Modal update/create user
  const [isOpenModalUser, setIsOpenModalUser] = useState(false);
  const [isOpenModalEditUser, setIsOpenModalEditUser] = useState(false);
  const [userDataEdit, setUserDataEdit] = useState({});

  // const dispatch = useDispatch();
  // const state = useSelector((state) => state); // Adjust according to your state structure

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    let res = await getAllUsers("ALL");

    if (res && res.errCode === 0) {
      setArrUsers(res.users);
    }
  };

  const confirmCreateNewUser = async (data) => {
    try {
      const res = await createNewUser(data);
      if (res && res.errCode !== 0) {
        alert(res.message);
      } else {
        await fetchUsers();
        setIsOpenModalUser(false);
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditUser = (user) => {
    // console.log("check user", user);
    setIsOpenModalEditUser(true);
    setUserDataEdit(user);
  };

  const doEditUser = async (user) => {
    // console.log("click edit", user);
    try {
      let res = await editUser(user);
      // console.log("res", res);
      if (res && res.errCode !== 0) {
        console.log(res.message);
      } else {
        setIsOpenModalEditUser(false);
        await fetchUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      let res = await deleteUser(user.id);
      if (res && res.errCode === 0) {
        await fetchUsers();
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="users-container">
      <div className="container">
        <ModalUser
          isOpen={isOpenModalUser}
          toggleUserModal={() => setIsOpenModalUser(!isOpenModalUser)}
          confirmCreateNewUser={confirmCreateNewUser}
        />
        {isOpenModalEditUser && (
          <ModalEditUser
            isOpen={isOpenModalEditUser}
            toggleUserModal={() => setIsOpenModalEditUser(!isOpenModalEditUser)}
            currentUser={userDataEdit}
            editUser={doEditUser}
          />
        )}

        <div className="text-center title">Manage Users</div>
        <div className="mx-1">
          <button
            className="btn btn-primary"
            onClick={() => setIsOpenModalUser(true)}
          >
            <i className="fa fa-plus-circle"></i> Add new user
          </button>
        </div>
        <div className="users-content">
          <div className="mt-3 table-user">
            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {arrUsers && arrUsers.length > 0 ? (
                  arrUsers.map((item, index) => {
                    return (
                      <tr key={`user-${index}`}>
                        <th scope="row">{item.id}</th>
                        <td>{item.email}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.address}</td>
                        <td>{item.gender === 1 ? "Male" : "Female"}</td>
                        <td>{item.phoneNumber}</td>
                        <td>
                          {item.roleId === "R1"
                            ? "Admin"
                            : item.roleId === "R2"
                            ? "Doctor"
                            : "Patient"}
                        </td>
                        <td>{item.positionId} </td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => handleEditUser(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            type="submit"
                            className="btn-delete"
                            onClick={() => handleDeleteUser(item)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td colSpan={9} className="text-center">
                        Not found users
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManage;
