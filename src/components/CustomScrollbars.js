import React, { useRef } from "react";
import { Scrollbars } from "react-custom-scrollbars";

import "./CustomScrollbars.scss";

const CustomScrollbars = ({
  className,
  disableVerticalScroll,
  disableHorizontalScroll,
  children,
  quickScroll,
  ...otherProps
}) => {
  const scrollbarsRef = useRef(null);

  const getScrollLeft = () => {
    const scrollbars = scrollbarsRef.current;
    return scrollbars ? scrollbars.getScrollLeft() : 0;
  };

  const getScrollTop = () => {
    const scrollbars = scrollbarsRef.current;
    return scrollbars ? scrollbars.getScrollTop() : 0;
  };

  const scrollToBottom = () => {
    const scrollbars = scrollbarsRef.current;
    if (scrollbars) {
      const targetScrollTop = scrollbars.getScrollHeight();
      scrollTo(targetScrollTop);
    }
  };

  const scrollTo = (targetTop) => {
    const scrollbars = scrollbarsRef.current;
    if (scrollbars) {
      const originalTop = scrollbars.getScrollTop();
      let iteration = 0;

      const scroll = () => {
        iteration++;
        if (iteration > 30) return;
        scrollbars.scrollTop(
          originalTop + ((targetTop - originalTop) / 30) * iteration
        );

        if (quickScroll) {
          scroll();
        } else {
          setTimeout(scroll, 20);
        }
      };

      scroll();
    }
  };

  const renderTrackHorizontal = (props) => (
    <div {...props} className="track-horizontal" />
  );

  const renderTrackVertical = (props) => (
    <div {...props} className="track-vertical" />
  );

  const renderThumbHorizontal = (props) => (
    <div {...props} className="thumb-horizontal" />
  );

  const renderThumbVertical = (props) => (
    <div {...props} className="thumb-vertical" />
  );

  const renderNone = (props) => <div />;

  return (
    <Scrollbars
      ref={scrollbarsRef}
      autoHide={true}
      autoHideTimeout={200}
      hideTracksWhenNotNeeded={true}
      className={
        className ? `${className} custom-scrollbar` : "custom-scrollbar"
      }
      {...otherProps}
      renderTrackHorizontal={
        disableHorizontalScroll ? renderNone : renderTrackHorizontal
      }
      renderTrackVertical={
        disableVerticalScroll ? renderNone : renderTrackVertical
      }
      renderThumbHorizontal={
        disableHorizontalScroll ? renderNone : renderThumbHorizontal
      }
      renderThumbVertical={
        disableVerticalScroll ? renderNone : renderThumbVertical
      }
    >
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbars;
