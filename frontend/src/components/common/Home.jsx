import React from 'react';
import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from './FooterC';
import '../../App.css'; // Correct relative path

const Home = () => {
  return (
    <>
      {/* Dark Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>ResolveNow</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Hero Section with Background Image */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <Container className="hero-content text-center">
          <h1 className="hero-title">Empower Your Team</h1>
          <p className="hero-subtitle">
            Exceed Customer Expectations with our Complaint Management Solution.
          </p>
          <Link to="/login">
            <Button variant="primary" size="lg" className="hero-btn">
              Register Your Complaint
            </Button>
          </Link>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Home;
