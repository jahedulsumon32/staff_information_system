import React,{useState,useEffect} from "react";
// import Card from "./Card";
import "../css/card.css";
import axios from 'axios';
import "../css/noticeboard.css";
// const noticesArray = [
//   {
//     id: 1,
//     type: "General",
//     title: "Meeting Scheduled",
//     uploadedDate: "2023-07-14T09:30:00",
//     fileUrl: "#",
//   },
//   {
//     id: 2,
//     type: "General",
//     title: "New Policy",
//     uploadedDate: "2023-07-12T17:00:00",
//     fileUrl: "#",
//   },
//   {
//     id: 3,
//     type: "General",
//     title: "Annual Leave",
//     uploadedDate: "2023-06-29T10:45:00",
//     fileUrl: "https://www.ripublication.com/ijaer17/ijaerv12n5_12.pdf",
//   },
//   {
//     id: 4,
//     type: "Important",
//     title: "End of Quarter Reporting",
//     uploadedDate: "2023-07-05T15:30:00",
//     fileUrl: "#",
//   },
//   {
//     id: 5,
//     type: "Important",
//     title: "System Maintenance",
//     uploadedDate: "2023-07-02T09:00:00",
//     fileUrl: "#",
//   },
//   {
//     id: 6,
//     type: "Academic",
//     title: "System Maintenance",
//     uploadedDate: "2023-07-02T09:00:00",
//     fileUrl: "#",
//   },
//   {
//     id: 7,
//     type: "Examination",
//     title: "System Maintenance",
//     uploadedDate: "2023-07-02T09:00:00",
//     fileUrl: "#",
//   },
//   {
//     id: 8,
//     type: "General",
//     title: "Our University wants some papers from students",
//     uploadedDate: "2023-07-02T09:00:00",
//     fileUrl: "#",
//   },
//   {
//     id: 9,
//     type: "Others",
//     title: "System Maintenance",
//     uploadedDate: "2023-07-02T09:00:00",
//     fileUrl: "#",
//   },
// ];
// const token=process.env.REACT_APP_SESSION_TOKEN;
const token = localStorage.getItem('authToken');

console.log(token)
const NoticeBoard = () => {
  // const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  // useEffect(() => {
  //   const token = localStorage.getItem('authToken');
  //   if (token) {
  //     setAuthToken(token);
  //   }
  // }, []);

  const [noticeData, setNoticeData] = useState({
    notice_title: "",
    notice_type: "",
    notice_description:"",
    notice_attachment: "",
  });

  const [notices,setNotices]=useState([])
  // const [filteredNotices, setFilteredNotices] = useState([]);
  const [filterData, setFilterData] = useState({
    typeFilter: '',
    titleFilter: ''
  });
  // const [totalRecords, setTotalRecords] = useState(0);
  // const [pageCount, setPageCount] = useState(0);
  const [firstPage, setFirstPage] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
  };
  const openModal = () => {
    setShowModal(true);
  };
  const onChange = (e) => {
    e.preventDefault();
    if (e.target.name === "notice_attachment") {
      // Handle file separately
      setNoticeData({ ...noticeData, [e.target.name]: e.target.files[0] });
    } else {
      setNoticeData({ ...noticeData, [e.target.name]: e.target.value });
    }
    // console.log(e.target.value)
  };

  const onFilterDataChange = (e) => {
    const { id, value } = e.target;
    setFilterData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFilter = async() => {
    const { typeFilter, titleFilter } = filterData;

    try{
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/sims/notice/search?q=${typeFilter}&q1=${titleFilter}`);
        // console.log(response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setNotices(response.data.data);
          setFirstPage(response.data.first_page);
          setNextPage(response.data.next);
          setPrevPage(response.data.previous);
        }

    }catch(error){
      console.log(error.message);
    }   
  };
  useEffect(() => {
    if (!showModal) {
      // If the modal is not visible, reset the form data
      setNoticeData({
        notice_title: '',
        notice_type: 'Event',
        notice_description: '',
        notice_attachment: null,
      });
    }
  }, [showModal]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let noticeAttachmentUrl="";
      if(noticeData.notice_attachment){
        const formData=new FormData();
        formData.append("items",noticeData.notice_attachment);

        const uploadConfig={
          headers:{
            "Content-Type": "multipart/form-data",
            "Authorization":`Bearer ${token}`,
          }
        }
        const uploadResponse=await axios.post(
          `${process.env.REACT_APP_API_URL}/upload`,formData,uploadConfig
        );
        if(uploadResponse.status===201){
          const data=uploadResponse.data;
          if(data.files && data.files.length >0){
            noticeAttachmentUrl=`${data.files[0].filename}`;
          }
          else{
            alert("failed to upload the file")
          }
        }
      }
      const noticePayload = {
        ...noticeData,
        notice_attachment: noticeAttachmentUrl,
      };
      const config = {
        headers: {
          
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      };
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/notice/`, noticePayload, config);
      if (response.status === 200) {
        const data = await response.data;
        if (data.success) {
          setNotices((prevNotices) => [...prevNotices, noticeData]);
          handleClose();
        } else {
          alert(data.message);
          handleClose();
        }
      } else {
        console.error(`Error occurred: ${response.status}`);
        handleClose();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Request failed with status code 400");
      } else {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    fetchNotices(firstPage);
  }, []);

  const fetchNotices = async (pageNumber) => {
    // console.log({pageNumber:pageNumber})
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/notice?page=${pageNumber.page}`);
      // console.log(response.data);
      if (response.data && Array.isArray(response.data.data)) {
        setNotices(response.data.data);
        // setTotalRecords(response.data.total_records);
        // setPageCount(response.data.page_count);
        setFirstPage(response.data.first_page);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
        // console.log(notices);
        // console.log(firstPage);
        // console.log(nextPage);
        // console.log(prevPage);
        // console.log(totalRecords);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]); // Set notices to an empty array on error
    }
  };
  return (
    <div className="row card-container">
      <div className="col-8">
        <div className="add-notice-btn">
          <div className="add-icon">
           
               <button className="btn btn-success" onClick={()=>openModal()}  data-bs-toggle="modal"
          data-bs-target="#noticeModal">
               <i className="fas fa-plus success" tooltip="Add New Notice"></i></button>  
              Add New Notice
          </div>
        </div>

        <div className="col-12 notice-board-content my-5">
          <h3> All Notices</h3>
          <div className="notice-list">
          <table className="table table-striped">
  <thead>
    <tr>
      <th>SL</th>
      <th>Type</th>
      <th>Title</th>
      <th>Description</th>
      <th>Uploaded Date</th>
      <th>View File</th>
    </tr>
  </thead>
  <tbody>
    {notices &&
      notices.map((notice, index) => (
        <tr key={notice.notice_id}>
          <td>{index + 1}</td>
          <td>{notice.notice_type}</td>
          <td>{notice.notice_title}</td>
          <td>{notice.notice_description}</td>
          <td>{new Date(notice.notice_uploaded_time).toLocaleString()}</td>
          <td>
            <a href={`http://localhost:5000/upload/${notice.notice_attachment}`}>
              <i className="fas fa-file"></i>
            </a>
          </td>
        </tr>
      ))}
  </tbody>
