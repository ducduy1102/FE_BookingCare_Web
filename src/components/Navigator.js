// import React, { Component, Fragment } from "react";
// import { Link, withRouter } from "react-router-dom";
// import { FormattedMessage } from "react-intl";
// import { connect } from "react-redux";

// import "./Navigator.scss";

// class MenuGroup extends Component {
//   render() {
//     const { name, children } = this.props;
//     return (
//       <li className="menu-group">
//         <div className="menu-group-name">
//           <FormattedMessage id={name} />
//         </div>
//         <ul className="menu-list list-unstyled">{children}</ul>
//       </li>
//     );
//   }
// }

// class Menu extends Component {
//   render() {
//     const { name, active, link, children, onClick, hasSubMenu, onLinkClick } =
//       this.props;
//     return (
//       <li
//         className={
//           "menu" +
//           (hasSubMenu ? " has-sub-menu" : "") +
//           "" +
//           (active ? " active" : "")
//         }
//       >
//         {hasSubMenu ? (
//           <Fragment>
//             <span
//               data-toggle="collapse"
//               className={"menu-link collapsed"}
//               onClick={onClick}
//               aria-expanded={"false"}
//             >
//               <FormattedMessage id={name} />
//               <div className="icon-right">
//                 <i className={"far fa-angle-right"} />
//               </div>
//             </span>
//             <div>
//               <ul className="sub-menu-list list-unstyled">{children}</ul>
//             </div>
//           </Fragment>
//         ) : (
//           <Link to={link} className="menu-link" onClick={onLinkClick}>
//             <FormattedMessage id={name} />
//           </Link>
//         )}
//       </li>
//     );
//   }
// }

// class SubMenu extends Component {
//   getItemClass = (path) => {
//     return this.props.location.pathname === path ? "active" : "";
//   };

//   render() {
//     const { name, link, onLinkClick } = this.props;
//     return (
//       <li className={"sub-menu " + this.getItemClass(link)}>
//         <Link to={link} className="sub-menu-link" onClick={onLinkClick}>
//           <FormattedMessage id={name} />
//         </Link>
//       </li>
//     );
//   }
// }

// const MenuGroupWithRouter = withRouter(MenuGroup);
// const MenuWithRouter = withRouter(Menu);
// const SubMenuWithRouter = withRouter(SubMenu);

// const withRouterInnerRef = (WrappedComponent) => {
//   class InnerComponentWithRef extends React.Component {
//     render() {
//       const { forwardRef, ...rest } = this.props;
//       return <WrappedComponent {...rest} ref={forwardRef} />;
//     }
//   }

//   const ComponentWithRef = withRouter(InnerComponentWithRef, { withRef: true });

//   return React.forwardRef((props, ref) => {
//     return <ComponentWithRef {...props} forwardRef={ref} />;
//   });
// };

// class Navigator extends Component {
//   state = {
//     expandedMenu: {},
//   };

//   toggle = (groupIndex, menuIndex) => {
//     const expandedMenu = {};
//     const needExpand = !(
//       this.state.expandedMenu[groupIndex + "_" + menuIndex] === true
//     );
//     if (needExpand) {
//       expandedMenu[groupIndex + "_" + menuIndex] = true;
//     }

//     this.setState({
//       expandedMenu: expandedMenu,
//     });
//   };

//   isMenuHasSubMenuActive = (location, subMenus, link) => {
//     if (subMenus) {
//       if (subMenus.length === 0) {
//         return false;
//       }

//       const currentPath = location.pathname;
//       for (let i = 0; i < subMenus.length; i++) {
//         const subMenu = subMenus[i];
//         if (subMenu.link === currentPath) {
//           return true;
//         }
//       }
//     }

//     if (link) {
//       return this.props.location.pathname === link;
//     }

//     return false;
//   };

