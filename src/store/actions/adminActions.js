import actionTypes from "./actionTypes";
import {
  getAllCodeService,
  createNewUser,
  getAllUsers,
  deleteUser,
  editUser,
  getTopDoctorHomeService,
  getAllDoctorsService,
  saveDetailDoctorService,
  getAllSpecialtyService,
  getAllClinicService,
} from "../../services/userService";
import { toast } from "react-toastify";

// Gender
export const fetchGenderStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_GENDER_START,
      });
      let res = await getAllCodeService("GENDER");
      if (res && res.errCode === 0) {
        dispatch(fetchGenderSuccess(res.data));
      } else {
        dispatch(fetchGenderFailed());
      }
    } catch (error) {
      dispatch(fetchGenderFailed());
      console.log("fetchGenderFailed", error);
    }
  };
};

export const fetchGenderSuccess = (genderData) => ({
  type: actionTypes.FETCH_GENDER_SUCCESS,
  data: genderData,
});

export const fetchGenderFailed = () => ({
  type: actionTypes.FETCH_GENDER_FAILED,
});

// Position
export const fetchPositionStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("POSITION");
      if (res && res.errCode === 0) {
        dispatch(fetchPositionSuccess(res.data));
      } else {
        dispatch(fetchPositionFailed());
      }
    } catch (error) {
      dispatch(fetchPositionFailed());
      console.log("fetchPositionFailed", error);
    }
  };
};

export const fetchPositionSuccess = (positionData) => ({
  type: actionTypes.FETCH_POSITION_SUCCESS,
  data: positionData,
});

export const fetchPositionFailed = () => ({
  type: actionTypes.FETCH_POSITION_FAILED,
});

// Role
export const fetchRoleStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("ROLE");
      if (res && res.errCode === 0) {
        dispatch(fetchRoleSuccess(res.data));
      } else {
        dispatch(fetchRoleFailed());
      }
    } catch (error) {
      dispatch(fetchRoleFailed());
      console.log("fetchRoleFailed", error);
    }
  };
};

export const fetchRoleSuccess = (roleData) => ({
  type: actionTypes.FETCH_ROLE_SUCCESS,
  data: roleData,
});

export const fetchRoleFailed = () => ({
  type: actionTypes.FETCH_ROLE_FAILED,
});

// Create new user
export const createNewUserStart = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewUser(data);
      if (res && res.errCode === 0) {
        dispatch(saveUserSuccess());
        toast.success("Create new user successfully!");
        dispatch(fetchAllUserStart());
      } else {
        toast.error("Create user failed!");
        dispatch(saveUserFailed());
      }
    } catch (error) {
      toast.error("Create user failed!");
      dispatch(saveUserFailed());
      console.log("Create user failed!", error);
    }
  };
};

export const saveUserSuccess = (roleData) => ({
  type: actionTypes.CREATE_USER_SUCCESS,
});

export const saveUserFailed = () => ({
  type: actionTypes.CREATE_USER_FAILED,
});

// Fetch all user
export const fetchAllUserStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllUsers("ALL");
      if (res && res.errCode === 0) {
        dispatch(fetchAllUserSuccess(res.users.reverse()));
      } else {
        toast.error("Fetch all users error!");
        dispatch(fetchAllUserFailed());
      }
    } catch (error) {
      toast.error("Fetch all users error!");
      dispatch(fetchAllUserFailed());
      console.log("Fetch all users failed!", error);
    }
  };
};

export const fetchAllUserSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_USER_SUCCESS,
  users: data,
});

export const fetchAllUserFailed = () => ({
  type: actionTypes.FETCH_ALL_USER_FAILED,
});

// Delete user
export const deleteUserStart = (userId) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUser(userId);
      if (res && res.errCode === 0) {
        dispatch(deleteUserSuccess());
        toast.success("Delete user successfully!");
        dispatch(fetchAllUserStart());
      } else {
        dispatch(deleteUserFailed());
      }
    } catch (error) {
      toast.error("Delete user failed!");
      dispatch(deleteUserFailed());
      console.log("Delete user failed!", error);
    }
  };
};

export const deleteUserSuccess = (roleData) => ({
  type: actionTypes.DELETE_USER_SUCCESS,
});

export const deleteUserFailed = () => ({
  type: actionTypes.DELETE_USER_FAILED,
});

// Edit user
export const editUserStart = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editUser(data);
      if (res && res.errCode === 0) {
        dispatch(editUserSuccess());
        toast.success("Update user successfully!");
        dispatch(fetchAllUserStart());
      } else {
        dispatch(editUserFailed());
      }
    } catch (error) {
      toast.error("Update user failed!");
      dispatch(editUserFailed());
      console.log("Update user failed", error);
    }
  };
};

export const editUserSuccess = (roleData) => ({
  type: actionTypes.EDIT_USER_SUCCESS,
});

export const editUserFailed = () => ({
  type: actionTypes.EDIT_USER_FAILED,
});

// Fetch top doctor
export const fetchTopDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getTopDoctorHomeService("");
      // console.log("resTopDoctor", res);
      if (res && res.errCode === 0) {
        dispatch(fetchTopDoctorSuccess(res.data));
      } else {
        toast.error("Fetch top doctor failed!");
        dispatch(fetchTopDoctorFailed());
      }
    } catch (error) {
      toast.error("Fetch top doctor failed!");
      dispatch(fetchTopDoctorFailed());
      console.log("Fetch top doctor failed", error);
    }
  };
};

