import React, { Component } from "react";
import { Container, Row, Table, Button } from "react-bootstrap";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.details,
    };
    this.handleDelete = this.props.onDelete;
  }

  render() {
    const orderId = this.state.items[0].orderId;
    let totalPrice = 0;
    this.state.items.forEach((item) => {
      totalPrice += item.totalPrice;
    });
    return (
      <Container>
        <Row>{this.props.children}</Row>
        <Row>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.amount}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
        <Row className="text-end">
          <span>
            <p>Order total price: ${totalPrice.toFixed(2)}</p>
            <Button
              variant="danger"
              size="lg"
              onClick={() => this.handleDelete(orderId)}
            >
              Remove
            </Button>
          </span>
        </Row>
        <Row>
          <p></p>
          <hr />
        </Row>
      </Container>
    );
  }
}

export default Order;
