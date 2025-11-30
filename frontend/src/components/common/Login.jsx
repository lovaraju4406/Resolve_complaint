import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Footer from './FooterC';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post('http://localhost:8000/Login', user)
      .then((res) => {
        alert('Successfully logged in');
        localStorage.setItem('user', JSON.stringify(res.data));
        const { userType } = res.data;

        switch (userType) {
          case 'Admin':
            navigate('/AdminHome');
            break;
          case 'Ordinary':
            navigate('/HomePage');
            break;
          case 'Agent':
            navigate('/AgentHome');
            break;
          default:
            navigate('/Login');
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("User doesn't exist");
        }
        navigate('/Login');
      });
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

      {/* Login Form */}
      <section className="vh-100 bg-gradient bg-light">
        <div className="container py-5 h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-lg rounded-4 border-0">
                <div className="card-body p-5">
                  <h2 className="fw-bold text-center mb-4">Login to Continue</h2>
                  <p className="text-muted text-center mb-5">Enter your credentials below</p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        required
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        autoComplete="off"
                        required
                      />
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary btn-lg">
                        Login
                      </button>
                    </div>
                  </form>

                  <p className="text-center mt-4">
                    Don’t have an account?{' '}
                    <Link to="/signup" className="text-decoration-none">
                      Sign Up
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

export default Login;
