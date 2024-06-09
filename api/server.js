const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const dbPath = path.join(__dirname, "db.json");

app.use(cors());
app.use(bodyParser.json());

const readDatabase = () => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// get all users
app.get("/api/users", (req, res) => {
  const db = readDatabase();
  res.json(db.users);
});

// get all orders
app.get("/api/orders", (req, res) => {
  const db = readDatabase();
  res.json(db.orders);
});

//  add a new order
app.post("/api/orders", (req, res) => {
  const db = readDatabase();
  const newOrder = req.body;
  db.orders.push(newOrder);
  writeDatabase(db);
  res.status(201).json(newOrder);
});

// update an order
app.put("/api/orders/:orderId", (req, res) => {
  const db = readDatabase();
  const { orderId } = req.params;
  const updatedOrder = req.body;
  const orderIndex = db.orders.findIndex((order) => order.orderId === orderId);
  if (orderIndex !== -1) {
    db.orders[orderIndex] = updatedOrder;
    writeDatabase(db);
    res.json(updatedOrder);
  } else {
    res.status(404).send("Order not found");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