//   checkActiveMenu = () => {
//     const { menus, location } = this.props;
//     outerLoop: for (let i = 0; i < menus.length; i++) {
//       const group = menus[i];
//       if (group.menus && group.menus.length > 0) {
//         for (let j = 0; j < group.menus.length; j++) {
//           const menu = group.menus[j];
//           if (menu.subMenus && menu.subMenus.length > 0) {
//             if (this.isMenuHasSubMenuActive(location, menu.subMenus, null)) {
//               const key = i + "_" + j;
//               this.setState({
//                 expandedMenu: {
//                   [key]: true,
//                 },
//               });
//               break outerLoop;
//             }
//           }
//         }
//       }
//     }
//   };

//   componentDidMount() {
//     this.checkActiveMenu();
//   }

//   // componentWillReceiveProps(nextProps, prevState) {
//   //     const { location, setAccountMenuPath, setSettingMenuPath } = this.props;
//   //     const { location: nextLocation } = nextProps;
//   //     if (location !== nextLocation) {
//   //         let pathname = nextLocation && nextLocation.pathname;
//   //         if ((pathname.startsWith('/account/') || pathname.startsWith('/fds/account/'))) {
//   //             setAccountMenuPath(pathname);
//   //         }
//   //         if (pathname.startsWith('/settings/')) {
//   //             setSettingMenuPath(pathname);
//   //         };
//   //     };
//   // };

//   componentDidUpdate(prevProps, prevState) {
//     const { location } = this.props;
//     const { location: prevLocation } = prevProps;
//     if (location !== prevLocation) {
//       this.checkActiveMenu();
//     }
//   }

//   render() {
//     const { menus, location, onLinkClick } = this.props;
//     return (
//       <Fragment>
//         <ul className="navigator-menu list-unstyled">
//           {menus.map((group, groupIndex) => {
//             return (
//               <Fragment key={groupIndex}>
//                 <MenuGroupWithRouter name={group.name}>
//                   {group.menus
//                     ? group.menus.map((menu, menuIndex) => {
//                         const isMenuHasSubMenuActive =
//                           this.isMenuHasSubMenuActive(
//                             location,
//                             menu.subMenus,
//                             menu.link
//                           );
//                         const isSubMenuOpen =
//                           this.state.expandedMenu[
//                             groupIndex + "_" + menuIndex
//                           ] === true;
//                         return (
//                           <MenuWithRouter
//                             key={menuIndex}
//                             active={isMenuHasSubMenuActive}
//                             name={menu.name}
//                             link={menu.link}
//                             hasSubMenu={menu.subMenus}
//                             isOpen={isSubMenuOpen}
//                             onClick={() => this.toggle(groupIndex, menuIndex)}
//                             onLinkClick={onLinkClick}
//                           >
//                             {menu.subMenus &&
//                               menu.subMenus.map((subMenu, subMenuIndex) => (
//                                 <SubMenuWithRouter
//                                   key={subMenuIndex}
//                                   name={subMenu.name}
//                                   link={subMenu.link}
//                                   onClick={this.closeOtherExpand}
//                                   onLinkClick={onLinkClick}
//                                 />
//                               ))}
//                           </MenuWithRouter>
//                         );
//                       })
//                     : null}
//                 </MenuGroupWithRouter>
//               </Fragment>
//             );
//           })}
//         </ul>
//       </Fragment>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {};
// };

// const mapDispatchToProps = (dispatch) => {
//   return {};
// };

// export default withRouterInnerRef(
//   connect(mapStateToProps, mapDispatchToProps)(Navigator)
// );

