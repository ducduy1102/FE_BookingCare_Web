import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import "./ManageClinic.scss";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { CommonUtils, CRUD_ACTIONS } from "../../../utils";
import MarkdownIt from "markdown-it";
import { useState } from "react";
import _ from "lodash";
import {
  createNewClinicService,
  editClinicService,
} from "../../../services/userService";
import { toast } from "react-toastify";
import { fetchAllClinic } from "../../../store/actions";
import TableManageClinic from "./TableManageClinic";
import Lightbox from "react-image-lightbox";

// Initialize a markdown parser
const mdParser = new MarkdownIt();

const ManageClinic = () => {
  const dispatch = useDispatch();
  const clinicRedux = useSelector((state) => state.admin.allClinics);

  const defaultValueClinic = {
    name: "",
    address: "",
    imageBase64: "",
    descriptionHTML: "",
    descriptionMarkdown: "",
  };

  const [valueClinic, setValueClinic] = useState(defaultValueClinic);
  const [action, setAction] = useState("");
  const [previewImgURL, setPreviewImgURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // componentDidMount equivalent
    dispatch(fetchAllClinic());
  }, []);

  useEffect(() => {
    if (clinicRedux) {
      setAction(CRUD_ACTIONS.CREATE);
      // setPreviewImgURL("");
      // setValueClinic(defaultValueClinic);
    }
  }, [clinicRedux]);

  const handleOnChangeInput = (event, name) => {
    let _clinicData = _.cloneDeep(valueClinic);
    _clinicData[name] = event.target.value;

    setValueClinic(_clinicData);
  };

  // Sửa lại tương tự như hàm handleOnChangeInput, thêm 1 cái name vào
  const handleEditorChange = ({ html, text }) => {
    setValueClinic({
      ...valueClinic,
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  const handleOnChangeImage = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      // console.log("base64 file image: ", base64);
      let objectUrl = URL.createObjectURL(file);
      setPreviewImgURL(objectUrl);
      setValueClinic({ ...valueClinic, imageBase64: base64 });
    }
  };

  const openPreviewImage = () => {
    if (!previewImgURL) return;
    setIsOpen(true);
  };

  const handleSaveNewClinic = async () => {
    let res = "";
    if (action === CRUD_ACTIONS.CREATE) {
      res = await createNewClinicService(valueClinic);
    }
    if (action === CRUD_ACTIONS.EDIT) {
      res = await editClinicService(valueClinic);
    }
    if (res && res.errCode === 0) {
      toast.success(res.message);
      setPreviewImgURL("");
      setValueClinic(defaultValueClinic);
    } else {
      toast.error(res.message);
    }
    dispatch(fetchAllClinic());
  };

  const handleEditClinicFromParent = async (clinic) => {
    setValueClinic({
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      imageBase64: clinic.image,
      descriptionHTML: clinic.descriptionHTML,
      descriptionMarkdown: clinic.descriptionMarkdown,
    });
    setPreviewImgURL(clinic.image);
    setAction(CRUD_ACTIONS.EDIT);
  };

  return (
    <div className="container manage-clinic-container">
      <div className="manage-clinic-title">
        <FormattedMessage id="manage-clinic.title" />
      </div>
      <div className="add-new-clinic row g-3">
        <div className="col-6">
          <label htmlFor="name" className="form-label">
            <FormattedMessage id="manage-clinic.name" />
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={valueClinic.name}
            onChange={(e) => handleOnChangeInput(e, "name")}
          />
        </div>
        <div className="address-clinic col-6">
          <label htmlFor="address" className="form-label">
            <FormattedMessage id="manage-clinic.address" />
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={valueClinic.address}
            onChange={(e) => handleOnChangeInput(e, "address")}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="avatar" className="form-label">
            <FormattedMessage id="manage-clinic.image" />
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
        <div className="md-editor-child">
          <label className="form-label">
            <FormattedMessage id="manage-clinic.description" />
          </label>
          <MdEditor
            style={{ height: "400px", width: "100%" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            value={valueClinic.descriptionMarkdown}
          />
        </div>
        <div className="col-3">
          <button
            type="button"
            className={
              action === CRUD_ACTIONS.EDIT
                ? "btn btn-warning"
                : "btn btn-primary"
            }
            onClick={() => handleSaveNewClinic()}
          >
            {action === CRUD_ACTIONS.EDIT ? (
              <FormattedMessage id="manage-clinic.btn-edit" />
            ) : (
              <FormattedMessage id="manage-clinic.btn-save" />
            )}
          </button>
        </div>
        <TableManageClinic
          handleEditClinicFromParentKey={handleEditClinicFromParent}
        />
      </div>
      {isOpen === true && (
        <Lightbox
          mainSrc={previewImgURL}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageClinic;
