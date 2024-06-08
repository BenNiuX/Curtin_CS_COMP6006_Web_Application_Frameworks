import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Button, Image } from "react-bootstrap";
import Moment from "react-moment";

class ProfileInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.userInfo === undefined || this.props.userInfo === null) {
      return;
    }
    const gallery_imgs = [
      ["imgs/1.jpg", "imgs/2.jpg", "imgs/3.jpg"],
      ["imgs/4.jpg", "imgs/5.jpg", "imgs/6.jpg"],
      ["imgs/7.jpg", "imgs/8.jpg", "imgs/9.jpg"],
    ];
    return (
      <Container fluid>
        <Row>
          <Image src={process.env.PUBLIC_URL + "imgs/icon.png"} roundedCircle />
        </Row>
        <Row key={this.props.userInfo._id.toString()}>
          <Col>
            <h3>
              <b>
                {this.props.userInfo.nameFirst} {this.props.userInfo.nameLast}
              </b>
            </h3>
            <p>@{this.props.userInfo.nameShort}</p>
            <p>
              <a href="">twitter.com/{this.props.userInfo.nameShort}</a>
              <br />
              <a href="">
                {this.props.userInfo.city}, {this.props.userInfo.state}
              </a>
            </p>
            <p>
              Joined{" "}
              <Moment format="MMMM YYYY">
                {this.props.userInfo.registerDate}
              </Moment>
            </p>
            <Button variant="primary rounded-pill">Tweet to John Smith</Button>
            <p>
              <a href="">1,142 Photos and videos</a>
            </p>
            {gallery_imgs.map((row) => (
              <Row xs="auto">
                {row.map((img) => (
                  <Col xs={4} md={4}>
                    <Image src={process.env.PUBLIC_URL + img} thumbnail />
                  </Col>
                ))}
              </Row>
            ))}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProfileInfo;
