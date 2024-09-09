import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import "./ManageSpecialty.scss";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { CommonUtils, CRUD_ACTIONS } from "../../../utils";
import MarkdownIt from "markdown-it";
import { useState } from "react";
import _ from "lodash";
import {
  createNewSpecialtyService,
  editSpecialtyService,
} from "../../../services/userService";
import { toast } from "react-toastify";
import { fetchAllSpecialty } from "../../../store/actions";
import Lightbox from "react-image-lightbox";
import TableManageSpecialty from "./TableManageSpecialty";

// Initialize a markdown parser
const mdParser = new MarkdownIt();

const ManageSpecialty = () => {
  const dispatch = useDispatch();
  const specialtyRedux = useSelector((state) => state.admin.allSpecialties);

  const defaultValueSpecialty = {
    name: "",
    imageBase64: "",
    descriptionHTML: "",
    descriptionMarkdown: "",
  };

  const [valueSpecialty, setValueSpecialty] = useState(defaultValueSpecialty);
  const [action, setAction] = useState("");
  const [previewImgURL, setPreviewImgURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // componentDidMount equivalent
    dispatch(fetchAllSpecialty());
  }, []);

  useEffect(() => {
    if (specialtyRedux) {
      setAction(CRUD_ACTIONS.CREATE);
      // setPreviewImgURL("");
      // setValueSpecialty(defaultValueSpecialty);
    }
  }, [specialtyRedux]);

  const handleOnChangeInput = (event, name) => {
    let _specialtyData = _.cloneDeep(valueSpecialty);
    _specialtyData[name] = event.target.value;

    setValueSpecialty(_specialtyData);
  };

  const handleEditorChange = ({ html, text }) => {
    setValueSpecialty({
      ...valueSpecialty,
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
      setValueSpecialty({ ...valueSpecialty, imageBase64: base64 });
    }
  };

  const openPreviewImage = () => {
    if (!previewImgURL) return;
    setIsOpen(true);
  };

  const handleEditSpecialtyFromParent = async (specialty) => {
    setValueSpecialty({
      id: specialty.id,
      name: specialty.name,
      imageBase64: specialty.image,
      descriptionHTML: specialty.descriptionHTML,
      descriptionMarkdown: specialty.descriptionMarkdown,
    });
    setPreviewImgURL(specialty.image);
    setAction(CRUD_ACTIONS.EDIT);
  };

  const handleSaveNewSpecialty = async () => {
    let res = "";
    if (action === CRUD_ACTIONS.CREATE) {
      res = await createNewSpecialtyService(valueSpecialty);
    }
    if (action === CRUD_ACTIONS.EDIT) {
      res = await editSpecialtyService(valueSpecialty);
    }
    if (res && res.errCode === 0) {
      toast.success(res.message);
      setPreviewImgURL("");
      setValueSpecialty(defaultValueSpecialty);
    } else {
      toast.error(res.message);
    }
    dispatch(fetchAllSpecialty());
  };

  return (
    <div className="container manage-specialty-container">
      <div className="manage-specialty-title">
        <FormattedMessage id="manage-specialty.title" />
      </div>
      <div className="add-new-specialty row g-3">
        <div className="col-6">
          <label htmlFor="name" className="form-label">
            <FormattedMessage id="manage-specialty.name" />
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={valueSpecialty.name}
            onChange={(e) => handleOnChangeInput(e, "name")}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="avatar" className="form-label">
            <FormattedMessage id="manage-specialty.image" />
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
        <div className="md-editor-container">
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            value={valueSpecialty.descriptionMarkdown}
          />
        </div>
        <div className="">
          <button
            type="button"
            className={
              action === CRUD_ACTIONS.EDIT
                ? "btn btn-warning"
                : "btn btn-primary"
            }
            onClick={() => handleSaveNewSpecialty()}
          >
            {action === CRUD_ACTIONS.EDIT ? (
              <FormattedMessage id="manage-specialty.btn-edit" />
            ) : (
              <FormattedMessage id="manage-specialty.btn-save" />
            )}
          </button>
        </div>
        <TableManageSpecialty
          handleEditSpecialtyFromParentKey={handleEditSpecialtyFromParent}
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

export default ManageSpecialty;
