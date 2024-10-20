import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import React, { useEffect, useState } from 'react';
import './pending.css';

const Pending = () => {
    const [show, setShow] = useState('hide');
    const [buttonShow, setButtonShow] = useState('hide');
    const [commentShow, setCommentShow] = useState('hide');
    const [rejectDisable, setRejectDisable] = useState(false);
    const [statusClass, setStatusClass] = useState('reqStatRejected');
    const [values, setValues] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    // Details
    const [requestID, setRequestID] = useState();
    const [bindType, setBindType] = useState('');
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    const [desc, setDesc] = useState('');
    const [fileName, setFileName] = useState('');
    const [giveExam, setGiveExam] = useState(false);
    const [noOfCopies, setNoOfCopies] = useState(0);
    const [toStaple, setToStaple] = useState(false);
    const [colored, setColored] = useState(false);
    const [useDate, setUseDate] = useState('');
    const [requestDate, setRequestDate] = useState('');
    const [paperSize, setPaperSize] = useState('');
    const [fileType, setFileType] = useState('');
    const [status, setStatus] = useState('');
    const [userID, setUserID] = useState('');
    const [comments, setComments] = useState([]);
    const [requesterName, setRequesterName] = useState('');
    const [requesterEmail, setRequesterEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [downloadURL, setDownloadURL] = useState('');

    // Comment Details
    const [commentHeader, setCommentHeader] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [commentDate, setCommentDate] = useState('');
    const [editable, setEditable] = useState(true);

    const getDate = () => {
        const today = new Date();
        return today.toISOString().substring(0, 10);
    };

    // Date Values
    const [currentDate] = useState(getDate());

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleAccept = () => {
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(
            "http://localhost:8080/records/acceptedStatus?requestID=" + requestID + "&status=In Progress&email=" + email + "&userID=" + userID + "&date=" + currentDate,
            requestOptions
        )
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleReject = () => {
        setCommentDate(currentDate);
        setCommentHeader("Reason for Rejection");
        setRejectDisable(false);
        setEditable(false);
        setCommentContent('');
        setButtonShow('show');
        setCommentShow('show');
    };

    const proceedReject = () => {
        setRejectDisable(true);
        const commentData = new FormData();
        commentData.append("sentBy", "Admin");
        commentData.append("header", commentHeader);
        commentData.append("content", commentContent);
        commentData.append("sentDate", commentDate);
        commentData.append("requestID", requestID);

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (commentContent != null && commentContent !== '') {
            const requestOptionsComment = {
                method: 'POST',
                mode: 'cors',
                body: commentData
            };
            fetch("http://localhost:8080/comments/newComment", requestOptionsComment)
                .then((response) => response.json())
                .then((data) => {
                    fetch("http://localhost:8080/records/rejectedStatus?requestID=" + requestID + "&status=Rejected&email=" + email + "&userID=" + userID + "&date=" + currentDate, requestOptions)
                        .then((response) => response.json())
                        .then((data) => {
                            setEditable(true);
                            setButtonShow('hide');
                            setCommentShow('hide');
                            setShow('hide');
                            window.location.reload();
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const renderHeader = () => {
        return (
            <div id="historyHeader" className="flex">
                <h1>Pending Requests</h1>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                </IconField>
            </div>
        );
    };

    const renderCommentHeader = () => {
        return (
            <div id="historyHeader" className="flex">
                <h1 id='commentHeader'>Comments</h1>
            </div>
        );
    };

    const header = renderHeader();
    const commentTableHeader = renderCommentHeader();

    const onCommentSelect = (event) => {
        setCommentDate(event.data.sentDate);
        setCommentHeader(event.data.header);
        setCommentContent(event.data.content);
        setCommentShow('show');
    };

    const onRowSelect = (event) => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch("http://localhost:8080/requests/id?id=" + event.data.requestID + "&fileName=" + event.data.fileName, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setFileName(data['fileName']);
                setFileType(data['fileType']);
                setDepartment(data['department']);
                setColored(data['color']);
                setToStaple(data['stapled']);
                setGiveExam(data['giveExam']);
                setDesc(data['description']);
                setRequestDate(data['requestDate']);
                setUseDate(data['useDate']);
                setRequestID(data['requestID']);
                setNoOfCopies(data['noOfCopies']);
                setBindType(data['bindType']);
                setPaperSize(data['paperSize']);
                setEmail(data['requesterEmail']);
                setUserID(data['userID']);
                setRequesterEmail(data['requesterEmail']);
                setRequesterName(data['requesterName']);
                setContactNumber(data['requesterNumber']);
                setDownloadURL(data['downloadURL']);
                fetch("http://localhost:8080/records/requestid?id=" + event.data.requestID, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        setStatus(data['status']);

                        if (data['status'] === 'Rejected') {
                            setStatusClass('capsuleRejected');
                        } else if (data['status'] === 'Pending') {
                            setStatusClass('capsulePending');
                        } else if (data['status'] === 'In Progress') {
                            setStatusClass('capsuleProgress');
                        } else if (data['status'] === 'Completed') {
                            setStatusClass('capsuleCompleted');
                        }
                        fetch("http://localhost:8080/comments/id?id=" + event.data.requestID, requestOptions)
                            .then((response) => response.json())
                            .then((data) => {
                                setComments(data);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
        setShow('show');
    };

    const getSeverity = (status) => {
        switch (status) {
            default:
                return 'info';

            case 'New':
                return 'info';

            case 'Pending':
                return 'warning';

            case '':
                return null;
        }
    };

    const closeComment = () => {
        setCommentDate('');
        setCommentHeader('');
        setCommentContent('');
        setCommentShow('hide');
    };

    const closeModal = () => {
        setShow('hide');
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch("http://localhost:8080/records/pending", requestOptions)
            .then((response) => response.json())
            .then((data) => { setValues(data); })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <div id="pendingTable">
                <DataTable value={values} scrollable scrollHeight="30vw" header={header} globalFilterFields={['userID', 'requestID', 'fileName', 'requestDate']}
                    filters={filters} emptyMessage="No records found."
                    paginator rows={8}
                    tableStyle={{ minWidth: '20vw' }} selectionMode="single" onRowSelect={onRowSelect}>
                    <Column field="userID" header="User ID"></Column>
                    <Column field="requestID" header="Request ID"></Column>
                    <Column field="fileType" header="File Type"></Column>
                    <Column field="fileName" header="File Name"></Column>
                    <Column field="requestDate" header="Request Date"></Column>
                    <Column field="useDate" header="Use Date"></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                </DataTable>
            </div>
            <div id="overlay" className={show} onClick={closeModal}></div>
            <div id="requestBox" className={show}>
                <div id='boxDeets'>

                    <div id='firstLine'>
                        <h1 id='requestID'>{requestID}</h1>
                        <div className={statusClass}>{status}</div>
                        <p id='typeOfFile'>• {fileType}</p>
                        <p className='dates'>Request Date: <p id='dateRequest'>{requestDate}</p></p>
                        <p className='dates'>Use Date: <p id='dateUse'>{useDate}</p></p>
                    </div>

                    <p id='requester'>Request from:<p id='userID'>{userID}</p></p>

                    <div id='fileDeets'>FILE DETAILS</div>

                    <div id='secondLine'>
                        <p>File Name:</p> <input id='nameOfFile' type='text' disabled='true' value={fileName} />
                    </div>

                    <textarea id='descriptionOfFile' disabled='true' value={desc}>{desc}</textarea>

                    <div id='thirdLine'>
                        <div id='hatagExam'>Give exam personally: </div>
                        <input id='examBox' type='checkbox' checked={giveExam} disabled='true' />
                    </div>

                    <div id='fileDeets'>PRINT SPECS</div>

                    <div id='fourthLine'>
                        <p id='coloredBa'>Colored:<input id='boxColor' type='checkbox' checked={colored} disabled='true' />
                            <div id='numberCopies'># of Copies: <p className='specText'>{noOfCopies}</p>
                            </div> <div id='numberCopies'>Paper Size: <p className='specText'>{paperSize}</p>
                            </div>
                        </p>
                        <p id='whatBind'>Bind: <p className='specText'>{bindType}</p> <div id='numberCopies'>Stapled? <input id='boxColor' type='checkbox' checked={toStaple} disabled='true' />
                        </div> </p>
                    </div>

                    <div id='contactDeets'>CONTACT INFORMATION</div>
                    <div className='infoLine'>Name: <div className='contactItem'>{requesterName}</div></div>
                    <div className='infoLine'>Email: <div className='contactItem'>{requesterEmail}</div></div>
                    <div className='infoLine'>Contact #: <div className='contactItem'>{contactNumber}</div></div>
                    <div className='infoLine'>Department: <div className='contactItem'>{department}</div></div>

                    <div id="overlay" className={commentShow} onClick={closeComment}></div>
                    <div id="deetCommentBody" className={commentShow}>
                        <div id='commBod'>
                            <p>{commentDate}</p>
                            <input type='text' value={commentHeader} onChange={(e) => setCommentHeader(e.target.value)} disabled='true' id='commHead' />
                            <textarea value={commentContent} onChange={(e) => setCommentContent(e.target.value)} disabled={editable} id='commContent' />

                            <button id='inAdd' className={buttonShow} onClick={proceedReject} disabled={rejectDisable}>Reject</button>
                        </div>
                    </div>

                </div>
                <DataTable value={comments} header={commentTableHeader}
                    scrollable scrollHeight="17.48vw"
                    emptyMessage="No comments found." id='tableOfComments'
                    paginator rows={5}
                    tableStyle={{ minWidth: '5vw' }} selectionMode="single" onRowSelect={onCommentSelect}>
                    <Column field="sentBy" header="Sent by"></Column>
                    <Column field="header" header="Header"></Column>
                    <Column field="content" header="Content"></Column>
                    <Column field="sentDate" header="Date"></Column>
                </DataTable>

                <div id='columnizer'>
                    <a id="pendingGetRequest" href={downloadURL} target="_blank" rel="noreferrer" onClick={closeModal}>View File</a>
                    <button id='approved' className='pendButtons' onClick={handleAccept}>Accept</button>
                    <button id='rejected' className='pendButtons' onClick={handleReject}>Reject</button>
                </div>
            </div>
        </div>
    );
};

export default Pending;