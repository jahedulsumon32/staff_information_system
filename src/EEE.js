import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Staff from "./Staff";
import EEEstaffData from "./data/EEEstaff"; // Import the data file
import "./css/card.css"; // Import CSS file for styling
import "./css/staff.css";
import noimage from "./assets/noimage.jpg"; // Import the image file

const EEE = () => {
  const [additionalStaff, setAdditionalStaff] = useState([]);

  const linkStyle = {
    textDecoration: "none", // Remove underline
    color: "black", // Set text color to black // Prevent reduction in card width caused by the link
  };

  const createPathname = (name) => {
    return name.replace(/\s+/g, "-"); // Replace spaces with dashes
  };

  useEffect(() => {
    const fetchAdditionalStaff = async () => {
      try {
        const response = await axios.get(
          "http://api.bike-csecu.com/api/staff/department/EEE"
        );
        const staffData = response.data.data.map((staff) => ({
          name: {
            bengali: `${staff.first_name_bn} ${staff.last_name_bn}`,
            english: `${staff.first_name} ${staff.last_name}`,
          },
          image: noimage, //staff.profile_image_id, // Assuming this ID can be used to get the image URL
          designation: staff.role,
          ...staff, // Add other fields if needed
        }));
        setAdditionalStaff(staffData);
      } catch (error) {
        console.error("Error fetching additional staff:", error);
      }
    };

    fetchAdditionalStaff();
  }, []);

  const allStaffData = [...EEEstaffData, ...additionalStaff];

  return (
    <div className="card-container">
      <div className="staffcard-container">
        {allStaffData.map((staff, index) => (
          <Link
            key={index}
            to={{
              pathname: `/department/eee/${createPathname(staff.name.bengali)}`,
              state: { staff },
            }}
            style={linkStyle}
          >
            <Staff staff={staff} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EEE;
