import React, { Component } from "react";
import { Container, Row, Table, Button } from "react-bootstrap";
import axios from "axios";

const HTTP_URL =
  `${process.env.REACT_APP_BE_HTTP}://${process.env.REACT_APP_BE_URL}:` +
  `${process.env.REACT_APP_BE_PORT}`;

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
    };
    this.handleDecrease = this.handleDecrease.bind(this);
    this.handleIncrease = this.handleIncrease.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.orderNow = this.orderNow.bind(this);
  }

  async componentDidMount() {
    await axios
      .get(`${HTTP_URL}/${process.env.REACT_APP_EP_CART}`)
      .then((response) => {
        const cart = response.data;
        this.setState({ cart });
      })
      .catch((err) => {
        console.log(err);
        alert("No connection!!!");
      });
  }

  handleDecrease = async function handleDecrease(id, amount) {
    console.log(`Decrease ${id} ${amount}`);
    let putParams = [{ id: id, amount: amount - 1 }];
    await axios
      .put(`${HTTP_URL}/${process.env.REACT_APP_EP_CART}`, putParams)
      .then((response) => {
        const cart = response.data;
        this.setState({ cart });
      })
      .catch((err) => {
        console.log(err);
        alert("Operate failed!!!");
      });
  };

  handleIncrease = async function handleIncrease(id, amount) {
    console.log(`Increase ${id} ${amount}`);
    let putParams = [{ id: id, amount: amount + 1 }];
    await axios
      .put(`${HTTP_URL}/${process.env.REACT_APP_EP_CART}`, putParams)
      .then((response) => {
        const cart = response.data;
        this.setState({ cart });
      })
      .catch((err) => {
        console.log(err);
        alert("Operate failed!!!");
      });
  };

  handleDelete = async function handleDelete(id) {
    console.log(`Delete ${id}`);
    await axios
      .delete(`${HTTP_URL}/${process.env.REACT_APP_EP_CART}/${id}`)
      .then((response) => {
        const cart = response.data;
        this.setState({ cart });
      })
      .catch((err) => {
        console.log(err);
        alert("Delete failed!!!");
      });
  };

  orderNow = async function orderNow() {
    await axios
      .post(`${HTTP_URL}/${process.env.REACT_APP_EP_ORDER}`, this.state.cart)
      .then((response) => {
        this.setState({ cart: [] });
        alert("Your order has been placed!");
      })
      .catch((err) => {
        console.log(err);
        alert("Order failed!!!");
      });
  };

  render() {
    let totalPrice = 0;
    this.state.cart.forEach((item) => {
      totalPrice += item.amount * item.price;
    });
    return (
      <Container>
        <Row>
          <h2>Cart</h2>
          <p>Modify your interest and place your order!</p>
        </Row>
        <Row>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Available</th>
                <th>Price</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.amountMax}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <span>
                      <Button
                        variant="light"
                        size="sm"
                        disabled={item.amount === 1}
                        onClick={() =>
                          this.handleDecrease(item.id, item.amount)
                        }
                      >
                        -
                      </Button>
                      {item.amount}
                      <Button
                        variant="light"
                        size="sm"
                        type="reset"
                        disabled={item.amount === item.amountMax}
                        onClick={() =>
                          this.handleIncrease(item.id, item.amount)
                        }
                      >
                        +
                      </Button>
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => this.handleDelete(item.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
        <Row className="text-end">
          <span>
            <p>Total price: ${totalPrice.toFixed(2)}</p>
            <Button
              variant="success"
              size="lg"
              disabled={this.state.cart.length === 0}
              onClick={() => this.orderNow()}
            >
              Order
            </Button>
          </span>
        </Row>
      </Container>
    );
  }
}

export default Cart;
