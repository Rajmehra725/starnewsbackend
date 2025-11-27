const Todo = require("../models/Todo");

// ⚡ Get All Todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ⚡ Create Todo
exports.addTodo = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Todo text is required!"
      });
    }

    const todo = await Todo.create({ text });

    res.status(201).json({
      success: true,
      message: "Todo Created Successfully",
      data: todo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ⚡ Update Todo (Text or Done)
exports.updateTodo = async (req, res) => {
  try {
    const { text, done } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text, done },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo Updated Successfully",
      data: todo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ⚡ Toggle Todo Status Only
exports.toggleStatus = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo Not Found"
      });
    }

    todo.done = !todo.done;
    await todo.save();

    res.status(200).json({
      success: true,
      message: "Status Updated",
      data: todo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ⚡ Delete Todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo Deleted Successfully",
      deletedId: req.params.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