import React, { Fragment, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./Navigator.scss";

const MenuGroup = ({ name, children }) => (
  <li className="menu-group">
    <div className="menu-group-name">
      <FormattedMessage id={name} />
    </div>
    <ul className="menu-list list-unstyled">{children}</ul>
  </li>
);

const Menu = ({
  name,
  active,
  link,
  children,
  onClick,
  hasSubMenu,
  onLinkClick,
}) => (
  <li
    className={`menu${hasSubMenu ? " has-sub-menu" : ""}${
      active ? " active" : ""
    }`}
  >
    {hasSubMenu ? (
      <Fragment>
        <span
          data-toggle="collapse"
          className="menu-link collapsed"
          onClick={onClick}
          aria-expanded="false"
        >
          <FormattedMessage id={name} />
          <div className="icon-right">
            <i className="far fa-angle-right" />
          </div>
        </span>
        <div>
          <ul className="sub-menu-list list-unstyled">{children}</ul>
        </div>
      </Fragment>
    ) : (
      <Link to={link} className="menu-link" onClick={onLinkClick}>
        <FormattedMessage id={name} />
      </Link>
    )}
  </li>
);

const SubMenu = ({ name, link, onLinkClick }) => {
  const location = useLocation();
  const getItemClass = (path) => (location.pathname === path ? "active" : "");

  return (
    <li className={`sub-menu ${getItemClass(link)}`}>
      <Link to={link} className="sub-menu-link" onClick={onLinkClick}>
        <FormattedMessage id={name} />
      </Link>
    </li>
  );
};

const Navigator = ({ menus, onLinkClick }) => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState({});

  const toggle = useCallback((groupIndex, menuIndex) => {
    setExpandedMenu((prevExpandedMenu) => {
      const key = `${groupIndex}_${menuIndex}`;
      const needExpand = !(prevExpandedMenu[key] === true);
      return needExpand ? { [key]: true } : {};
    });
  }, []);

  const isMenuHasSubMenuActive = useCallback(
    (subMenus, link) => {
      if (subMenus) {
        if (subMenus.length === 0) return false;
        return subMenus.some((subMenu) => subMenu.link === location.pathname);
      }
      return link ? location.pathname === link : false;
    },
    [location.pathname]
  );

  const checkActiveMenu = useCallback(() => {
    outerLoop: for (let i = 0; i < menus.length; i++) {
      const group = menus[i];
      if (group.menus && group.menus.length > 0) {
        for (let j = 0; j < group.menus.length; j++) {
          const menu = group.menus[j];
          if (menu.subMenus && menu.subMenus.length > 0) {
            if (isMenuHasSubMenuActive(menu.subMenus, null)) {
              const key = `${i}_${j}`;
              setExpandedMenu({ [key]: true });
              break outerLoop;
            }
          }
        }
      }
    }
  }, [menus, isMenuHasSubMenuActive]);

  useEffect(() => {
    checkActiveMenu();
  }, [checkActiveMenu]);

  return (
    <Fragment>
      <ul className="navigator-menu list-unstyled">
        {menus.map((group, groupIndex) => (
          <Fragment key={groupIndex}>
            <MenuGroup name={group.name}>
              {group.menus &&
                group.menus.map((menu, menuIndex) => {
                  const isActive = isMenuHasSubMenuActive(
                    menu.subMenus,
                    menu.link
                  );
                  const isSubMenuOpen =
                    expandedMenu[`${groupIndex}_${menuIndex}`] === true;
                  return (
                    <Menu
                      key={menuIndex}
                      active={isActive}
                      name={menu.name}
                      link={menu.link}
                      hasSubMenu={menu.subMenus}
                      onClick={() => toggle(groupIndex, menuIndex)}
                      onLinkClick={onLinkClick}
                    >
                      {menu.subMenus &&
                        menu.subMenus.map((subMenu, subMenuIndex) => (
                          <SubMenu
                            key={subMenuIndex}
                            name={subMenu.name}
                            link={subMenu.link}
                            onLinkClick={onLinkClick}
                          />
                        ))}
                    </Menu>
                  );
                })}
            </MenuGroup>
          </Fragment>
        ))}
      </ul>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  // Add your mapStateToProps logic here
});

const mapDispatchToProps = (dispatch) => ({
  // Add your mapDispatchToProps logic here
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);
