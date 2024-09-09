// import React, { Component } from 'react';
// import Flatpickr from 'react-flatpickr';
// import moment from 'moment';

// import { KeyCodeUtils } from "../../utils";
// import './DatePicker.scss';

// // const CustomInput = ({ value, defaultValue, inputRef, onInputChange, onInputBlur, ...props }) => {
// //     return <input {...props} className='custom-form-control custom-date-input' defaultValue={defaultValue} ref={inputRef}
// //         onChange={onInputChange}
// //         onBlur={onInputBlur}
// //     />;
// // };

// class DatePicker extends Component {

//     flatpickrNode = null;

//     nodeRef = element => {
//         this.flatpickr = element && element.flatpickr;
//         this.flatpickrNode = element && element.node;
//         if (this.flatpickrNode) {
//             this.flatpickrNode.addEventListener('blur', this.handleBlur);
//             this.flatpickrNode.addEventListener('keydown', this.handlerKeyDown);
//         }
//     };

//     handlerKeyDown = (event) => {
//         const keyCode = event.which || event.keyCode;
//         if (keyCode === KeyCodeUtils.ENTER) {
//             event.preventDefault();
//             const { onChange } = this.props;
//             const value = event.target.value;

//             // Take the blur event and process the string value
//             const valueMoment = moment(value, 'DD/MM/YYYY');
//             onChange([valueMoment.toDate(), valueMoment.toDate()]);
//         }
//     }

//     componentWillUnmount() {
//         if (this.flatpickrNode) {
//             this.flatpickrNode.removeEventListener('blur', this.handleBlur);
//             this.flatpickrNode.removeEventListener('keydown', this.handlerKeyDown);
//         }
//     }

//     handleBlur = (event) => {
//         const { onChange } = this.props;
//         const value = event.target.value;

//         // Take the blur event and process the string value
//         event.preventDefault();
//         const valueMoment = moment(value, 'DD/MM/YYYY');
//         onChange([valueMoment.toDate(), valueMoment.toDate()]);
//     };

//     onOpen = () => {
//         if (this.flatpickrNode) {
//             this.flatpickrNode.blur();
//         }
//     }

//     close() {
//         this.flatpickr.close();
//     }

//     checkDateValue = (str, max) => {
//         if (str.charAt(0) !== '0' || str === '00') {
//             var num = parseInt(str);
//             if (isNaN(num) || num <= 0 || num > max) num = 1;
//             str = num > parseInt(max.toString().charAt(0)) && num.toString().length === 1 ? '0' + num : num.toString();
//         };
//         return str;
//     }

//     // autoFormatonBlur = (value) => {
//     //     var input = value;
//     //     var values = input.split('/').map(function (v, i) {
//     //         return v.replace(/\D/g, '')
//     //     });
//     //     var output = '';

//     //     if (values.length == 3) {
//     //         var year = values[2].length !== 4 ? parseInt(values[2]) + 2000 : parseInt(values[2]);
//     //         var month = parseInt(values[0]) - 1;
//     //         var day = parseInt(values[1]);
//     //         var d = new Date(year, month, day);
//     //         if (!isNaN(d)) {
//     //             //document.getElementById('result').innerText = d.toString();
//     //             var dates = [d.getMonth() + 1, d.getDate(), d.getFullYear()];
//     //             output = dates.map(function (v) {
//     //                 v = v.toString();
//     //                 return v.length == 1 ? '0' + v : v;
//     //             }).join(' / ');
//     //         };
//     //     };
//     //     // this.value = output;
//     //     return output;
//     // }

//     autoFormatOnChange = (value, seperator) => {
//         var input = value;

//         let regexForDeleting = new RegExp(`\\D\\${seperator}$`);

//         //if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3); // dat.nt: Xóa thêm 1 ký tự nếu xóa dấu cách sau / (VD: 12 / 12 /=> 12 / 1)

//         if (regexForDeleting.test(input)) input = input.substr(0, input.length - 3);

//         var values = input.split(seperator).map(function (v) {
//             return v.replace(/\D/g, '')
//         });

//         if (values[0]) values[0] = this.checkDateValue(values[0], 31);
//         if (values[1]) values[1] = this.checkDateValue(values[1], 12);
//         var output = values.map(function (v, i) {
//             return v.length === 2 && i < 2 ? v + ' ' + seperator + ' ' : v;
//         });
//         return output.join('').substr(0, 14);
//     }

//     onInputChange = (e) => {
//         if (this.DISPLAY_FORMAT === this.DATE_FORMAT_AUTO_FILL) {
//             let converted = this.autoFormatOnChange(e.target.value, this.SEPERATOR);
//             e.target.value = converted;
//         }
//     }

//     onInputBlur = (e) => {
//     }

//     //dat.nt : Auto Fill cho dạng ngăn cách và format cụ thể (seperator có thể dc thay thế)
//     SEPERATOR = "/";
//     DATE_FORMAT_AUTO_FILL = "d/m/Y"; // Format không thay đổi

