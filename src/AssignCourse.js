import React, { useState, useEffect } from "react";
import "./css/AssignTask.css";
import "./css/card.css";
import axios from "axios";

// const token = process.env.REACT_APP_SESSION_TOKEN;
const token = localStorage.getItem('authToken');
// const apiUrl = process.env.REACT_APP_API_URL;
const Modal = ({ message, onClose }) => {
  return (
    <div className="modal2">
      <div className="modal-content2">
        <span className="close2" onClick={onClose}>
          &times;
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
};

const StaffDropdown = () => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [teacher, setTeacher] = useState("");
  const [message, setMessage] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [department, setDepartment] = useState("EEE");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/staff/teacher/${department}`
        );
        setStaffList(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffData();
  }, [department]);

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleTeacherChange = (event) => {
    setSelectedStaff(event.target.value);
    setTeacher(event.target.value);
  };
  const handleCourseChange = (event) => {
    setCourseCode(event.target.value);
  };

  const handleAssign = async () => {
    if (!selectedStaff || !department || !teacher) {
      setMessage("All fields are required.");
      return;
    }

    const newAssignedCourse = {
      Teacher_name: selectedStaff,
      Department_name: department,
      Course_code: courseCode,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/assigncourse/add`,
        newAssignedCourse,
        config
      );
      // console.log(response.data);
      if (response.data) {
        setMessage(
          `Course added successfully and course code is ${courseCode}.`
        );
        setSelectedStaff("");
        setCourseCode("");
        setDepartment("");
        setShowModal(true); // Set showModal to true on successful task assignment
      } else {
        setMessage("Failed to add course. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      setMessage("Failed to assign task. Please try again.");
    }
  };

  const closeModal = () => {
    setShowModal(false); // Function to close the modal
  };

  return (
    <div className="card-container">
      <div className="main-container">
        <div className="staff-dropdown-container">
          <div className="assign-task-content">
            <h2>Assign Course</h2>
            {message && <p>{message}</p>}
            <div className="form-group">
              <label className="label" htmlFor="department">
                Select Department:
              </label>
              <select
                id="department"
                value={department}
                onChange={handleDepartmentChange}
                className="select-box white-background"
              >
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label" htmlFor="staff">
                Select Teacher:
              </label>
              <select
                id="staff"
                value={selectedStaff}
                onChange={handleTeacherChange}
                className="select-box white-background"
              >
                <option value="">Choose faculty member</option>
                {staffList
                  .filter(
                    (staff) =>
                      staff.role === "professor" ||
                      staff.role === "associate_professor" ||
                      staff.role === "lecturer"
                  )
                  .map((staff) => (
                    <option key={staff.user_id} value={staff.user_id}>
                      {staff.first_name} {staff.last_name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="task_title">
                Course Name:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter title for task"
                id="task_title"
                value={courseCode}
                onChange={handleCourseChange}
              />
            </div>
            <button onClick={handleAssign} className="assign-button">
              Assign
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal message="Task added successfully." onClose={closeModal} />
      )}
    </div>
  );
};

export default StaffDropdown;
