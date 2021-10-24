import React, { useState } from "react";
import { Dropdown, Tab, Tabs } from "react-bootstrap";
import { Link, NavLink, useHistory } from "react-router-dom";
import "../../new.css";
import Darkbutton from "../components/Darkbutton";
import Leftnav from "./Leftnav";
import { useAuth } from "./../context/AuthContext";

const CustomToggle = React.forwardRef(({ children, onClick, src }, ref) => (
  <span
    className="p-0 ms-3 menu-icon nav-search"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <img
      src={src}
      alt="user"
      className="w40 mt--1"
      style={{ borderRadius: "50px" }}
    />
  </span>
));

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isNoti, setIsNoti] = useState(false);
  const [key, setKey] = useState("social");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleActive = () => setIsActive(!isActive);
  const toggleisNoti = () => setIsNoti(!isNoti);

  const navClass = `${isOpen ? " nav-active" : ""}`;
  const buttonClass = `${isOpen ? " active" : ""}`;
  const searchClass = `${isActive ? " show" : ""}`;
  const notiClass = `${isNoti ? " show" : ""}`;

  async function handleLogout() {
    try {
      await logout();
      history.push("/login");
    } catch {
      alert("Failed to log out");
    }
  }

  return (
    <>
      <div
        style={
          history.location.pathname == "/login" ||
          history.location.pathname == "/register"
            ? { display: "none" }
            : {
                display: "flex",
                // backgroundColor: "white",
                position: "static",
                top: "0",
                zIndex: 11,
                width: "100%",
                height: "auto",
              }
        }
        className="bg-white"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "15px",
            paddingBottom: "15px",
            paddingLeft: "10px",
            paddingRight: "10px",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <div
            className="nav-top nav-search"
            // style={{ display: "flex", width: "20%", alignItems: "center" }}
          >
            <Link to="/">
              <img
                src={require("../../public/assets/images/sammartin391-1.png")}
                style={{ width: "200px" }}
              />
            </Link>
          </div>

          <div
            className="nav-top nav-sm-logo"
            //style={{ display: "flex", flexDirection: "row" }}
          >
            <Link to="/">
              <img
                src={require("../../public/assets/images/sammartin391-1.png")}
                style={{ width: "120px" }}
              />
            </Link>
          </div>
          <div
            className="nav-top nav-sm-icon"
            //style={{ display: "flex", flexDirection: "row" }}
          >
            <Link
              to="/defaultmessage"
              className="mob-menu ms-auto me-2 chat-active-btn"
            >
              <i className="feather-message-circle text-grey-900 font-sm btn-round-sm bg-greylight"></i>
            </Link>
            <Link to="/defaultvideo" className="mob-menu me-2">
              <i className="feather-video text-grey-900 font-sm btn-round-sm bg-greylight"></i>
            </Link>
            <span
              onClick={toggleActive}
              className="me-2 menu-search-icon mob-menu"
            >
              <i className="feather-search text-grey-900 font-sm btn-round-sm bg-greylight"></i>
            </span>
            <span onClick={toggleOpen} className="mob-menu me-2">
              <i className="feather-menu text-grey-900 font-sm btn-round-sm bg-greylight"></i>
            </span>
          </div>

          <form action="#" className="float-left header-search ms-3 nav-search">
            <div className="form-group mb-0 icon-input">
              <i className="feather-search font-sm text-grey-400"></i>
              <input
                type="text"
                placeholder="Start typing to search.."
                className="bg-grey border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xssss fw-500 rounded-xl w350 theme-dark-bg"
              />
            </div>
          </form>
          <NavLink
            activeClassName="active"
            to="/"
            className="p-2 text-center ms-3 menu-icon center-menu-icon nav-icon"
          >
            {history.location.pathname == "/" ? (
              <img
                src={require("../../public/assets/images/icons/Homeactive.png")}
                style={{ width: "50px" }}
              />
            ) : (
              <img
                src={require("../../public/assets/images/icons/Home.png")}
                style={{ width: "50px" }}
              />
            )}
          </NavLink>
          <NavLink
            activeClassName="active"
            to="/defaultgroup"
            className="p-2 text-center ms-0 menu-icon center-menu-icon nav-icon"
          >
            {/* <i className="feather-zap font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i> */}
            {history.location.pathname == "/defaultgroup" ? (
              <img
                src={require("../../public/assets/images/icons/Hotrightnowactive.png")}
                style={{ width: "50px" }}
              />
            ) : (
              <img
                src={require("../../public/assets/images/icons/Hotrightnow.png")}
                style={{ width: "50px" }}
              />
            )}
          </NavLink>
          <NavLink
            activeClassName="active"
            to={{
              pathname: `/${currentUser?.name}/${currentUser?.id}`,
            }}
            className="p-2 text-center ms-0 menu-icon center-menu-icon nav-icon"
          >
            {history.location.pathname ==
            `/${currentUser?.name}/${currentUser?.id}` ? (
              <div
                className="font-lg btn-round-lg theme-dark-bg text-grey-500 "
                style={{ backgroundColor: "#fff6f6" }}
              >
                <img
                  src={require("../../public/assets/images/icons/useractive.png")}
                  style={{ width: "20px" }}
                />
              </div>
            ) : (
              <i className="font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 ">
                <img
                  src={require("../../public/assets/images/icons/user.png")}
                  style={{ width: "20px" }}
                />
              </i>
            )}
            {/* <i className="feather-user font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i> */}
          </NavLink>
          <NavLink
            activeClassName="active"
            to="/defaultvideo"
            className="p-2 text-center ms-0 menu-icon center-menu-icon nav-icon"
          >
            {history.location.pathname == "/defaultvideo" ? (
              <img
                src={require("../../public/assets/images/icons/Movieactive.png")}
                style={{ width: "50px" }}
              />
            ) : (
              <img
                src={require("../../public/assets/images/icons/Movie.png")}
                style={{ width: "50px" }}
              />
            )}
          </NavLink>

          <span
            className={`p-2 pointer text-center ms-auto menu-icon ${notiClass} nav-search`}
            id="dropdownMenu3"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={toggleisNoti}
          >
            <span className="dot-count bg-warning"></span>
            <img
              src={require("../../public/assets/images/icons/notificationicon.png")}
              style={{ width: "25px", marginRight: "5px" }}
            />
          </span>
          <div
            className={`dropdown-menu p-4 right-0 rounded-xxl border-0 shadow-lg ${notiClass} nav-search`}
            aria-labelledby="dropdownMenu3"
          >
            <h4 className="fw-700 font-xss mb-4">Notification</h4>
            <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
              <img
                src={require("../../public/assets/images/user.png")}
                alt="user"
                className="w40 position-absolute left-0"
              />
              <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
                Hendrix Stamp{" "}
                <span className="text-grey-400 font-xsssss fw-600 float-right mt-1">
                  {" "}
                  3 min
                </span>
              </h5>
              <h6 className="text-grey-500 fw-500 font-xssss lh-4">
                There are many variations of pass..
              </h6>
            </div>
            <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
              <img
                src={require("../../public/assets/images/user.png")}
                alt="user"
                className="w40 position-absolute left-0"
              />
              <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
                Goria Coast{" "}
                <span className="text-grey-400 font-xsssss fw-600 float-right mt-1">
                  {" "}
                  2 min
                </span>
              </h5>
              <h6 className="text-grey-500 fw-500 font-xssss lh-4">
                Mobile Apps UI Designer is require..
              </h6>
            </div>

            <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
              <img
                src={require("../../public/assets/images/user.png")}
                alt="user"
                className="w40 position-absolute left-0"
              />
              <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
                Surfiya Zakir{" "}
                <span className="text-grey-400 font-xsssss fw-600 float-right mt-1">
                  {" "}
                  1 min
                </span>
              </h5>
              <h6 className="text-grey-500 fw-500 font-xssss lh-4">
                Mobile Apps UI Designer is require..
              </h6>
            </div>
            <div className="card bg-transparent-card w-100 border-0 ps-5">
              <img
                src={require("../../public/assets/images/user.png")}
                alt="user"
                className="w40 position-absolute left-0"
              />
              <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
                Victor Exrixon{" "}
                <span className="text-grey-400 font-xsssss fw-600 float-right mt-1">
                  {" "}
                  30 sec
                </span>
              </h5>
              <h6 className="text-grey-500 fw-500 font-xssss lh-4">
                Mobile Apps UI Designer is require..
              </h6>
            </div>
          </div>
          <Link
            to="/defaultmessage"
            className="p-2 text-center ms-3 menu-icon chat-active-btn nav-search"
          >
            <img
              src={require("../../public/assets/images/icons/messageicon.png")}
              style={{ width: "25px", marginRight: "7px" }}
            />
          </Link>
          <a className="p-0 ms-3 menu-icon nav-search">
            <img
              src={require("../../public/assets/images/icons/Stub.png")}
              style={{ width: "30px", marginRight: "7px" }}
            />
            <span>{`${currentUser?.stubs} stubs`}</span>
          </a>

          <Dropdown>
            <Dropdown.Toggle
              as={CustomToggle}
              variant="success"
              id="dropdown-basic"
              src={currentUser?.thumbnail}
            >
              Dropdown Button
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() =>
                  history.push(`/${currentUser?.name}/${currentUser?.id}`)
                }
              >
                {currentUser?.name}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => history.push(`/createhouse`)}>
                Create House
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <nav
          className={`navigation scroll-bar ${navClass}`}
          style={
            key == "movies" ||
            history.location.pathname == "/defaultmessage" ||
            history.location.pathname == "/createhouse"
              ? { display: "none" }
              : { display: "block" }
          }
        >
          <div
            className="container NewsFeed ps-0 pe-0"
            style={{ marginTop: "100px" }}
          >
            <div className="nav-content">
              <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
                <div className="nav-caption fw-600 font-xssss text-grey-500">
                  <span>New </span>Feeds
                </div>
                <ul className="mb-1 top-content">
                  <li className="logo d-none d-xl-block d-lg-block"></li>
                  <li>
                    <Link to="/" className="nav-content-bttn open-font">
                      <img
                        src={require("../../public/assets/images/icons/Home.png")}
                        style={{ width: "50px", marginRight: "12px" }}
                      />
                      <span>News feed</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/defaultVideo"
                      className="nav-content-bttn open-font"
                    >
                      <img
                        src={require("../../public/assets/images/icons/Hot_right_now.png")}
                        style={{ width: "50px", marginRight: "12px" }}
                      />
                      <span>Hot Right Now</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/defaultgroup"
                      className="nav-content-bttn open-font"
                    >
                      <img
                        src={require("../../public/assets/images/icons/houses.png")}
                        style={{ width: "50px", marginRight: "12px" }}
                      />
                      <span>Houses</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/defaultvideo"
                      className="nav-content-bttn open-font"
                    >
                      <img
                        src={require("../../public/assets/images/icons/Movie.png")}
                        style={{ width: "50px", marginRight: "12px" }}
                      />
                      <span>Live Stream</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1">
                <div className="nav-caption fw-600 font-xssss text-grey-500">
                  <span></span> Account
                </div>
                <ul className="mb-1">
                  <li className="logo d-none d-xl-block d-lg-block"></li>
                  <li>
                    <Link
                      to="/defaultsettings"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="font-sm feather-settings me-3 text-grey-500"></i>
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/defaultmessage"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <img
                        src={require("../../public/assets/images/icons/cart.png")}
                        style={{ width: "20px", marginRight: "12px" }}
                      />
                      <span>Messages</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/defaultmessage"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="font-sm feather-message-square me-3 text-grey-500"></i>
                      <span>Buy BAM's</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div
        style={
          history.location.pathname == "/login" ||
          history.location.pathname == "/register"
            ? { display: "none" }
            : {
                display: "flex",
                position: "static",
                top: "0px",
                width: "100%",
                overflow: "hidden",
                height: "auto",
                backgroundColor: "white",
                zIndex: "1",
              }
        }
      >
        <div
          className="bg-white shadow-xs"
          style={{
            width: "100%",
          }}
        >
          <Tabs
            defaultActiveKey="social"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              fontSize: 25,
              marginBottom: "20px",
            }}
          >
            <Tab
              eventKey="social"
              title="Social"
              style={
                window.innerWidth >= 1200
                  ? {
                      position: "absolute",
                      padding: "0",
                      left: "300px",
                      height: "70vh",
                      overflow: "hidden scroll",
                    }
                  : window.innerWidth >= 1000 && window.innerWidth < 1200
                  ? {
                      position: "absolute",
                      padding: "0",
                      left: "300px",
                      height: "70vh",
                      overflow: "hidden scroll",
                    }
                  : { width: "auto" }
              }
              tabClassName="tabStyle"
            >
              {props.socialTab}
            </Tab>
            <Tab
              tabClassName="tabStyle"
              eventKey="movies"
              title="Movies"
              style={
                window.innerWidth >= 1200
                  ? {
                      position: "absolute",
                      padding: "0",
                      left: "300px",
                    }
                  : window.innerWidth >= 1000 && window.innerWidth < 1200
                  ? {
                      width: "70%",
                      position: "absolute",
                      padding: "0",
                      left: "300px",
                    }
                  : { width: "auto" }
              }
            >
              {props.movieTab}
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Header;