//     // dat.nt : Format ngày hiển thị
//     DISPLAY_FORMAT = "d/m/Y";

//     render() {
//         const { value, onChange, minDate, onClose, ...otherProps } = this.props;
//         const options = {
//             dateFormat: this.DISPLAY_FORMAT,
//             allowInput: true,
//             disableMobile: true,
//             onClose: onClose,
//             onOpen: this.onOpen
//         };
//         if (minDate) {
//             options.minDate = minDate;
//         }
//         return (
//             <Flatpickr
//                 ref={this.nodeRef}
//                 value={value}
//                 onChange={onChange}
//                 options={options}
//                 // render={
//                 //     ({ defaultValue, value, ...props }, ref) => {
//                 //         return <CustomInput defaultValue={defaultValue} inputRef={ref} onInputChange={this.onInputChange} onInputBlur={this.onInputBlur} />
//                 //     }
//                 // }
//                 {...otherProps}
//             />
//         );
//     }
// }

// export default DatePicker;
import React, { useRef, useEffect, useCallback } from "react";
import Flatpickr from "react-flatpickr";
import moment from "moment";

import { KeyCodeUtils } from "../../utils";
import "./DatePicker.scss";

const DatePicker = ({ value, onChange, minDate, onClose, ...otherProps }) => {
  const flatpickrRef = useRef(null);
  const flatpickrNodeRef = useRef(null);

  const nodeRef = useCallback((element) => {
    flatpickrRef.current = element && element.flatpickr;
    flatpickrNodeRef.current = element && element.node;
    if (flatpickrNodeRef.current) {
      flatpickrNodeRef.current.addEventListener("blur", handleBlur);
      flatpickrNodeRef.current.addEventListener("keydown", handlerKeyDown);
    }
  }, []);

  const handlerKeyDown = useCallback(
    (event) => {
      const keyCode = event.which || event.keyCode;
      if (keyCode === KeyCodeUtils.ENTER) {
        event.preventDefault();
        const value = event.target.value;
        const valueMoment = moment(value, "DD/MM/YYYY");
        onChange([valueMoment.toDate(), valueMoment.toDate()]);
      }
    },
    [onChange]
  );

  const handleBlur = useCallback(
    (event) => {
      const value = event.target.value;
      event.preventDefault();
      const valueMoment = moment(value, "DD/MM/YYYY");
      onChange([valueMoment.toDate(), valueMoment.toDate()]);
    },
    [onChange]
  );

  const onOpen = useCallback(() => {
    if (flatpickrNodeRef.current) {
      flatpickrNodeRef.current.blur();
    }
  }, []);

  const close = useCallback(() => {
    if (flatpickrRef.current) {
      flatpickrRef.current.close();
    }
  }, []);

  const checkDateValue = useCallback((str, max) => {
    if (str.charAt(0) !== "0" || str === "00") {
      let num = parseInt(str);
      if (isNaN(num) || num <= 0 || num > max) num = 1;
      str =
        num > parseInt(max.toString().charAt(0)) && num.toString().length === 1
          ? "0" + num
          : num.toString();
    }
    return str;
  }, []);

  const autoFormatOnChange = useCallback(
    (value, separator) => {
      let input = value;
      const regexForDeleting = new RegExp(`\\D${separator}$`);
      if (regexForDeleting.test(input))
        input = input.substr(0, input.length - 3);

      let values = input.split(separator).map((v) => v.replace(/\D/g, ""));
      if (values[0]) values[0] = checkDateValue(values[0], 31);
      if (values[1]) values[1] = checkDateValue(values[1], 12);

      const output = values.map((v, i) =>
        v.length === 2 && i < 2 ? `${v} ${separator} ` : v
      );
      return output.join("").substr(0, 14);
    },
    [checkDateValue]
  );

  const onInputChange = useCallback(
    (e) => {
      if (DISPLAY_FORMAT === DATE_FORMAT_AUTO_FILL) {
        const converted = autoFormatOnChange(e.target.value, SEPARATOR);
        e.target.value = converted;
      }
    },
    [autoFormatOnChange]
  );

  // Constants
  const SEPARATOR = "/";
  const DATE_FORMAT_AUTO_FILL = "d/m/Y";
  const DISPLAY_FORMAT = "d/m/Y";

  useEffect(() => {
    return () => {
      if (flatpickrNodeRef.current) {
        flatpickrNodeRef.current.removeEventListener("blur", handleBlur);
        flatpickrNodeRef.current.removeEventListener("keydown", handlerKeyDown);
      }
    };
  }, [handleBlur, handlerKeyDown]);

  const options = {
    dateFormat: DISPLAY_FORMAT,
    allowInput: true,
    disableMobile: true,
    onClose: onClose,
    onOpen: onOpen,
  };
  if (minDate) {
    options.minDate = minDate;
  }

  return (
    <Flatpickr
      ref={nodeRef}
      value={value}
      onChange={onChange}
      options={options}
      {...otherProps}
    />
  );
};

export default DatePicker;
