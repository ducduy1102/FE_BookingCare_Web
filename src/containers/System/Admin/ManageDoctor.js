import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./ManageDoctor.scss";
import {
  fetchAllDoctors,
  saveDetailDoctor,
  getRequiredDoctorInfor,
} from "../../../store/actions";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { getDetailInforDoctorService } from "../../../services/userService";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // save to markdown table
      contentMarkdown: "",
      contentHTML: "",
      selectedDoctor: "",
      description: "",
      listDoctors: [],
      hasOldData: false,

      // save to doctor_infor table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],

      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSpecialty: "",
      selectedClinic: "",

      nameClinic: "",
      addressClinic: "",
      note: "",
      clinicId: "",
      specialtyId: "",
    };
  }

  async componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getAllRequiredDoctorInfor();
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      if (type === "USERS") {
        inputData.forEach((item, index) => {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object);
        });
      }
      if (type === "PRICE") {
        inputData.forEach((item, index) => {
          let object = {};
          let labelVi = item.valueVi;
          let labelEn = `${item.valueEn} USD`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type === "PAYMENT" || type === "PROVINCE") {
        inputData.forEach((item, index) => {
          let object = {};
          let labelVi = item.valueVi;
          let labelEn = item.valueEn;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type === "SPECIALTY") {
        inputData.forEach((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
      if (type === "CLINIC") {
        inputData.forEach((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
    }
    return result;
  };

  componentDidUpdate(preProps, prevState, snapshot) {
    if (preProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      this.setState({
        listDoctors: dataSelect,
      });
    }

    if (preProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
      let { resPrice, resPayment, resProvince, resSpecialty, resClinic } =
        this.props.allRequiredDoctorInfor;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );
      let dataSelectSpecialty = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY"
      );
      let dataSelectClinic = this.buildDataInputSelect(resClinic, "CLINIC");
      // console.log(dataSelectPrice, dataSelectPayment, dataSelectProvince);
      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
        listClinic: dataSelectClinic,
      });
    }

    if (preProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      let { resPrice, resPayment, resProvince, resClinic } =
        this.props.allRequiredDoctorInfor;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );
      let dataSelectClinic = this.buildDataInputSelect(resClinic, "CLINIC");

      this.setState({
        listDoctors: dataSelect,
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listClinic: dataSelectClinic,
      });
    }
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };

  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
    console.log("state", this.state);
  };

  handleChange = async (selectedDoctor) => {
    // console.log("selecteddoctor0", selectedDoctor);
    // console.log("selectedPrice0", this.state.selectedPrice);
    // console.log("selectedPayment0", this.state.selectedPayment);
    // console.log("selectedProvince0", this.state.selectedProvince);
    this.setState({ selectedDoctor });
    let res = await getDetailInforDoctorService(selectedDoctor.value);
    // console.log(`Option selected:`, res);
    let { listPrice, listPayment, listProvince, listSpecialty, listClinic } =
      this.state;
    if (res && res.errCode === 0 && res?.data?.Markdown) {
      let markdown = res.data.Markdown;
      let addressClinic = "",
        nameClinic = "",
        note = "",
        priceId = "",
        provinceId = "",
        paymentId = "",
        specialtyId = "",
        clinicId = "",
        selectedPayment = "",
        selectedPrice = "",
        selectedProvince = "",
        selectedSpecialty = "",
        selectedClinic = "";

      if (res?.data?.Doctor_Infor) {
        let doctor_infor = res.data.Doctor_Infor;
        addressClinic = doctor_infor.addressClinic;
        nameClinic = doctor_infor.nameClinic;
        note = doctor_infor.note;
        priceId = doctor_infor.priceId;
        paymentId = doctor_infor.paymentId;
        provinceId = doctor_infor.provinceId;
        specialtyId = doctor_infor.specialtyId;
        clinicId = doctor_infor.clinicId;

        selectedPayment = listPayment.find((item) => item.value === paymentId);
        selectedPrice = listPrice.find((item) => item.value === priceId);
        selectedProvince = listProvince.find(
          (item) => item.value === provinceId
        );
        selectedSpecialty = listSpecialty.find(
          (item) => item.value === specialtyId
        );
        selectedClinic = listClinic.find((item) => item.value === clinicId);
      }

      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
        addressClinic: addressClinic,
        nameClinic: nameClinic,
        note: note,
        selectedPrice: selectedPrice,
        selectedPayment: selectedPayment,
        selectedProvince: selectedProvince,
        selectedSpecialty: selectedSpecialty,
        selectedClinic: selectedClinic,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        nameClinic: "",
        addressClinic: "",
        note: "",
        selectedPrice: "",
        selectedPayment: "",
        selectedProvince: "",
        selectedSpecialty: "",
        selectedClinic: "",
      });
    }
  };

  handleChangeSelectDoctorInfor = (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({ ...stateCopy });
  };

  handleSaveContentMarkdown = () => {
    // console.log("check state", this.state);
    let hasOldData = this.state.hasOldData;
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedDoctor.value,
      action: hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      priceId: this.state.selectedPrice.value,
      paymentId: this.state.selectedPayment.value,
      provinceId: this.state.selectedProvince.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
      clinicId: this.state.selectedClinic?.value
        ? this.state.selectedClinic.value
        : "",
      specialtyId: this.state.selectedSpecialty.value,
    });
  };

  render() {
    let { hasOldData } = this.state;
    // console.log(this.state);

    console.log("selecteddoctor4", this.state.selectedDoctor);
    console.log("selectedPrice4", this.state.selectedPrice);
    console.log("selectedPayment4", this.state.selectedPayment);
    console.log("selectedProvince4", this.state.selectedProvince);
    return (
      <div className="manage-doctor-container">
        <div className="container">
          <div className="manage-doctor-title">
            <FormattedMessage id="admin.manage-doctor.title" />
          </div>
          <div className="intro-infor">
            <div className="content-left">
              <label className="form-label">
                <FormattedMessage id="admin.manage-doctor.select-doctor" />
              </label>
              <Select
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.select-doctor" />
                }
                value={this.state.selectedDoctor}
                onChange={this.handleChange}
                options={this.state.listDoctors}
                name={"selectedDoctor"}
              />
            </div>
            <div className="content-right">
              <label className="form-label" htmlFor="description">
                <FormattedMessage id="admin.manage-doctor.intro" />
              </label>
              <textarea
                className="form-control"
                rows={4}
                id="description"
                onChange={(e) => this.handleOnChangeText(e, "description")}
                value={this.state.description}
              ></textarea>
            </div>
          </div>
          <div className="more-infor-extra">
            <div className="row g-3">
              <div className="col-4">
                <label className="form-label" htmlFor="">
                  <FormattedMessage id="admin.manage-doctor.price" />
                </label>
                <Select
                  placeholder={
                    <FormattedMessage id="admin.manage-doctor.price" />
                  }
                  value={this.state.selectedPrice}
                  onChange={this.handleChangeSelectDoctorInfor}
                  options={this.state.listPrice}
                  name="selectedPrice"
                />
              </div>
              <div className="col-4">
                <label className="form-label">
                  <FormattedMessage id="admin.manage-doctor.payment" />
                </label>
                <Select
                  placeholder={
                    <FormattedMessage id="admin.manage-doctor.payment" />
                  }
                  value={this.state.selectedPayment}
                  onChange={this.handleChangeSelectDoctorInfor}
                  options={this.state.listPayment}
                  name="selectedPayment"
                />
              </div>
              <div className="col-4">
                <label className="form-label">
                  <FormattedMessage id="admin.manage-doctor.province" />
                </label>
                <Select
                  placeholder={
                    <FormattedMessage id="admin.manage-doctor.province" />
                  }
                  value={this.state.selectedProvince}
                  onChange={this.handleChangeSelectDoctorInfor}
                  options={this.state.listProvince}
                  name="selectedProvince"
                />
              </div>
              <div className="col-4">
                <label className="form-label" htmlFor="nameClinic">
                  <FormattedMessage id="admin.manage-doctor.name-clinic" />
                </label>
                <input
                  id="nameClinic"
                  type="text"
                  className="form-control"
                  value={this.state.nameClinic}
                  onChange={(e) => this.handleOnChangeText(e, "nameClinic")}
                />
              </div>
              <div className="col-4">
                <label className="form-label" htmlFor="addressClinic">
                  <FormattedMessage id="admin.manage-doctor.address-clinic" />
                </label>
                <input
                  id="addressClinic"
                  type="text"
                  className="form-control"
                  value={this.state.addressClinic}
                  onChange={(e) => this.handleOnChangeText(e, "addressClinic")}
                />
              </div>
              <div className="col-4">
                <label className="form-label" htmlFor="note">
                  <FormattedMessage id="admin.manage-doctor.note" />
                </label>
                <input
                  id="note"
                  type="text"
                  className="form-control"
                  value={this.state.note}
                  onChange={(e) => this.handleOnChangeText(e, "note")}
                />
              </div>
              <div className="col-4">
                <label className="form-label">
                  <FormattedMessage id="admin.manage-doctor.select-specialty" />
                </label>
                <Select
                  placeholder={
                    <FormattedMessage id="admin.manage-doctor.select-specialty" />
                  }
                  value={this.state.selectedSpecialty}
                  onChange={this.handleChangeSelectDoctorInfor}
                  options={this.state.listSpecialty}
                  name="selectedSpecialty"
                />
              </div>
              <div className="col-4">
                <label className="form-label">
                  <FormattedMessage id="admin.manage-doctor.select-clinic" />
                </label>
                <Select
                  placeholder={
                    <FormattedMessage id="admin.manage-doctor.select-clinic" />
                  }
                  value={this.state.selectedClinic}
                  onChange={this.handleChangeSelectDoctorInfor}
                  options={this.state.listClinic}
                  name="selectedClinic"
                />
              </div>
            </div>
          </div>
          <div className="manage-doctor-editor">
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.contentMarkdown}
            />
          </div>
          <button
            className={
              hasOldData ? "save-content-doctor" : "create-content-doctor"
            }
            onClick={() => this.handleSaveContentMarkdown()}
          >
            {hasOldData ? (
              <span>
                <FormattedMessage id="admin.manage-doctor.save" />
              </span>
            ) : (
              <span>
                <FormattedMessage id="admin.manage-doctor.add" />
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(fetchAllDoctors()),
    getAllRequiredDoctorInfor: () => dispatch(getRequiredDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);

// import React, { useState, useEffect, useCallback } from "react";
// import { FormattedMessage } from "react-intl";
// import { useDispatch, useSelector } from "react-redux";
// import "./ManageDoctor.scss";
// import {
//   fetchAllDoctors,
//   saveDetailDoctor,
//   getRequiredDoctorInfor,
// } from "../../../store/actions";
// import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
// import MarkdownIt from "markdown-it";
// import MdEditor from "react-markdown-editor-lite";
// // import style manually
// import "react-markdown-editor-lite/lib/index.css";
// import Select from "react-select";
// import { getDetailInforDoctorService } from "../../../services/userService";
// import _ from "lodash";

// const ManageDoctor = (props) => {
//   // Initialize a markdown parser
//   const mdParser = new MarkdownIt(/* Markdown-it options */);

//   const dispatch = useDispatch();
//   const language = useSelector((state) => state.app.language);
//   const allDoctorsRedux = useSelector((state) => state.admin.allDoctors);
//   const allRequiredDoctorInforRedux = useSelector(
//     (state) => state.admin.allRequiredDoctorInfor
//   );
//   const saveDetailDoctorRedux = (data) => dispatch(saveDetailDoctor(data));

//   // save to markdown table
//   const defaultInforMarkdown = {
//     contentMarkdown: "",
//     contentHTML: "",
//     description: "",
//   };

//   // save to doctor_infor table
//   const defaultInforDoctor = {
//     nameClinic: "",
//     addressClinic: "",
//     note: "",
//   };

//   const [valueMarkdown, setValueMarkdown] = useState(defaultInforMarkdown);
//   const [valueInforDoctor, setValueInforDoctor] = useState(defaultInforDoctor);
//   const [listDoctors, setListDoctors] = useState([]);
//   const [listPrices, setListPrices] = useState([]);
//   const [listPayments, setListPayments] = useState([]);
//   const [listProvinces, setListProvinces] = useState([]);
//   const [listClinics, setListClinics] = useState([]);
//   const [listSpecialties, setListSpecialties] = useState([]);

//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [selectedPrice, setSelectedPrice] = useState("");
//   const [selectedPayment, setSelectedPayment] = useState("");
//   const [selectedProvince, setSelectedProvince] = useState("");
//   const [selectedClinic, setSelectedClinic] = useState("");
//   const [selectedSpecialty, setSelectedSpecialty] = useState("");

//   const [hasOldData, sethasOldData] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllDoctors());
//     dispatch(getRequiredDoctorInfor());
//   }, []);

//   const buildDataInputSelect = useCallback(
//     (inputData, type) => {
//       let result = [];
//       if (inputData && inputData.length > 0) {
//         if (type === "USERS") {
//           inputData.forEach((item) => {
//             let object = {};
//             let labelVi =
//               type === "USERS"
//                 ? `${item.lastName} ${item.firstName}`
//                 : item.valueVi;
//             let labelEn =
//               type === "USERS"
//                 ? `${item.firstName} ${item.lastName}`
//                 : item.valueEn;

//             object.label = language === LANGUAGES.VI ? labelVi : labelEn;
//             object.value = item.id;
//             result.push(object);
//           });
//         }
//         if (type === "PRICE") {
//           inputData.forEach((item, index) => {
//             let object = {};
//             let labelVi = `${item.valueVi} VND`;
//             let labelEn = `${item.valueEn} USD`;
//             object.label = language === LANGUAGES.VI ? labelVi : labelEn;
//             object.value = item.keyMap;
//             result.push(object);
//           });
//         }
//         if (type === "PAYMENT" || type === "PROVINCE") {
//           inputData.forEach((item, index) => {
//             let object = {};
//             let labelVi = item.valueVi;
//             let labelEn = item.valueEn;
//             object.label = language === LANGUAGES.VI ? labelVi : labelEn;
//             object.value = item.keyMap;
//             result.push(object);
//           });
//         }
//         if (type === "SPECIALTY") {
//           inputData.forEach((item, index) => {
//             let object = {};
//             object.label = item.name;
//             object.value = item.id;
//             result.push(object);
//           });
//         }
//         if (type === "CLINIC") {
//           inputData.forEach((item, index) => {
//             let object = {};
//             object.label = item.name;
//             object.value = item.id;
//             result.push(object);
//           });
//         }
//       }
//       return result;
//     },
//     [language]
//   );

//   useEffect(() => {
//     if (allDoctorsRedux || language) {
//       let dataSelect = buildDataInputSelect(allDoctorsRedux, "USERS");
//       setValueMarkdown({
//         ...valueMarkdown,
//         selectedDoctor: selectedDoctor,
//       });
//       // setSelectedDoctor(selectedDoctor);
//       setListDoctors(dataSelect);
//     }
//   }, [allDoctorsRedux, language]);

//   useEffect(() => {
//     if (allRequiredDoctorInforRedux || language) {
//       let { resPayment, resPrice, resProvince, resSpecialty, resClinic } =
//         allRequiredDoctorInforRedux;
//       let dataSelectPrice = buildDataInputSelect(resPrice, "PRICE");
//       let dataSelectPayment = buildDataInputSelect(resPayment, "PAYMENT");
//       let dataSelectProvince = buildDataInputSelect(resProvince, "PROVINCE");
//       let dataSelectSpecialty = buildDataInputSelect(resSpecialty, "SPECIALTY");
//       let dataSelectClinic = buildDataInputSelect(resClinic, "CLINIC");

//       setValueInforDoctor({
//         ...valueInforDoctor,
//         selectedPrice: selectedPrice,
//         selectedPayment: selectedPayment,
//         selectedProvince: selectedProvince,
//         selectedSpecialty: selectedSpecialty,
//         selectedClinic: selectedClinic,
//       });
//       setListPrices(dataSelectPrice);
//       setListPayments(dataSelectPayment);
//       setListProvinces(dataSelectProvince);
//       setListSpecialties(dataSelectSpecialty);
//       setListClinics(dataSelectClinic);
//     }
//   }, [allRequiredDoctorInforRedux, language]);

//   const handleOnChangeText = (event, id) => {
//     let valueMarkdownCopy = { ...valueMarkdown };
//     valueMarkdownCopy[id] = event.target.value;
//     setValueMarkdown({
//       ...valueMarkdownCopy,
//     });

//     let valueInforDoctorCopy = { ...valueInforDoctor };
//     valueInforDoctorCopy[id] = event.target.value;
//     setValueInforDoctor({
//       ...valueInforDoctorCopy,
//       selectedPrice: selectedPrice.value,
//       selectedPayment: selectedPayment.value,
//       selectedProvince: selectedProvince.value,
//       selectedSpecialty: selectedSpecialty.value,
//       selectedClinic: selectedClinic.value,
//     });
//     console.log("valueMarkdownCopy", valueMarkdownCopy);
//     console.log("valueInforDoctorCopy", valueInforDoctorCopy);
//   };

//   const handleEditorChange = ({ html, text }) => {
//     setValueMarkdown({
//       ...valueMarkdown,
//       contentMarkdown: text,
//       contentHTML: html,
//     });
//   };

//   const handleChangeSelected = async (selectedDoctor) => {
//     setSelectedDoctor(selectedDoctor);
//     // const dataSelect = buildDataInputSelect(allDoctorsRedux, "USERS");
//     let res = await getDetailInforDoctorService(selectedDoctor.value);
//     if (res && res.errCode === 0 && res?.data?.Markdown) {
//       let markdown = res.data.Markdown;
//       let addressClinic = "",
//         nameClinic = "",
//         note = "",
//         priceId = "",
//         provinceId = "",
//         paymentId = "",
//         specialtyId = "",
//         clinicId = "",
//         selectedPayment = "",
//         selectedPrice = "",
//         selectedProvince = "",
//         selectedSpecialty = "",
//         selectedClinic = "";

//       if (res?.data?.Doctor_Infor) {
//         let doctor_infor = res.data.Doctor_Infor;
//         addressClinic = doctor_infor.addressClinic;
//         nameClinic = doctor_infor.nameClinic;
//         note = doctor_infor.note;
//         priceId = doctor_infor.priceId;
//         paymentId = doctor_infor.paymentId;
//         provinceId = doctor_infor.provinceId;
//         specialtyId = doctor_infor.specialtyId;
//         clinicId = doctor_infor.clinicId;

//         selectedPrice = listPrices.find((item) => item.value === priceId);
//         selectedPayment = listPayments.find((item) => item.value === paymentId);
//         selectedProvince = listProvinces.find(
//           (item) => item.value === provinceId
//         );
//         selectedSpecialty = listSpecialties.find(
//           (item) => item.value === specialtyId
//         );
//         selectedClinic = listClinics.find((item) => item.value === clinicId);
//       }

//       setValueMarkdown({
//         contentHTML: markdown.contentHTML,
//         contentMarkdown: markdown.contentMarkdown,
//         description: markdown.description,
//         selectedDoctor: selectedDoctor,
//       });
//       setValueInforDoctor({
//         addressClinic: addressClinic,
//         nameClinic: nameClinic,
//         note: note,
//         selectedPrice: selectedPrice,
//         selectedPayment: selectedPayment,
//         selectedProvince: selectedProvince,
//         selectedSpecialty: selectedSpecialty,
//         selectedClinic: selectedClinic,
//       });
//       // console.log(valueMarkdown);
//       // console.log(valueInforDoctor);
//       // console.log("selecteddoctor1", selectedDoctor);
//       // console.log("selectedPrice1", selectedPrice);
//       // console.log("selectedPayment1", selectedPayment);
//       // console.log("selectedProvince1", selectedProvince);
//       sethasOldData(true);
//     } else {
//       setValueMarkdown({
//         ...defaultInforMarkdown,
//         // listDoctor: dataSelect,
//         // selectedDoctor: selectedDoctor,
//       });
//       setValueInforDoctor({
//         ...defaultInforDoctor,
//         selectedPrice: "",
//         selectedPayment: "",
//         selectedProvince: "",
//         selectedSpecialty: "",
//         selectedClinic: "",
//       });
//       sethasOldData(false);
//     }
//   };

//   // console.log("selecteddoctor3", selectedDoctor);
//   // console.log("selectedPrice3", selectedPrice);
//   // console.log("selectedPayment3", selectedPayment);
//   // console.log("selectedProvince3", selectedProvince);

//   const handleChangeSelectDoctorInfor = (selectedOption, { name }) => {
//     // let stateCopy = {
//     //   ...valueInforDoctor,
//     //   // selectedPrice: selectedPrice,
//     //   // selectedPayment: selectedPayment,
//     //   // selectedProvince: selectedProvince,
//     // };
//     // stateCopy[name] = selectedOption;
//     // setValueInforDoctor({ ...stateCopy });

//     // console.log(valueInforDoctor);

//     // let _userDoctorInfor = _.cloneDeep(valueInforDoctor);
//     // _userDoctorInfor[name] = selectedOption;

//     // setValueInforDoctor(_userDoctorInfor);
//     // console.log(valueInforDoctor);
//     // console.log(_userDoctorInfor[name]);
//     // console.log(selectedOption);

//     const setterMap = {
//       selectedPrice: setSelectedPrice,
//       selectedPayment: setSelectedPayment,
//       selectedProvince: setSelectedProvince,
//       selectedSpecialty: setSelectedSpecialty,
//       selectedClinic: setSelectedClinic,
//     };

//     const setter = setterMap[name];
//     if (setter) {
//       setter(selectedOption);
//     }
//     console.log(valueInforDoctor);

//     // switch (name) {
//     //   case "selectedPrice":
//     //     setSelectedPrice(selectedOption);
//     //     break;
//     //   case "selectedPayment":
//     //     setSelectedPayment(selectedOption);
//     //     break;
//     //   case "selectedProvince":
//     //     setSelectedProvince(selectedOption);
//     //     break;
//     //   default:
//     //     break;
//     // }
//   };

//   const handleSaveDetailDoctorInfor = () => {
//     console.log(valueInforDoctor);
//     console.log(valueMarkdown);
//     saveDetailDoctorRedux({
//       contentHTML: valueMarkdown.contentHTML,
//       contentMarkdown: valueMarkdown.contentMarkdown,
//       description: valueMarkdown.description,
//       // doctorId: valueMarkdown.selectedDoctor.value,
//       doctorId: selectedDoctor.value,
//       action: hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

//       // priceId: valueInforDoctor.selectedPrice.value,
//       // paymentId: valueInforDoctor.selectedPayment.value,
//       // provinceId: valueInforDoctor.selectedProvince.value,
//       // priceId: valueInforDoctor
//       //   ? valueInforDoctor.selectedPrice.value
//       //   : selectedPrice.value,
//       priceId: selectedPrice.value,
//       paymentId: selectedPayment.value,
//       provinceId: selectedProvince.value,
//       nameClinic: valueInforDoctor.nameClinic || "",
//       addressClinic: valueInforDoctor.addressClinic || "",
//       note: valueInforDoctor.note || "",
//       clinicId: selectedClinic?.value ? selectedClinic.value : "",
//       specialtyId: selectedSpecialty.value,
//     });
//   };

//   return (
//     <div className="manage-doctor-container">
//       <div className="container">
//         <div className="manage-doctor-title">
//           <FormattedMessage id="admin.manage-doctor.title" />
//         </div>
//         <div className="intro-infor">
//           <div className="content-left">
//             <label className="form-label">
//               <FormattedMessage id="admin.manage-doctor.select-doctor" />
//             </label>
//             <Select
//               placeholder={
//                 <FormattedMessage id="admin.manage-doctor.select-doctor" />
//               }
//               defaultValue={selectedDoctor}
//               onChange={handleChangeSelected}
//               options={listDoctors}
//             />
//           </div>
//           <div className="content-right">
//             <label className="form-label" htmlFor="description">
//               <FormattedMessage id="admin.manage-doctor.intro" />
//             </label>
//             <textarea
//               className="form-control"
//               rows={4}
//               id="description"
//               onChange={(e) => handleOnChangeText(e, "description")}
//               value={valueMarkdown.description}
//             ></textarea>
//           </div>
//         </div>
//         <div className="more-infor-extra">
//           <div className="row g-3">
//             <div className="col-4">
//               <label className="form-label">
//                 <FormattedMessage id="admin.manage-doctor.price" />
//               </label>
//               <Select
//                 placeholder={
//                   <FormattedMessage id="admin.manage-doctor.price" />
//                 }
//                 defaultValue={selectedPrice}
//                 onChange={handleChangeSelectDoctorInfor}
//                 options={listPrices}
//                 name="selectedPrice"
//               />
//             </div>
//             <div className="col-4">
//               <label className="form-label">
//                 <FormattedMessage id="admin.manage-doctor.payment" />
//               </label>
//               <Select
//                 placeholder={
//                   <FormattedMessage id="admin.manage-doctor.payment" />
//                 }
//                 defaultValue={selectedPayment}
//                 onChange={handleChangeSelectDoctorInfor}
//                 options={listPayments}
//                 name="selectedPayment"
//               />
//             </div>
//             <div className="col-4">
//               <label className="form-label">
//                 <FormattedMessage id="admin.manage-doctor.province" />
//               </label>
//               <Select
//                 placeholder={
//                   <FormattedMessage id="admin.manage-doctor.province" />
//                 }
//                 defaultValue={selectedProvince}
//                 onChange={handleChangeSelectDoctorInfor}
//                 options={listProvinces}
//                 name="selectedProvince"
//               />
//             </div>
//             <div className="col-4">
//               <label className="form-label" htmlFor="nameClinic">
//                 <FormattedMessage id="admin.manage-doctor.name-clinic" />
//               </label>
//               <input
//                 id="nameClinic"
//                 type="text"
//                 className="form-control"
//                 onChange={(e) => handleOnChangeText(e, "nameClinic")}
//                 value={valueInforDoctor.nameClinic}
//               />
//             </div>
//             <div className="col-4">
//               <label className="form-label" htmlFor="addressClinic">
//                 <FormattedMessage id="admin.manage-doctor.address-clinic" />
//               </label>
//               <input
//                 id="addressClinic"
//                 type="text"
//                 className="form-control"
//                 onChange={(e) => handleOnChangeText(e, "addressClinic")}
//                 value={valueInforDoctor.addressClinic}
//               />
//             </div>
//             <div className="col-4">
//               <label className="form-label" htmlFor="note">
//                 <FormattedMessage id="admin.manage-doctor.note" />
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="note"
//                 onChange={(e) => handleOnChangeText(e, "note")}
//                 value={valueInforDoctor.note}
//               />
//             </div>
//             <div className="col-4">
//               <label className="form-label">
//                 <FormattedMessage id="admin.manage-doctor.select-specialty" />
//               </label>
//               <Select
//                 placeholder={
//                   <FormattedMessage id="admin.manage-doctor.select-specialty" />
//                 }
//                 value={selectedSpecialty}
//                 onChange={handleChangeSelectDoctorInfor}
//                 options={listSpecialties}
//                 name="selectedSpecialty"
//               />
//             </div>
//             <div className="col-4">
//               <label className="form-label">
//                 <FormattedMessage id="admin.manage-doctor.select-clinic" />
//               </label>
//               <Select
//                 placeholder={
//                   <FormattedMessage id="admin.manage-doctor.select-clinic" />
//                 }
//                 value={selectedClinic}
//                 onChange={handleChangeSelectDoctorInfor}
//                 options={listClinics}
//                 name="selectedClinic"
//               />
//             </div>
//           </div>
//         </div>
//         <div className="manage-doctor-editor">
//           <MdEditor
//             style={{ height: "300px" }}
//             renderHTML={(text) => mdParser.render(text)}
//             onChange={handleEditorChange}
//             value={valueMarkdown.contentMarkdown}
//           />
//         </div>
//         <button
//           className={
//             hasOldData ? "save-content-doctor" : "create-content-doctor"
//           }
//           onClick={() => handleSaveDetailDoctorInfor()}
//         >
//           {hasOldData ? (
//             <span>
//               <FormattedMessage id="admin.manage-doctor.save" />
//             </span>
//           ) : (
//             <span>
//               <FormattedMessage id="admin.manage-doctor.add" />
//             </span>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ManageDoctor;
