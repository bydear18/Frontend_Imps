import './registerbody.css';
import React, { useState } from 'react';
import { FaLock, FaUser } from 'react-icons/fa';
import { HiIdentification } from "react-icons/hi2";
import { HiAtSymbol } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { BiSolidBuildingHouse } from "react-icons/bi";

const RegisterBody = () => {
    const [alert, setAlert] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [adminVerified, setAdminVerified] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [schoolId, setSchoolId] = useState('');
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');
    const navigate = useNavigate();

    const infoPop = (message, isSuccess = false) => {
        setAlert('show');
        setAlertMsg(message);
        setSuccess(isSuccess);
    };

    const closeInfoPop = () => {
        setAlert('hide');
        if (success) {
            navigate('/'); 
        }
    };

    const handleRegister = () => {
        const requestOptionsGET = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const requestOptionsPOST = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const isValidSchoolId = /^\d{2}-\d{4}-\d{3}$/;
        const isValidEmail = /^[a-zA-Z0-9._%+-]+@cit\.edu$/;

        // Input validations
        if (!firstName || !lastName || !email || !password || !confirmPass || !schoolId || !role) {
            infoPop('All fields are required.');
            return;
        }
        if (role === 'employee' && !department) {
            infoPop('Department/Office is required for employees.');
            return;
        }
        
        if (!schoolId.match(isValidSchoolId)) {
            infoPop('Invalid School ID format! Please use the format xx-xxxx-xxx.');
            return;
        }

        if (!email.match(isValidEmail)) {
            infoPop('Please use a valid cit.edu email address to register.');
            return;
        }

        if (confirmPass !== password) {
            infoPop('Make sure your passwords match! Try again.');
            return;
        }

        // Check for existing email
        fetch(`http://localhost:8080/services/exists?email=${email}`, requestOptionsGET)
            .then((response) => response.json())
            .then((data) => {
                if (data === true) {
                    infoPop('That email is already in use! Please use another email.');
                } else {
                    // Check for existing school ID
                    fetch(`http://localhost:8080/services/exists?schoolId=${schoolId}`, requestOptionsGET)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data === true) {
                                infoPop('That School ID is already in use! Please use another School ID.');
                            } else {
                                // Proceed with registration
                                fetch(`http://localhost:8080/services/NewUserRegistration?firstName=${firstName}&lastName=${lastName}&password=${password}&email=${email}&schoolId=${schoolId}&role=${role}&department=${department}&adminVerified=${adminVerified}`, requestOptionsPOST)
                                    .then((response) => response.json())
                                    .then(() => {
                                        infoPop("Registration successful! Wait for admin's confirmation", true);
                                        // Clear form fields
                                        setFirstName('');
                                        setLastName('');
                                        setPassword('');
                                        setEmail('');
                                        setConfirmPass('');
                                        setSchoolId('');
                                        setRole('');
                                        setDepartment('');
                                        console.log(adminVerified)
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        infoPop('An error occurred during registration. Please try again.');
                                    });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div className="main section">
            <div id="infoPopOverlay" className={alert}></div>
            <div id="infoPop" className={alert}>
                <p>{alertMsg}</p>
                <button id="infoChangeBtn" onClick={closeInfoPop}>Close</button>
            </div>

            <div className="title"></div>
            <div id="regLogCon">
                <h2>Registration</h2>
                <form id="loginForm">
                    <label>
                        <FaUser />
                        <input
                            className="regShad"
                            required
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                        />
                    </label>
                    <label>
                        <input
                            className="regInput regShad"
                            required
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                        />
                    </label>
                    <hr className="regLine" />
                    <label>
                        <HiAtSymbol id="emailSym" />
                        <input
                            className="regShad"
                            id="emailIn"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </label>
                    <hr className="regLine" />
                    <label>
                        <FaLock />
                        <input
                            className="regShad"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </label>
                    <label>
                        <FaLock />
                        <input
                            className="regShad"
                            type="password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            placeholder="Confirm Password"
                        />
                    </label>
                    <hr className="regLine" />
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <label>
                          <HiIdentification />
                            <input
                                className="regShad"
                                type="text"
                                value={schoolId}
                                onChange={(e) => setSchoolId(e.target.value)}
                                placeholder="School ID (xx-xxxx-xxx)"
                            />
                        </label>
                    </div>
                    <label style={{ marginBottom: '25px' }}>
                        <select
                            className="regShad"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="staff">Staff</option>
                            <option value="employee">Employee</option>
                        </select>
                    </label>
                    <label>
                    <BiSolidBuildingHouse />
                        <input
                            className="regShad"
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="Department/Office"
                            required={role === 'employee'}
                            disabled={role === 'staff'} 
                        />
                    </label>

                    <div className="buttons">
                        <button className="login-btn" type="button" onClick={handleRegister}>
                            Register
                        </button>
                    </div>

                    <div className="aregistered">
                        <p id="regQues">ALREADY REGISTERED? </p>
                    </div>
                    <a id="signIn" href="/"> Sign In</a>
                </form>
            </div>
            <div className="cit-bglogo"></div>
        </div>
    );
};

export default RegisterBody;
