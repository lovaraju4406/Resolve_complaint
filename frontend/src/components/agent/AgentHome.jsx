import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';

import ChatWindow from '../common/ChatWindow';
import Footer from '../common/FooterC';

const AgentHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [toggle, setToggle] = useState({});
  const [agentComplaintList, setAgentComplaintList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUserName(user.name);
          const response = await axios.get(`http://localhost:8000/allcomplaints/${user._id}`);
          setAgentComplaintList(response.data);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [navigate]);

  const handleStatusChange = async (complaintId) => {
    try {
      await axios.put(`http://localhost:8000/complaint/${complaintId}`, { status: 'completed' });
      setAgentComplaintList((prev) =>
        prev.map((complaint) =>
          complaint._doc.complaintId === complaintId
            ? { ...complaint, _doc: { ...complaint._doc, status: 'completed' } }
            : complaint
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = (complaintId) => {
    setToggle((prev) => ({
      ...prev,
      [complaintId]: !prev[complaintId],
    }));
  };

  const LogOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand className="text-white">👷 Hi Agent, {userName}</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              <NavLink className="nav-link text-light">View Complaints</NavLink>
            </Nav>
            <Button onClick={LogOut} variant="outline-danger">
              Log out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Complaint Cards */}
      <Container className="my-4 d-flex flex-wrap justify-content-center">
        {agentComplaintList && agentComplaintList.length > 0 ? (
          agentComplaintList.map((complaint, index) => {
            const open = toggle[complaint._doc.complaintId] || false;

            return (
              <Card key={index} className="m-3 shadow" style={{ width: '20rem' }}>
                <Card.Body>
                  <Card.Title>
                    <b>Name:</b> {complaint.name}
                  </Card.Title>
                  <Card.Text><b>Address:</b> {complaint.address}</Card.Text>
                  <Card.Text><b>City:</b> {complaint.city}</Card.Text>
                  <Card.Text><b>State:</b> {complaint.state}</Card.Text>
                  <Card.Text><b>Pincode:</b> {complaint.pincode}</Card.Text>
                  <Card.Text><b>Comment:</b> {complaint.comment}</Card.Text>
                  <Card.Text>
                    <b>Status:</b>{' '}
                    <span className={complaint._doc.status === 'completed' ? 'text-success' : 'text-warning'}>
                      {complaint._doc.status}
                    </span>
                  </Card.Text>

                  {complaint._doc.status !== 'completed' && (
                    <Button
                      onClick={() => handleStatusChange(complaint._doc.complaintId)}
                      variant="success"
                      size="sm"
                      className="me-2"
                    >
                      Mark Completed
                    </Button>
                  )}
                  <Button
                    onClick={() => handleToggle(complaint._doc.complaintId)}
                    aria-controls={`collapse-${complaint._doc.complaintId}`}
                    aria-expanded={open}
                    variant="primary"
                    size="sm"
                  >
                    Message
                  </Button>

                  <Collapse in={open}>
                    <div id={`collapse-${complaint._doc.complaintId}`} className="mt-3">
                      <Card body className="p-2 border">
                        <ChatWindow
                          key={complaint._doc.complaintId}
                          complaintId={complaint._doc.complaintId}
                          name={userName}
                        />
                      </Card>
                    </div>
                  </Collapse>
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <Alert variant="info" className="mt-5 text-center w-100">
            <Alert.Heading>No complaints to show</Alert.Heading>
          </Alert>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default AgentHome;
