import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Button, Image, ListGroup } from "react-bootstrap";

class RightPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (
      this.props.allUsersInfo === undefined ||
      this.props.allUsersInfo.length === 0
    ) {
      return;
    }
    return (
      <Container fluid>
        <Row>
          <Col>
            <Row>
              <Col>
                <h5>
                  <b>Who to follow</b>
                </h5>
              </Col>
              <Col>
                <a href="">Refresh</a> <a href="">View all</a>
              </Col>
            </Row>
            <ListGroup as="ul">
              {this.props.allUsersInfo.map((info) => (
                <ListGroup.Item as="li" key={info._id.toString()}>
                  <Container fluid>
                    <Row>
                      <Col xs={3} sm={3}>
                        <Image
                          src={process.env.PUBLIC_URL + "imgs/icon.png"}
                          roundedCircle
                          fluid
                        />
                      </Col>
                      <Col xs={9} sm={9}>
                        <div className="ms-2 me-auto">
                          <span className="fw-bold">
                            {info.nameFirst} {info.nameLast}
                          </span>{" "}
                          <span>@{info.nameShort}</span>
                        </div>
                        <Button variant="outline-primary rounded-pill">
                          Follow
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default RightPanel;
