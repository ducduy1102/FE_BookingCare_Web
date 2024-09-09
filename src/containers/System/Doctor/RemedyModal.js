import React from "react";
import { useSelector } from "react-redux";
import { CommonUtils, LANGUAGES } from "../../../utils";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import "./RemedyModal.scss";

const RemedyModal = ({
  isOpenModal = false,
  dataModal,
  closeRemedyModal,
  sendRemedy,
}) => {
  const language = useSelector((state) => state.app.language);

  const [email, setEmail] = useState("");
  const [imgBase64, setImgBase64] = useState("");

  useEffect(() => {
    // Logic when language changes if needed
  }, [language]);

  useEffect(() => {
    setEmail(dataModal.email);
  }, [dataModal]);

  const handleOnChangeImage = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      setImgBase64(base64);
    }
  };

  const handleSendRemedy = () => {
    sendRemedy({
      email,
      imgBase64,
    });
  };

  return (
    <Modal
      isOpen={isOpenModal}
      className="remedy-modal-container"
      size="lg"
      centered
    >
      <div className="booking-modal-header">
        <span className="header-title">
          <FormattedMessage id="manage-patient.remedy-modal.title" />
        </span>
        <span className="header-close" onClick={closeRemedyModal}>
          <i className="fas fa-times"></i>
        </span>
      </div>
      <ModalBody>
        <div className="row g-3">
          <div className="col-6">
            <label htmlFor="email" className="form-label">
              <FormattedMessage id="manage-patient.remedy-modal.patient-email" />
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label htmlFor="" className="form-label">
              <FormattedMessage id="manage-patient.remedy-modal.select-remedy" />
            </label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => handleOnChangeImage(e)}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSendRemedy}>
          <FormattedMessage id="manage-patient.remedy-modal.send" />
        </Button>
        <Button color="secondary" onClick={closeRemedyModal}>
          <FormattedMessage id="manage-patient.remedy-modal.cancel" />
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RemedyModal;
