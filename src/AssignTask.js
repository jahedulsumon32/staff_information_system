import React, { useState, useEffect } from "react";
import "./css/AssignTask.css";
import "./css/card.css";
import axios from "axios";

// const token = process.env.REACT_APP_SESSION_TOKEN;
// const apiUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('authToken');
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
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAttachment, setTaskAttachment] = useState("");
  const [message, setMessage] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [department, setDepartment] = useState("EEE");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/staff/department/${department}`
        );
        setStaffList(response.data.data);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffData();
  }, [department]);

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleStaffChange = (event) => {
    setSelectedStaff(event.target.value);
  };

  const handleDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTaskTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    console.log({file});
    setTaskAttachment(file);
  };
  
  const handleAssign = async (e) => {
    e.preventDefault();
  
    if (!selectedStaff || !taskDescription || !dueDate || !taskTitle ) {
      setMessage("All fields are required.");
      return;
    }
  
    const newTask = {
      assign_to: selectedStaff,
      //assign_date: new Date().toISOString(),
      due_date: dueDate,
      task_title: taskTitle,
      task_description: taskDescription,
      task_attachment:taskAttachment,
      task_status: 0,
    };
  
    try {
      let task_attachmentUrl = "";
      // Upload the file first
      if(taskAttachment){
        const fileData = new FormData();
        fileData.append("items", taskAttachment);
        const uploadConfig = {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        };

        const uploadResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/upload`,
          fileData,
          uploadConfig
        );
    
        if (uploadResponse.status === 201) {
          const data = uploadResponse.data;
    
          // Assuming the uploaded file information is in `data.file`
          if(data.files && data.files.length >0){
            task_attachmentUrl = `${data.files[0].filename}`;
          } else {
            setMessage("Failed to upload the file.");
            return;
          }
      }
    }
     // Add the file URL or name to the newTask object
      const taskPayload = {
        ...newTask,
        task_attachment: task_attachmentUrl,
      };
  
      // Now post the new task with the file URL
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/task/add`,
        taskPayload,
        config
      );
  
      if (response.data) {
        setMessage("Task added successfully.");
        // Reset all input
        setSelectedStaff("");
        setTaskDescription("");
        setDueDate("");
        setTaskTitle("");
        setTaskAttachment(null); 
        setShowModal(true);
      } else {
        setMessage("Failed to add task. Please try again.");
      }
    }catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Request failed with status code 400");
      } else {
        console.error(error);
      }
    }
    //  catch (error) {
    //   console.error("Error assigning task:", error);
    //   setMessage("Failed to assign task. Please try again.");
    // }
  };
  

  const closeModal = () => {
    setShowModal(false); // Function to close the modal
  };

  return (
    <div className="card-container">
      <div className="main-container">
        <div className="staff-dropdown-container">
          <div className="assign-task-content">
            <h2>Assign Task</h2>
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
                Select Staff:
              </label>
              <select
                id="staff"
                value={selectedStaff}
                onChange={handleStaffChange}
                className="select-box white-background"
              >
                <option value="">Choose staff member</option>
                {staffList.map((staff) => (
                  <option key={staff.user_id} value={staff.user_id}>
                    {staff.first_name} {staff.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="label" htmlFor="task_title">
                Title:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter title for task"
                id="task_title"
                value={taskTitle}
                onChange={handleTitleChange}
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="dueDate">
                Due Date:
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={handleDueDateChange}
                className="input-box"
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="taskDescription">
                Task Description:
              </label>
              <textarea
                id="taskDescription"
                value={taskDescription}
                onChange={handleDescriptionChange}
                className="textarea-box"
              ></textarea>
            </div>
            <div className="form-group">
              <label className="label" htmlFor="taskAttachment">
                Task Attachment:
              </label>
              <input
                type="file"
                id="taskAttachment"
                onChange={handleFileChange}
                className="input-box"
                accept="*"
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
