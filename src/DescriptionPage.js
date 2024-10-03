import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import axios from 'axios';
import "./css/description.css";
import { WorklistContext } from './WorklistContext';

// const token = process.env.REACT_APP_SESSION_TOKEN;
const token = localStorage.getItem('authToken');

const DescriptionPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();
  const work = location.state?.work;
  const { handleStatusUpdate } = useContext(WorklistContext);
  const [task, setTask] = useState(work || null);

  useEffect(() => {
    if (!work) {
      fetchTaskDetails(id);
    }
  }, [id, work]);

  const fetchTaskDetails = async (taskId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      };
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/task/${taskId}`, config);
      console.log(response.data);
      setTask(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      };
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/task/update/${taskId}`, { task_status: newStatus }, config);
      console.log(response.data);

      // Update local state
      setTask(prevTask => ({
        ...prevTask,
        task_status: newStatus
      }));

      // Update context state
      handleStatusUpdate(taskId, newStatus);

      // Redirect or navigate after update
      history.push('/');
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card-container">
      <div>
        <div>
          <h4>{task.task_title}</h4>
          <p>{task.task_description}</p>
          <button className="btn btn-secondary"> <a href={`http://localhost:5000/upload/${task.task_attachment}`}>{task.task_title}</a></button>
         
          <p>Have you completed your task?</p>
          <button className="yes-no-buttons" onClick={() => handleStatusChange(task.task_id, 1)}>Yes</button>
          <button className="yes-no-buttons" onClick={() => handleStatusChange(task.task_id, 0)}>No</button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionPage;
