import './Navbar.css';
import { useEffect, useState } from 'react';
import { HiBell } from 'react-icons/hi2';
import Popup from 'reactjs-popup';

const Navbar = () => {
    const [values, setValues] = useState([]);
    const [notifShow, setNotifShow] = useState('hide');

    useEffect(() => {
        const userID = localStorage.getItem("userID");
        const email = localStorage.getItem("email");
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (isLoggedIn) {
            fetch(`http://localhost:8080/services/checkAdmin?email=${email}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    setNotifShow('show')
                    fetch(`http://localhost:8080/notifications/id?id=${userID}`, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            setValues(data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setNotifShow('hide');
        }
    }, []);

    return (
        <div className='navBar flex'>
            <div className="navBarOne flex">
                <div className='citlogo'></div>
                <Popup trigger={
                    <button id='notifbutt' className={notifShow}> 
                        <HiBell id='notifIcon'/> 
                    </button>
                } position="left top">
                    <div id='panel' scrollable = "true">
                        <div id='notifHead'>NOTIFICATIONS</div>
                        {values.map((notif, idx) => (
                            <div key={idx}>
                                <hr />
                                <h1 id='notID'>{notif.requestID}</h1>
                                <p className='notContent notifMain'>{notif.header}</p>
                                <p className='notContent notifDate'>{notif.content}</p>
                                <p>{notif.createdDate}</p>
                            </div>
                        ))}
                    </div>
                </Popup>
            </div>
        </div>
    );
};

export default Navbar;
