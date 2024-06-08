import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Button, ButtonGroup } from "react-bootstrap";

class ProfileStats extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.userInfo === undefined || this.props.userInfo === null) {
      return;
    }
    return (
      <Container fluid>
        <Row key={this.props.userInfo._id.toString()} className="align-items-center">
          <Col md={{ span: 4, offset: 4 }}>
            <ButtonGroup aria-label="Stats buttons">
              <Button variant="light" disabled>
                Tweets
                <h4>
                  <b>{this.props.userInfo.numPost}</b>
                </h4>
              </Button>
              <Button variant="light" disabled>
                Following
                <h4>
                  <b>{this.props.userInfo.numFollowing}</b>
                </h4>
              </Button>
              <Button variant="light" disabled>
                Followers
                <h4>
                  <b>{this.props.userInfo.numFollower}</b>
                </h4>
              </Button>
              <Button variant="light" disabled>
                Likes
                <h4>
                  <b>{this.props.userInfo.numLike}</b>
                </h4>
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProfileStats;
