import axios from "../axios";

const handleLogin = (email, password) => {
  return axios.post("/api/login", { email, password });
};

// users
const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUser = (userData) => {
  return axios.post("/api/create-new-user", {
    ...userData,
  });
};

const deleteUser = (userId) => {
  return axios.delete("/api/delete-user", { data: { id: userId } });
};

const editUser = (userData) => {
  return axios.put("/api/edit-user", userData);
};

const getAllCodeService = (type) => {
  return axios.get(`/api/allcode?type=${type}`);
};

// doctors
const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

const getAllDoctorsService = () => {
  return axios.get("/api/get-all-doctors");
};

const saveDetailDoctorService = (data) => {
  return axios.post("/api/save-infor-doctor", data);
};

const getDetailInforDoctorService = (doctorId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${doctorId}`);
};

const saveBulkScheduleDoctorService = (data) => {
  return axios.post("/api/bulk-create-schedule", data);
};

const getScheduleDoctorByDateService = (doctorId, date) => {
  return axios.get(
    `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
  );
};

const getExtraInforDoctorByIdService = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};

const getProfileDoctorByIdService = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

// post email
const postPatientBookAppointment = (data) => {
  return axios.post("/api/patient-book-appointment", data);
};

const postVerifyBookAppointment = (data) => {
  return axios.post("/api/verify-book-appointment", data);
};

// specialties
const createNewSpecialtyService = (data) => {
  return axios.post("/api/create-new-specialty", data);
};

const getAllSpecialtyService = () => {
  return axios.get("/api/get-specialty");
};

const getDetailSpecialtyByIdService = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
  );
};

const deleteSpecialtyService = (specialtyId) => {
  return axios.delete("/api/delete-specialty", { data: { id: specialtyId } });
};

const editSpecialtyService = (specialtyData) => {
  return axios.put("/api/edit-specialty", specialtyData);
};

// clinics
const createNewClinicService = (data) => {
  return axios.post("/api/create-new-clinic", data);
};

const getAllClinicService = () => {
  return axios.get("/api/get-clinic");
};

const getDetailClinicByIdService = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};

const getAllPatientForDoctorService = (data) => {
  return axios.get(
    `/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`
  );
};

const deleteClinicService = (clinicId) => {
  return axios.delete("/api/delete-clinic", { data: { id: clinicId } });
};

const editClinicService = (clinicData) => {
  return axios.put("/api/edit-clinic", clinicData);
};

// send remedy
const postSendRemedyService = (data) => {
  return axios.post(`/api/send-remedy`, data);
};

export {
  // users
  handleLogin,
  getAllUsers,
  createNewUser,
  deleteUser,
  editUser,
  getAllCodeService,
  // doctors
  getTopDoctorHomeService,
  getAllDoctorsService,
  saveDetailDoctorService,
  getDetailInforDoctorService,
  saveBulkScheduleDoctorService,
  getScheduleDoctorByDateService,
  getExtraInforDoctorByIdService,
  getProfileDoctorByIdService,
  // post email
  postPatientBookAppointment,
  postVerifyBookAppointment,
  // specialties
  createNewSpecialtyService,
  getAllSpecialtyService,
  getDetailSpecialtyByIdService,
  deleteSpecialtyService,
  editSpecialtyService,
  // clinics
  createNewClinicService,
  getAllClinicService,
  getDetailClinicByIdService,
  getAllPatientForDoctorService,
  deleteClinicService,
  editClinicService,
  // send remedy
  postSendRemedyService,
};
