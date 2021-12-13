import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectdb.js";
import { Todo } from "./schema/todoSchema.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 6000;

connectDB();
app.get("/", (req, res) => {
  res.send("<h1>This is Neema </h1>");
});

app.use(express.json());
app.use(cors());

app.post("/todos", async (req, res) => {
  const { title, description, date_time } = req.body;
  const todo = await Todo.create({
    title,
    description,
    date_time,
  });
  if (todo) {
    return res.status(201).json({
      success: true,
      date: todo,
      message: "Todo created successfully",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Todo not created",
    });
  }
});
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  if (todos) {
    return res.status(200).json({
      success: true,
      data: todos,
      message: "Todos retrieved successfully",
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Todos not retrieved",
    });
  }
});
app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const todo = await Todo.updateOne({ status }).where({ _id: id });
  if (todo) {
    return res.status(200).json({
      success: true,
      data: todo,
      message: "Todo updated successfully",
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Todo not updated",
    });
  }
});

app.delete("/todos/:id",async (req, res) => {
  const { id } = req.params;
  await Todo.deleteOne({ _id: id });
  return res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
