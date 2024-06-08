import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Button, Form, Image } from "react-bootstrap";

const DEFAULT_CONTENT = "What's happening?";

class NewTweet extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const textarea = document.getElementById("postContent");
    this.props.onAdd(this.props.userInfo._id.toString(), textarea.value);
    textarea.value = "";
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col xs={2} sm={2}>
            <Image
              src={process.env.PUBLIC_URL + "imgs/icon.png"}
              roundedCircle
              fluid
            />
          </Col>
          <Col xs={10} sm={10}>
            <form method="POST" onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Control
                  id="postContent"
                  as="textarea"
                  placeholder={DEFAULT_CONTENT}
                  rows="3"
                  className="full-width-textarea"
                />
              </Form.Group>
              <p />
              <Button variant="primary rounded-pill" type="submit">
                Tweet
              </Button>
            </form>
          </Col>
        </Row>
        <hr />
      </Container>
    );
  }
}

export default NewTweet;
