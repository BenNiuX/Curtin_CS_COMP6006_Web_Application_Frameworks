import React, { Component } from "react";
import axios from "axios";
import { Container, Row } from "react-bootstrap";
import Order from "./order";

const HTTP_URL =
  `${process.env.REACT_APP_BE_HTTP}://${process.env.REACT_APP_BE_URL}:` +
  `${process.env.REACT_APP_BE_PORT}`;

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
    this.handleDeleteOrder = this.handleDeleteOrder.bind(this);
  }

  async componentDidMount() {
    await axios
      .get(`${HTTP_URL}/${process.env.REACT_APP_EP_ORDER}`)
      .then((response) => {
        const orders = response.data;
        this.setState({ orders });
      })
      .catch((err) => {
        console.log(err);
        alert("No connection!!!");
      });
  }

  handleDeleteOrder = async function handleDeleteOrder(orderId) {
    console.log(`Delete orderId=${orderId}`);
    await axios
      .delete(`${HTTP_URL}/${process.env.REACT_APP_EP_ORDER}/${orderId}`)
      .then((response) => {
        const orders = response.data;
        this.setState({ orders });
        alert("Delete order complete!");
      })
      .catch((err) => {
        console.log(err);
        alert("Delete failed!!!");
      });
  };

  render() {
    return (
      <Container>
        <Row>
          <h2>Orders</h2>
          <p>Review your past orders!</p>
        </Row>
        {this.state.orders
          .slice(0)
          .reverse()
          .map((item) => (
            <Row key={item[0].orderId}>
              <Order details={item} onDelete={this.handleDeleteOrder}>
                <h5>ORDER: {`ID_${item[0].orderId}`}</h5>
              </Order>
            </Row>
          ))}
      </Container>
    );
  }
}

export default Orders;
