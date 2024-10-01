import { useEffect, useState } from 'react';
import './headdashboard.css';

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    totalStaff: 0,
    pendingRequests: 0,
    inProgressRequests: 0, 
    completedRequests: 0,
    rejectedRequests: 0,
  });

  // Fetch employee counts
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
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card" style={{backgroundColor: '#a5a5a3'}}>
          <h2>Total Employees</h2>
          <p className="stat-number">{statistics.totalEmployees}</p>
        </div>
        <div className="stat-card" style={{backgroundColor: '#44a575'}}>
          <h2>Total Staff</h2>
          <p className="stat-number">{statistics.totalStaff}</p>
        </div>
      </div>

      <div className="stats-grid1">
        <div className="stat-card" style={{backgroundColor: '#2d68c0'}}>
          <h2>Pending Requests</h2>
          <p className="stat-number">{statistics.pendingRequests}</p>
        </div>
        <div className="stat-card" style={{backgroundColor: 'rgb(145, 87, 49)'}}>
          <h2>In Progress Requests</h2>
          <p className="stat-number">{statistics.inProgressRequests}</p>
        </div>
        <div className="stat-card" style={{backgroundColor: 'rgb(23, 153, 40)'}}>
          <h2>Completed Requests</h2>
          <p className="stat-number">{statistics.completedRequests}</p>
        </div>
        <div className="stat-card" style={{backgroundColor: 'rgb(134, 14, 14)'}}>
          <h2>Rejected Requests</h2>
          <p className="stat-number">{statistics.rejectedRequests}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
