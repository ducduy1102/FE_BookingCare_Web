import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/UserManage";
import UserRedux from "../containers/System/Admin/UserRedux";
import Header from "../containers/Header/Header";
import ManageDoctor from "../containers/System/Admin/ManageDoctor";
import UserAdmin from "../containers/System/UserAdmin";
import ManageClinic from "../containers/System/Clinic/ManageClinic";
import ManageSpecialty from "../containers/System/Specialty/ManageSpecialty";
import ManageHandbook from "../containers/System/Handbook/ManageHandbook";

const System = () => {
  const systemMenuPath = useSelector((state) => state.app.systemMenuPath);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <>
      {isLoggedIn && <Header />}
      <div className="system-container">
        <div className="system-list">
          <Switch>
            <Route path="/system/user-manage" component={UserManage} />
            <Route path="/system/user-redux" component={UserRedux} />
            <Route path="/system/manage-doctor" component={ManageDoctor} />
            <Route path="/system/user-admin" component={UserAdmin} />
            <Route path="/system/manage-clinic" component={ManageClinic} />
            <Route
              path="/system/manage-specialty"
              component={ManageSpecialty}
            />
            <Route path="/system/manage-handbook" component={ManageHandbook} />

            <Route component={() => <Redirect to={systemMenuPath} />} />
          </Switch>
        </div>
      </div>
    </>
  );
};

export default System;
