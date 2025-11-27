const express = require("express");
const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleStatus
} = require("../controllers/todoController");

const router = express.Router();

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id", updateTodo);
router.patch("/toggle/:id", toggleStatus); // NEW FEATURE
router.delete("/:id", deleteTodo);

module.exports = router;
