import React, { Component } from "react";
import { Navbar, Nav, Button, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../logo.svg";

class NavbarComponent extends Component {
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              {/* <Nav.Link as={Link} to="/profilecover">
                Cover
              </Nav.Link>
              <Nav.Link as={Link} to="/profilestats">
                Stats
              </Nav.Link>
              <Nav.Link as={Link} to="/profileinfo">
                Info
              </Nav.Link>
              <Nav.Link as={Link} to="/newtweet">
                New
              </Nav.Link>
              <Nav.Link as={Link} to="/tweetcard">
                Card
              </Nav.Link>
              <Nav.Link as={Link} to="/invididualtweetcard">
                Invid
              </Nav.Link>
              <Nav.Link as={Link} to="/rightpanel">
                Right
              </Nav.Link> */}
              <Nav.Link as={Link} to="#">
                Moments
              </Nav.Link>
              <Nav.Link as={Link} to="#">
                Notifications
              </Nav.Link>
              <Nav.Link as={Link} to="#">
                Messages
              </Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search Twitter"
                className="me-2 rounded-pill"
                aria-label="Search"
              />
              <Button variant="primary rounded-pill">Tweet</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default NavbarComponent;
