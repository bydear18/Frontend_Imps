import { useEffect, useState } from 'react';
import './Dashboard.css';
import { FaFileAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const COLORS = ['#149b48', '#17A8F5', '#681016'];
  const [dateRequests, setDateRequests] = useState([]);
  const [date, setDate] = useState(new Date());
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    totalStaff: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
  });
  const [userChartData, setUserChartData] = useState([]);
  const [fileChartData, setFileChartData] = useState([]);
  const [firstName, setFirstName] = useState(localStorage.getItem("firstName"));

  useEffect(() => {
    fetch("http://localhost:8080/services/getEmployeeCounts")
      .then((response) => response.json())
      .then((data) => {
        setStatistics((prevState) => ({
          ...prevState,
          totalEmployees: data.employee || 0,
          totalStaff: data.staff || 0,
        }));
        updateUserChartData(data.employee || 0, data.staff || 0);
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
        updateFileChartData(data.completedRequests || 0, data.rejectedRequests || 0, data.pendingRequests || 0, data.inProgressRequests || 0);
      })
      .catch((error) => console.error("Error fetching request counts:", error));
  }, []);

  const updateUserChartData = (employeeCount, staffCount, requestData = {}) => {
    const formattedData = [
      {
        label: 'Employees and Staff',
        employee: employeeCount,
        staff: staffCount,
      },
    ];

    setUserChartData(formattedData);
  };

  const updateFileChartData = (completedRequests, rejectedRequests, pendingRequests, inProgressRequests, requestData = {}) => {
    const formattedData = [
      {
        label: 'Accepted, In Progress, Rejected',
        Accepted: completedRequests,
        'In Progress(Pending)': pendingRequests + inProgressRequests,
        Rejected: rejectedRequests,
      },
    ];

    setFileChartData(formattedData);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);

    // Log the new date
    console.log("Selected Date:", newDate);

    // Format the date correctly
    const localDate = new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000));
    const formattedDate = localDate.toISOString().split('T')[0];
    console.log("Formatted Date:", formattedDate); // Log the formatted date

    fetch(`http://localhost:8080/records/requests/${formattedDate}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setDateRequests(data);
            console.log("Fetched Data:", data);
        })
        .catch((error) => console.error("Error fetching requests for selected date:", error));
};

  return (
    <div style={{ backgroundColor: '#fff', height: '50vw' }}>
      <div className="dashboard-container">
        <div className="box-container">
 
          <div className="box">
            <div className="content-box">
              <FaUser className="icon" />
              <p className="box-text">User</p>
            </div>
            <div className="extra-box">
              <p className="count">{statistics.totalEmployees + statistics.totalStaff}</p>
            </div>
          </div>
          <div className="box">
            <div className="content-box">
              <FaFileAlt style={{ color: '#818c99' }} className="icon" />
              <p className="box-text">Requested Files</p>
            </div>
            <div className="extra-box">
              <p className="count">
                {statistics.completedRequests + statistics.inProgressRequests + statistics.pendingRequests + statistics.rejectedRequests}
              </p>
            </div>
          </div>
          <div className="box">
            <div className="content-box">
              <FaUser style={{ color: '#5b4cdd' }} className="icon" />
              <p className="box-text">Staff</p>
            </div>
            <div className="extra-box">
              <p className="count">{statistics.totalStaff}</p>
            </div>
          </div>
        </div>

        <div className="box-container">
          {/* Request status boxes */}
          <div className="box">
            <div className="content-box">
              <FaCheckCircle style={{ color: '#4a90e2' }} className="icon" />
              <p className="box-text">In Progress</p>
            </div>
            <div className="extra-box">
              <p className="count">
                {statistics.inProgressRequests + statistics.pendingRequests}
              </p>
            </div>
          </div>
          <div className="box">
            <div className="content-box">
              <FaCheckCircle style={{ color: '#08af5c' }} className="icon" />
              <p className="box-text">Approved Requests</p>
            </div>
            <div className="extra-box">
              <p className="count">{statistics.completedRequests}</p>
            </div>
          </div>
          <div className="box">
            <div className="content-box">
              <FaCheckCircle style={{ color: '#681016' }} className="icon" />
              <p className="box-text">Rejected Requests</p>
            </div>
            <div className="extra-box">
              <p className="count">{statistics.rejectedRequests}</p>
            </div>
          </div>
        </div>

        <div className="calendar-container">
          <h3 className="calendar-header">Date Info</h3>
          <Calendar onChange={handleDateChange} value={date} />

          <div className="selected-date-box" style={{ marginTop: '2vw', width: '100%', fontSize: '.8em', textAlign: 'center'}}>
            {dateRequests.length > 0 ? (
              <table style={{marginLeft: '3vw'}}>
                <thead>
                  <tr>
                    <th  style={{paddingRight: '1.5vw'}}>Request ID</th>
                    <th style={{paddingRight: '1.5vw'}}>User ID</th>
                    <th style={{paddingRight: '1.5vw'}}>Status</th>
                    <th style={{paddingRight: '1.5vw'}}>Date Needed</th>
                  </tr>
                </thead>
                <tbody >
                  {dateRequests.map((request, index) => (
                    <tr key={index} >
                      <td style={{paddingRight: '1vw'}}>{request.requestID}</td>
                      <td style={{paddingRight: '1vw'}}>{request.userID}</td>
                      <td style={{paddingRight: '1vw'}}>{request.status}</td>
                      <td style={{paddingRight: '1vw'}}>{request.useDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{fontSize: '1.5em', padding: '4vw', textAlign: 'center'}}>No data for this date.</p>
            )}
          </div>
        </div>
        
      </div>

        <div className="section-content" style={{marginTop: '-20vw'}}>
            <ResponsiveContainer width="45%" height={200}>
              <BarChart data={fileChartData} margin={{ top: 5, right: 0, bottom: 15, left: 0 }}>
                <Tooltip />
                <XAxis dataKey="label" />
                <YAxis />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Legend />
                <Bar type="monotone" dataKey="Accepted" fill="#149b48" />
                <Bar type="monotone" dataKey="In Progress(Pending)" fill="#17A8F5" />
                <Bar type="monotone" dataKey="Rejected" fill="#681016" />
              </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default Dashboard;
