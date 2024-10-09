import { useEffect, useState } from 'react';
import './headdashboard.css';
import { FaFileAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const HeadDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    totalStaff: 0,
    pendingRequests: 0,
    inProgressRequests: 0, 
    completedRequests: 0,
    rejectedRequests: 0,
  });

  useEffect(() => {
    fetch("http://localhost:8080/services/getEmployeeCounts")
      .then((response) => response.json())
      .then((data) => {
        setStatistics((prevState) => ({
          ...prevState,
          totalEmployees: data.employee || 0,
          totalStaff: data.staff || 0,
        }));
      })
      .catch((error) => console.error("Error fetching employee counts:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/records/requestCounts")
      .then((response) => response.json())
      .then((data) => {
        setStatistics((prevState) => ({
          ...prevState,
          pendingRequests: data.pendingRequests || 0,
          inProgressRequests: data.inProgressRequests || 0,
          completedRequests: data.completedRequests || 0,
          rejectedRequests: data.rejectedRequests || 0,
        }));
      })
      .catch((error) => console.error("Error fetching request counts:", error));
  }, []);
  
  return (
    <div className="dashboard-container">
      <div className="box-container">
        <div className="box">
          <div className="content-box">
            <FaUser className="icon" />
            <p className="box-text">Employees</p>
          </div>
          <div className="extra-box">
          <p className='count'>{statistics.totalEmployees}</p>
          </div>
        </div>
        <div className="box">
          <div className="content-box">
            <FaFileAlt style={{color: '#818c99'}} className="icon" />
            <p className="box-text">Requested Files</p>
          </div>
          <div className="extra-box">
          <p className='count'>{statistics.completedRequests + statistics.inProgressRequests + statistics.pendingRequests + statistics.rejectedRequests}</p>
          </div>
        </div>
        <div className="box">
          <div className="content-box">
            <FaUser style={{color: '#5b4cdd'}} className="icon" />
            <p className="box-text">Staff</p>
          </div>
          <div className="extra-box">
          <p className='count'>{statistics.totalStaff}</p>
          </div>
        </div>
      </div>
      <div className="box-container">
        <div className="box">
          <div className="content-box">
            <FaCheckCircle style={{color: '#4a90e2'}} className="icon" />
            <p className="box-text">In Progress(Pending)</p>
          </div>
          <div className="extra-box">
          <p className='count'>{statistics.inProgressRequests + statistics.pendingRequests}</p>
          </div>
        </div>
        <div className="box">
          <div className="content-box">
            <FaCheckCircle style={{color: '#08af5c'}} className="icon" />
            <p className="box-text">Approved Requests</p>
          </div>
          <div className="extra-box">
          <p className='count'>{statistics.completedRequests}</p>
          </div>
        </div>
        <div className="box">
          <div className="content-box">
            <FaCheckCircle style={{color: '#681016'}} className="icon" />
            <p className="box-text">Rejected Requests</p>
          </div>
          <div className="extra-box">
            <p className='count'>{statistics.rejectedRequests}</p>
          </div>
        </div>
      </div>
      <h3 className="calendar-header">REQUESTED DATES</h3>

      <div className="calendar-container">
        <Calendar onChange={setDate} value={date} />
      </div>
    </div>
  );
};

export default HeadDashboard;
