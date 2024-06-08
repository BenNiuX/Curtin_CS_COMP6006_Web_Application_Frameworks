const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const timeout = require("connect-timeout");
const bodyParser = require("body-parser");
require("dotenv").config();
const fs = require("fs");

const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const STORAGE_LIST = process.env.STORAGE_LIST || "storage_list.json";

app.use(cors());
app.use(helmet());
app.use(timeout("5s"));
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync(STORAGE_LIST);
const storageData = JSON.parse(data);
const cartData = [];
const pastOrders = [];
let orderMaxId = 0;

app.get("/shop", (req, res) => {
  res.send(storageData);
});

app.get("/cart", (req, res) => {
  res.send(cartData);
});

app.post("/cart", verifyOrder, (req, res) => {
  const cartInfo = req.body;
  console.log(`body: ${cartInfo}`);
  cartInfo.map((item) => {
    storageData.forEach((element) => {
      if (element.id === item.id) {
        item.name = element.name;
        item.description = element.description;
        item.amountMax = element.amount;
        item.price = element.price;
        cartData.push(item);
      }
    });
  });
  res.send(cartData);
});

app.put("/cart", verifyOrder, (req, res) => {
  const cartInfo = req.body;
  console.log(`body: ${cartInfo}`);
  cartInfo.map((item) => {
    cartData.forEach((element) => {
      if (element.id === item.id) {
        element.amount = item.amount;
      }
    });
  });
  res.send(cartData);
});

app.delete("/cart/:id", (req, res) => {
  const cartId = parseInt(req.params.id);
  let deleteIndex = -1;
  cartData.map((item, index) => {
    if (item.id === cartId) {
      deleteIndex = index;
    }
  });
  if (deleteIndex >= 0) {
    cartData.splice(deleteIndex, 1);
    res.send(cartData);
  } else {
    res.status(400).send("Delete cart fail");
  }
});

app.get("/orders", (req, res) => {
  res.send(pastOrders);
});

function verifyOrder(req, res, next) {
  const orderInfo = req.body;
  let verifyFail = false;
  orderInfo.map((item) => {
    if (Number.isInteger(item.id) && Number.isInteger(item.amount)) {
      let findItem = false;
      let amountCorrect = false;
      storageData.forEach((element) => {
        if (element.id === item.id && element.amount >= item.amount) {
          findItem = true;
          amountCorrect = true;
        }
      });
      if (!(findItem && amountCorrect)) {
        console.log(`Verify fail for ${item}`);
        verifyFail = true;
      }
    }
  });
  if (verifyFail) {
    res.status(400).send("Verify fail");
  } else {
    next();
  }
}

function getOrderId() {
  orderMaxId += 1;
  return orderMaxId;
}

app.post("/orders", verifyOrder, (req, res) => {
  const orderInfo = req.body;
  console.log(`body: ${orderInfo}`);
  let orderId = getOrderId();
  let totalPrice = 0;
  orderInfo.map((item) => {
    storageData.forEach((element) => {
      if (element.id === item.id) {
        element.amount -= item.amount;
        item.orderId = orderId;
        item.name = element.name;
        item.description = element.description;
        item.price = element.price;
        item.totalPrice = item.amount * element.price;
        totalPrice += item.totalPrice;
      }
    });
  });
  if (totalPrice === 0) {
    res.status(400).send("Place order fail");
  } else {
    pastOrders.push(orderInfo);
    cartData.length = 0;
    res.send(pastOrders);
  }
});

app.delete("/orders/:id", (req, res) => {
  const orderId = parseInt(req.params.id);
  let deleteIndex = -1;
  pastOrders.map((item, index) => {
    if (item[0].orderId === orderId) {
      storageData.forEach((element) => {
        item.forEach((subitem) => {
          if (element.id === subitem.id) {
            element.amount += subitem.amount;
            cartData.forEach((cartItem) => {
              if (cartItem.id === element.id) {
                cartItem.amountMax = element.amount;
              }
            });
          }
        });
      });
      deleteIndex = index;
    }
  });
  if (deleteIndex >= 0) {
    pastOrders.splice(deleteIndex, 1);
    res.send(pastOrders);
  } else {
    res.status(400).send("Delete order fail");
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
