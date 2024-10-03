import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUsers,
  faInfoCircle,
  faClipboard,
  faBook,
  faTasks,
  faList,
  faAddressCard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./css/sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar open/close

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar state
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        {isOpen && (
          <h2>
            <FontAwesomeIcon icon={faUsers} className="icon" /> Staff
            Information System
          </h2>
        )}
      </div>
      <div className="sidebar-menu">
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">
              <FontAwesomeIcon icon={faInfoCircle} className="icon" />{" "}
              {isOpen && "Information"}
            </Link>
          </li>
          <li className={location.pathname === "/noticeboard" ? "active" : ""}>
            <Link to="/noticeboard">
              <FontAwesomeIcon icon={faClipboard} className="icon" />{" "}
              {isOpen && "Notice Board"}
            </Link>
          </li>
          <li className={location.pathname === "/assigncourse" ? "active" : ""}>
            <Link to="/assigncourse">
              <FontAwesomeIcon icon={faBook} className="icon" />{" "}
              {isOpen && "Assign Course"}
            </Link>
          </li>
          <li className={location.pathname === "/assigntask" ? "active" : ""}>
            <Link to="/assigntask">
              <FontAwesomeIcon icon={faTasks} className="icon" />{" "}
              {isOpen && "Assign Task"}
            </Link>
          </li>
          <li className={location.pathname === "/worklist" ? "active" : ""}>
            <Link to="/worklist">
              <FontAwesomeIcon icon={faList} className="icon" />{" "}
              {isOpen && "Worklist"}
            </Link>
          </li>
          <li className={location.pathname === "/about" ? "active" : ""}>
            <Link to="/about">
              <FontAwesomeIcon icon={faAddressCard} className="icon" />{" "}
              {isOpen && "About"}
            </Link>
          </li>

          <li className={location.pathname === "/login" ? "active" : ""}>
            <Link to="/login">
              <FontAwesomeIcon icon={faUser} className="icon" />{" "}
              {isOpen && "Login"}
            </Link>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
