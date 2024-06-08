import React, { Component } from "react";
import ProfileStats from "./components/profilestats";
import ProfileInfo from "./components/profileinfo";
import ProfileCover from "./components/profilecover";
import NewTweet from "./components/newtweet";
import TweetCard from "./components/tweetcard";
import RightPanel from "./components/rightpanel";
import { Container, Col, Row } from "react-bootstrap";
import axios from "axios";

const HTTP_URL =
  `${process.env.REACT_APP_BE_HTTP}://${process.env.REACT_APP_BE_URL}:` +
  `${process.env.REACT_APP_BE_PORT}/`;

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      allUsersInfo: [],
      posts: [],
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async getUserInfo() {
    await axios.get(
      `${HTTP_URL}${process.env.REACT_APP_EP_USER_GET}?userId=${process.env.REACT_APP_USER_ID}`,
    ).then((response) => {
      console.log(response);
      const { data: userInfo } = response.data;
      console.log(userInfo);
      this.setState({ userInfo: response.data[0] });
    }).catch((err) => {
      alert("No connection!!!");
    });
  }

  async getAllUserInfo() {
    await axios.get(
      `${HTTP_URL}${process.env.REACT_APP_EP_USER_GET}`,
    ).then((response) => {
      console.log(response);
      const { data: allUsersInfo } = response.data;
      console.log(allUsersInfo);
      this.setState({ allUsersInfo: response.data }); 
    }).catch((err) => {
      alert("No connection!!!");
    });
  }

  async getPosts() {
    await axios.get(
      `${HTTP_URL}${process.env.REACT_APP_EP_POST_GET}?userId=${process.env.REACT_APP_USER_ID}`,
    ).then((response) => {
      console.log(response);
      const { data: posts } = response.data;
      console.log(posts);
      this.setState({ posts: response.data });
    }).catch((err) => {
      alert("No connection!!!");
    });
  }

  async componentDidMount() {
    this.getUserInfo();
    this.getAllUserInfo();
    this.getPosts();
  }

  async handleDelete(postId) {
    console.log(`delete: ${postId}`);
    await axios.delete(
      `${HTTP_URL}${process.env.REACT_APP_EP_POST_DELETE}/${postId}`,
    );
    await this.getPosts();
    await this.getUserInfo();
  }

  async handleAdd(userId, content) {
    console.log(` newpost: ${content}`);
    let addSuccess = true;
    await axios.post(`${HTTP_URL}${process.env.REACT_APP_EP_POST_POST}`, {
      userId: userId,
      content: content,
    }).catch((err) => {
      addSuccess = false;
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log('Error', err.message);
        alert(err.response.data[0].message);
        return;
      } else if (err.request) {
        console.log(err.request);
        console.log('Error', err.message);
      } else {
        console.log('Error', err.message);
      }
    });
    if (addSuccess) {
      await this.getPosts();
      await this.getUserInfo();
    }
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <ProfileCover />
        </Row>
        <Row>
          {this.state.userInfo !== null && (
            <ProfileStats userInfo={this.state.userInfo} />
          )}
        </Row>
        <Container>
          <Row>
            <Col md={3}>
              {this.state.userInfo !== null && (
                <ProfileInfo userInfo={this.state.userInfo} />
              )}
            </Col>
            <Col md={5}>
              <Row>
                {this.state.userInfo !== null && (
                  <NewTweet
                    userInfo={this.state.userInfo}
                    onAdd={this.handleAdd}
                  />
                )}
              </Row>
              <Row>
                {this.state.posts.length !== 0 &&
                  this.state.userInfo !== null && (
                    <TweetCard
                      posts={this.state.posts}
                      userInfo={this.state.userInfo}
                      onDelete={this.handleDelete}
                    />
                  )}
              </Row>
            </Col>
            <Col md={4}>
              {this.state.allUsersInfo.length !== 0 && (
                <RightPanel allUsersInfo={this.state.allUsersInfo} />
              )}
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default HomePage;
