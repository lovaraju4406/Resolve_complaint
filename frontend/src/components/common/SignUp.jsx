import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Footer from './FooterC';

const SignUp = () => {
  const [title, setTitle] = useState('Select User');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    userType: '',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleTitle = (select) => {
    setTitle(select);
    setUser({ ...user, userType: select });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { ...user, userType: title };

    try {
      const res = await axios.post('http://localhost:8000/SignUp', updatedUser);
      alert('Record submitted');
      console.log(JSON.stringify(res.data.user));
      setUser({
        name: '',
        email: '',
        password: '',
        phone: '',
        userType: '',
      });
      setTitle('Select User');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand>ResolveNow</Navbar.Brand>
          <ul className="navbar-nav flex-row gap-3">
            <li className="nav-item">
              <Link to="/" className="nav-link text-light">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link text-light">
                SignUp
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link text-light">
                Login
              </Link>
            </li>
          </ul>
        </Container>
      </Navbar>

      {/* Signup Form */}
      <section className="vh-100 bg-light">
        <div className="container py-5 h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <h2 className="fw-bold mb-4">Create Your Account</h2>
                  <p className="text-muted mb-4">Enter your details below</p>

                  <form onSubmit={handleSubmit} className="text-start">
                    <div className="form-outline mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        required
                      />
                    </div>

                    <div className="form-outline mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        required
                      />
                    </div>

                    <div className="form-outline mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        required
                      />
                    </div>

                    <div className="form-outline mb-3">
                      <label className="form-label">Mobile No.</label>
                      <input
                        type="text"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        required
                      />
                    </div>

                    <div className="form-outline mb-3">
                      <label className="form-label d-block">Select User Type</label>
                      <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                          {title}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleTitle('Ordinary')}>Ordinary</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleTitle('Admin')}>Admin</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleTitle('Agent')}>Agent</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <div className="d-grid mt-4">
                      <button type="submit" className="btn btn-primary btn-lg">
                        Register
                      </button>
                    </div>
                  </form>

                  <p className="mt-4 mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default SignUp;
