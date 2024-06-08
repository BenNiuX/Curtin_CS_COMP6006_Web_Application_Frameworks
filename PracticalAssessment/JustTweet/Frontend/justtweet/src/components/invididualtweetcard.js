import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Button, Image, Card } from "react-bootstrap";
import Moment from "react-moment";

class InvididualTweetCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.post === undefined) {
      return;
    }
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
            <div>
              <span className="fw-bold">
                {this.props.userInfo.nameFirst} {this.props.userInfo.nameLast}
              </span>{" "}
              <span>@{this.props.userInfo.nameShort}</span>
              <span>
                {" "}
                - <Moment format="MMM DD">{this.props.post.createDate}</Moment>
              </span>
              <span>
                <Button
                  variant="link"
                  className="float-end float-right"
                  onClick={() => this.props.onDelete(this.props.id)}
                >
                  &times;
                </Button>
              </span>
            </div>
            <Card>
              <Card.Body>
                <Card.Text>
                  <pre>{this.props.post.content}</pre>
                </Card.Text>
              </Card.Body>
            </Card>
            <Button variant="light" disabled>
              {this.props.post.numView}
            </Button>
            <Button variant="light" disabled>
              {this.props.post.numRepost}
            </Button>
            <Button variant="light" disabled>
              {this.props.post.numQuote}
            </Button>
            <Button variant="light" disabled>
              {this.props.post.numLike}
            </Button>
            {/* <Button variant="primary rounded-pill" onClick={() => this.props.onDelete(this.props.id)}>Delete</Button> */}
          </Col>
        </Row>
        <hr></hr>
      </Container>
    );
  }
}

export default InvididualTweetCard;
