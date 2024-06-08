import React, { Component } from "react";
import { Container } from "react-bootstrap";
import InvididualTweetCard from "./invididualtweetcard";

class TweetCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.posts === undefined || this.props.posts.length === 0) {
      return;
    }
    return (
      <Container fluid>
        {this.props.posts.map((post) => (
          <InvididualTweetCard
            key={post._id.toString()}
            id={post._id.toString()}
            post={post}
            userInfo={this.props.userInfo}
            onDelete={this.props.onDelete}
          />
        ))}
      </Container>
    );
  }
}

export default TweetCard;
