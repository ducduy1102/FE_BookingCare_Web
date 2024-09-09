// import React, { Component, Fragment } from 'react';
// import { FormattedMessage, FormattedTime } from 'react-intl';

// import CustomScrollBar from '../components/CustomScrollbars';

// import './CustomToast.scss';

// class CustomToast extends Component {

//     render() {
//         const { titleId, message, messageId, time } = this.props;
//         return (
//             <Fragment>
//                 <div className="custom-toast">
//                     <div className="toast-title">
//                         {time && (
//                             <span className="date">
//                                 <FormattedTime hour='numeric' minute='numeric' second='numeric' hour12={true} value={time} />
//                             </span>
//                         )}
//                         <i className="fa fa-fw fa-exclamation-triangle" />
//                         <FormattedMessage id={titleId} />
//                     </div>
//                     {
//                         (message && typeof message === 'object') ?
//                             <CustomScrollBar autoHeight={true} autoHeightMin={50} autoHeightMax={100}>
//                                 {
//                                     message.map((msg, index) => {
//                                         return (
//                                             <Fragment key={index}>
//                                                 <div className="toast-content">{msg}</div>
//                                             </Fragment>
//                                         )
//                                     })
//                                 }
//                             </CustomScrollBar> :
//                             <div className="toast-content">
//                                 {message ? message : (messageId ? (<FormattedMessage id={messageId} />) : null)}
//                             </div>
//                     }
//                 </div>
//             </Fragment>
//         );
//     }
// }

// export class CustomToastCloseButton extends Component {

//     render() {
//         return (
//             <button type="button" className="toast-close" onClick={this.props.closeToast}>
//                 <i className="fa fa-fw fa-times-circle" />
//             </button>
//         );
//     }
// }

// export default CustomToast;
import React from "react";
import { FormattedMessage, FormattedTime } from "react-intl";
import CustomScrollBar from "../components/CustomScrollbars";
import "./CustomToast.scss";

// Functional component for CustomToast
const CustomToast = ({ titleId, message, messageId, time }) => {
  return (
    <>
      <div className="custom-toast">
        <div className="toast-title">
          {time && (
            <span className="date">
              <FormattedTime
                hour="numeric"
                minute="numeric"
                second="numeric"
                hour12={true}
                value={time}
              />
            </span>
          )}
          <i className="fa fa-fw fa-exclamation-triangle" />
          <FormattedMessage id={titleId} />
        </div>
        {message && Array.isArray(message) ? (
          <CustomScrollBar
            autoHeight={true}
            autoHeightMin={50}
            autoHeightMax={100}
          >
            {message.map((msg, index) => (
              <div className="toast-content" key={index}>
                {msg}
              </div>
            ))}
          </CustomScrollBar>
        ) : (
          <div className="toast-content">
            {message ||
              (messageId ? <FormattedMessage id={messageId} /> : null)}
          </div>
        )}
      </div>
    </>
  );
};

// Functional component for CustomToastCloseButton
const CustomToastCloseButton = ({ closeToast }) => {
  return (
    <button type="button" className="toast-close" onClick={closeToast}>
      <i className="fa fa-fw fa-times-circle" />
    </button>
  );
};

export { CustomToast, CustomToastCloseButton };