export const fetchTopDoctorSuccess = (data) => ({
  type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
  dataDoctors: data,
});

export const fetchTopDoctorFailed = () => ({
  type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
});

// Fetch all doctor
export const fetchAllDoctors = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctorsService();
      // console.log("res", res);
      if (res && res.errCode === 0) {
        dispatch(fetchAllDoctorsSuccess(res.data));
      } else {
        toast.error("Fetch all doctors failed!");
        dispatch(fetchAllDoctorsFailed());
      }
    } catch (error) {
      toast.error("Fetch all doctors failed!");
      dispatch(fetchAllDoctorsFailed());
      console.log("Fetch all doctors failed", error);
    }
  };
};

export const fetchAllDoctorsSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
  dataDr: data,
});

export const fetchAllDoctorsFailed = () => ({
  type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
});

// Save detail doctor
export const saveDetailDoctor = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveDetailDoctorService(data);
      if (res && res.errCode === 0) {
        toast.success("Save detail doctor successfully!");
        dispatch(saveDetailDoctorSuccess());
      } else {
        toast.error(res.message);
        dispatch(saveDetailDoctorFailed());
      }
    } catch (error) {
      toast.error("Save detail doctor failed!");
      dispatch(saveDetailDoctorFailed());
      console.log("Save detail doctor failed", error);
    }
  };
};

export const saveDetailDoctorSuccess = () => ({
  type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
});

export const saveDetailDoctorFailed = () => ({
  type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
});

// Fetch all schedule time
export const fetchAllScheduleTime = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("TIME");
      console.log(res);
      if (res && res.errCode === 0) {
        dispatch(fetchAllScheduleTimeSuccess(res.data));
      } else {
        toast.error("Fetch allcode schedule time failed!");
        dispatch(fetchAllScheduleTimeFailed());
      }
    } catch (error) {
      toast.error("Fetch allcode schedule time failed!");
      dispatch(fetchAllScheduleTimeFailed());
      console.log("Fetch allcode schedule time failed", error);
    }
  };
};

export const fetchAllScheduleTimeSuccess = (data) => ({
  type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
  dataTime: data,
});

export const fetchAllScheduleTimeFailed = () => ({
  type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
});

// Get required doctor infor
export const getRequiredDoctorInfor = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START,
      });
      let resPrice = await getAllCodeService("PRICE");
      let resPayment = await getAllCodeService("PAYMENT");
      let resProvince = await getAllCodeService("PROVINCE");
      let resSpecialty = await getAllSpecialtyService();
      let resClinic = await getAllClinicService();

      if (
        resPrice &&
        resPrice.errCode === 0 &&
        resPayment &&
        resPayment.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0 &&
        resSpecialty &&
        resSpecialty.errCode === 0 &&
        resClinic &&
        resClinic.errCode === 0
      ) {
        let data = {
          resPrice: resPrice.data,
          resPayment: resPayment.data,
          resProvince: resProvince.data,
          resSpecialty: resSpecialty.data,
          resClinic: resClinic.data,
        };
        dispatch(fetchRequiredDoctorInforSuccess(data));
      } else {
        toast.error("Fetch required doctor infor failed");
        dispatch(fetchRequiredDoctorInforFailed());
      }
    } catch (error) {
      toast.error("Fetch required doctor infor failed");
      dispatch(fetchRequiredDoctorInforFailed());
      console.log("Fetch required doctor infor failed", error);
    }
  };
};

export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
  data: allRequiredData,
});

export const fetchRequiredDoctorInforFailed = () => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED,
});

// Fetch all specialty
export const fetchAllSpecialty = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllSpecialtyService();
      if (res && res.errCode === 0) {
        dispatch(fetchAllSpecialtySuccess(res.data));
      } else {
        toast.error("Fetch all Specialty failed!");
        dispatch(fetchAllSpecialtyFailed());
      }
    } catch (error) {
      toast.error("Fetch all Specialty failed!");
      dispatch(fetchAllSpecialtyFailed());
      console.log("Fetch all Specialty failed", error);
    }
  };
};

export const fetchAllSpecialtySuccess = (data) => ({
  type: actionTypes.FETCH_ALL_SPECIALTY_SUCCESS,
  dataSpecialty: data,
});

export const fetchAllSpecialtyFailed = () => ({
  type: actionTypes.FETCH_ALL_SPECIALTY_FAILED,
});

// Fetch all clinics
export const fetchAllClinic = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllClinicService();
      if (res && res.errCode === 0) {
        dispatch(fetchAllClinicSuccess(res.data));
      } else {
        toast.error("Fetch all clinic failed!");
        dispatch(fetchAllClinicFailed());
      }
    } catch (error) {
      toast.error("Fetch all clinic failed!");
      dispatch(fetchAllClinicFailed());
      console.log("Fetch all clinic failed", error);
    }
  };
};

export const fetchAllClinicSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_CLINIC_SUCCESS,
  dataClinic: data,
});

export const fetchAllClinicFailed = () => ({
  type: actionTypes.FETCH_ALL_CLINIC_FAILED,
});
