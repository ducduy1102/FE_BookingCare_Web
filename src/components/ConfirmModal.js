import React, { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Modal } from "reactstrap";

import "./ConfirmModal.scss";
import * as actions from "../store/actions";
import { KeyCodeUtils } from "../utils";

const ConfirmModal = ({ contentOfConfirmModal, setContentOfConfirmModal }) => {
  const acceptBtnRef = useRef(null);

  useEffect(() => {
    const handlerKeyDown = (event) => {
      const keyCode = event.which || event.keyCode;
      if (keyCode === KeyCodeUtils.ENTER) {
        if (!acceptBtnRef.current || acceptBtnRef.current.disabled) return;
        acceptBtnRef.current.click();
      }
    };

    document.addEventListener("keydown", handlerKeyDown);
    return () => {
      document.removeEventListener("keydown", handlerKeyDown);
    };
  }, []);

  const onAcceptBtnClick = () => {
    if (contentOfConfirmModal.handleFunc) {
      contentOfConfirmModal.handleFunc(contentOfConfirmModal.dataFunc);
    }
    onClose();
  };

  const onClose = () => {
    setContentOfConfirmModal({
      isOpen: false,
      messageId: "",
      handleFunc: null,
      dataFunc: null,
    });
  };

  return (
    <Modal
      isOpen={contentOfConfirmModal.isOpen}
      className="confirm-modal"
      centered={true}
    >
      <div className="modal-header">
        <div className="modal-title">
          <FormattedMessage id={"common.confirm"} />
        </div>
        <div className="col-auto">
          <button className="btn btn-close" onClick={onClose}>
            <i className="fal fa-times" />
          </button>
        </div>
      </div>

      <div className="modal-body">
        <div className="confirm-modal-content">
          <div className="row">
            <div className="col-12">
              <FormattedMessage
                id={
                  contentOfConfirmModal.messageId
                    ? contentOfConfirmModal.messageId
                    : "common.confirm-this-task"
                }
              />
            </div>

            <hr />

            <div className="col-12">
              <div className="text-center btn-container">
                <button className="btn btn-add" onClick={onClose}>
                  <FormattedMessage id="common.close" />
                </button>
                <button
                  ref={acceptBtnRef}
                  className="btn btn-add"
                  onClick={onAcceptBtnClick}
                >
                  <FormattedMessage id={"common.accept"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  lang: state.app.language,
  contentOfConfirmModal: state.app.contentOfConfirmModal,
});

const mapDispatchToProps = (dispatch) => ({
  setContentOfConfirmModal: (contentOfConfirmModal) =>
    dispatch(actions.setContentOfConfirmModal(contentOfConfirmModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);
