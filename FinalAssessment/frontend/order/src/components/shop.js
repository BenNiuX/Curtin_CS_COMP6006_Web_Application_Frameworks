import React, { Component } from "react";
import { Container, Row, Table, Button } from "react-bootstrap";
import axios from "axios";

const HTTP_URL =
  `${process.env.REACT_APP_BE_HTTP}://${process.env.REACT_APP_BE_URL}:` +
  `${process.env.REACT_APP_BE_PORT}`;

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shop: [],
      cart: [],
    };
    this.handleAddCart = this.handleAddCart.bind(this);
  }

  async componentDidMount() {
    await axios
      .get(`${HTTP_URL}/${process.env.REACT_APP_EP_CART}`)
      .then((response) => {
        this.setState({ cart: response.data });
        axios
          .get(`${HTTP_URL}/${process.env.REACT_APP_EP_SHOP}`)
          .then((response) => {
            const shop = response.data;
            shop.forEach((item) => {
              item.disable = false;
              this.state.cart.forEach((element) => {
                if (item.id === element.id) {
                  item.disable = true;
                }
              });
            });
            this.setState({ shop });
          })
          .catch((err) => {
            console.log(err);
            alert("No connection!!!");
          });
      })
      .catch((err) => {
        console.log(err);
        alert("No connection!!!");
      });
  }

  handleAddCart = async function handleAddCart(params) {
    console.log(`Add into cart: ${params}`);
    let postParams = [{ id: params, amount: 1 }];
    await axios
      .post(`${HTTP_URL}/${process.env.REACT_APP_EP_CART}`, postParams)
      .then((response) => {
        const newCart = response.data;
        this.setState({ cart: newCart });
        this.state.shop.forEach((item) => {
          item.disable = false;
          newCart.forEach((element) => {
            if (item.id === element.id) {
              item.disable = true;
            }
          });
        });
        this.setState({ shop: this.state.shop });
      })
      .catch((err) => {
        console.log(err);
        alert("Add cart failed!!!");
      });
  };

  render() {
    return (
      <Container>
        <Row>
          <h2>Menu</h2>
          <p>Select your items and add to cart!</p>
        </Row>
        <Row>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Available</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.shop.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.amount}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <Button
                      variant={
                        item.disable || item.amount === 0
                          ? "secondary"
                          : "primary"
                      }
                      disabled={item.disable || item.amount === 0}
                      onClick={() => this.handleAddCart(item.id)}
                      size="sm"
                    >
                      Add to cart
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}

export default Shop;
