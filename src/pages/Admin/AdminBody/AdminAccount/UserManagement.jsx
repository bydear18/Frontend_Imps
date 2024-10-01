import './AdminAccount.css';
import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [values, setValues] = useState([]);
  const [alert, setAlert] = useState('hide');
  const [alertMsg, setAlertMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const renderHeader = () => {
    return (
      <div id="userHeader" className="flex">
        <h1>User Management Registration</h1>
      </div>
    );
  };

  const header = renderHeader();

  const handleLogOut = () => {
    localStorage.setItem('firstName', '');
    localStorage.setItem('lastName', '');
    localStorage.setItem('email', '');
    localStorage.setItem('userID', '');
    localStorage.setItem('isLoggedIn', '');
    navigate('/');
  };

  const showInfoPop = (message, isSuccess = false) => {
    setAlert('show');
    setAlertMsg(message);
    setSuccess(isSuccess);
  };

  const closeInfoPop = () => {
    setAlert('hide');
    if (success) {
      navigate('/admin'); // Redirect or perform another action
    }
  };

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch('http://localhost:8080/services/all', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // Filter users based on role
        const filteredUsers = data.filter(
          (user) => user.role === 'employee' || user.role === 'staff'
        );
        setValues(filteredUsers);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAccept = (userEmail) => {
    console.log(userEmail);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    };

    fetch('http://localhost:8080/services/updateAdminVerified', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          console.log('User accepted:', userEmail);
          setValues((prevValues) => prevValues.filter(user => user.email !== userEmail));
          showInfoPop(`User registration accepted!`, true);
        } else {
          console.error('Error accepting user:', data.message);
          showInfoPop(`Error accepting user: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        showInfoPop('An error occurred while accepting the user.');
      });
  };

  const handleDecline = (userEmail) => {
    console.log(userEmail);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    };

    fetch('http://localhost:8080/services/declineUser', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          console.log('User declined:', userEmail);
          setValues((prevValues) => prevValues.filter(user => user.email !== userEmail));
          showInfoPop(`User registration declined!`, true);
        } else {
          console.error('Error declining user:', data.message);
          showInfoPop(`Error declining user: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        showInfoPop('An error occurred while declining the user.');
      });
  };

  const roleBodyTemplate = (rowData) => {
    return (
      <div>
        <button onClick={() => handleAccept(rowData.email)} className='accept-button'>
          Accept
        </button>
        <button onClick={() => handleDecline(rowData.email)} className='decline-button'>
          Decline
        </button>
      </div>
    );
  };

  return (
    <div>
        <div id="infoPopOverlay" className={alert}></div>
        <div id="infoPop" className={alert}>
            <p>{alertMsg}</p>
            <button id="infoChangeBtn" onClick={closeInfoPop}>Close</button>
        </div>
        <div id="usersTable">
            <DataTable
                value={values.filter(user => user.adminVerified === false)} // Filter the data here
                scrollable
                scrollHeight="28vw"
                header={header}
                emptyMessage="No data found."
                tableStyle={{ minWidth: '20vw' }}
                selectionMode="single"
            >
                <Column field="schoolId" header="School ID"></Column>
                <Column field="firstName" header="First Name"></Column>
                <Column field="lastName" header="Last Name"></Column>
                <Column field="email" header="Email"></Column>
                <Column field="role" header="Role"></Column>
                <Column field="Action" header="Action" body={roleBodyTemplate}></Column>
            </DataTable>
        </div>
        <button id="logOut" onClick={handleLogOut}>Log Out</button>
    </div>
);

};

export default UserManagement;