</table>

          </div>
          </div>
                <div className="pagination d-flex justify-content-center align-items-center my-5">
        <button className="btn btn-primary mx-3" onClick={() => fetchNotices(prevPage)} disabled={!prevPage}>
          Previous
        </button>
        <button className="btn btn-primary mx-3" onClick={() => fetchNotices(nextPage)} disabled={!nextPage}>
          Next
        </button>
      </div>

        </div>
    
      <div className="col-4">
        <div className="filter-container">
          <h4>Filter Notices</h4>
          <div className="form-group my-3">
            <label htmlFor="typeFilter">Type:</label>
            <select id="typeFilter" className="form-select" onChange={onFilterDataChange} value={filterData.typeFilter}>
              <option value="">All</option>
              {Array.from(new Set(notices.map((notice) => notice.notice_type))).map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="form-group my-3">
            <label htmlFor="titleFilter">Title:</label>
            <input type="text" id="titleFilter" className="form-control" onChange={onFilterDataChange} value={filterData.titleFilter}/>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleFilter}>
             Filter
            </button>
        </div>
      </div>
   { <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        id="noticeModal"
        tabIndex="-1"
        aria-labelledby="noticeModalLabel"
        aria-hidden={!showModal}
        // style={{ display:showModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between">
              <h5 className="modal-title" id="noticeModalLabel">
                Add New Notice
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form >
                <div className="title_input  align-items-center my-2">
               
                  <label htmlFor="title" id="title_level" className="input-level mx-2">Title :</label>
                  <input className="title_input mx-2" type="text" id="title" name="notice_title" value={noticeData.notice_title} onChange={onChange}  required /> 
                  <br />
                </div>
                <div className="dropdown-container  align-items-center my-2">
                  <label htmlFor="category" className="input-level mx-2">Type : </label>
                  <select
                    className="form-select mx-2 my-2"
                    id="dropdownMenuButton"
                    name="notice_type"
                    aria-label="contained"
                    onChange={onChange}
                    value={noticeData.notice_type}
                  >
                    <option value="Event">Event</option>
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Registrar">Registrar</option>
                    <option value="Special">Special</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="description_input">
                  <label htmlFor="description" className="input-level mx-3 my-2">Description :</label>
                  <textarea id="description" name="notice_description"  value={noticeData.notice_description} onChange={onChange}></textarea>
                  <br />
                </div>
                <div className="file-upload-container">
                  <label htmlFor="file" className="input-level mx-3 my-2 ">Add File :</label>
                  <input className="file-input mx-2" type="file" id="file" name="notice_attachment" accept="*/*"  onChange={onChange}/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary "
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                form="noticeModal"
                className="btn btn-success"
                onClick={handleSubmit}
              >
                Add Notice
              </button>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default NoticeBoard;
