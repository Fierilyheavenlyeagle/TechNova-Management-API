
import TaskModel from "../models/taskModel.js";
import AsyncWrapper from "../utils/AsyncWrapper.js";
import {
  Api400Error,
  Api404Error,
  Api500Error,
} from "../utils/custom_error/apiError.js";

const create = AsyncWrapper.wrapAsync(async (req, res) => {
  const title = req.body.title?.trim();

  if (!title) {
    throw new Api400Error(
      "Invalid Title",
      undefined,
      "Task title is required"
    );
  }

  try {
    const last = await TaskModel.findOne().sort({ id: -1 });
    const id = last ? last.id + 1 : 1;

    const task = await TaskModel.create({
      id,
      title,
      description: req.body.description,
      projectId: req.body.projectId,
      assignedTo: req.body.assignedTo,
      priority: req.body.priority,
      status: req.body.status,
      dueDate: req.body.dueDate,
      completed: req.body.completed,
    });

    res.status(201).json(task);
  } catch (err) {
    throw new Api500Error(
      "Task Creation Error",
      undefined,
      err.message
    );
  }
});

const findAll = AsyncWrapper.wrapAsync(async (req, res) => {
  const tasks = await TaskModel.find({}, { _id: 0 });
  res.json(tasks);
});

const findOne = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    throw new Api400Error("Invalid ID", undefined, "Invalid task ID");
  }

  const task = await TaskModel.findOne({ id });

  if (!task) {
    throw new Api404Error(
      "Task Not Found",
      undefined,
      `Task ${id} not found`
    );
  }

  res.json(task);
});

const updateId = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    throw new Api400Error("Invalid ID", undefined, "Invalid task ID");
  }

  const allowed = [
    "title", "description", "projectId",
    "assignedTo", "priority", "status",
    "dueDate", "completed"
  ];

  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key))
  );

  const task = await TaskModel.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new Api404Error(
      "Task Not Found",
      undefined,
      `Task ${id} not found`
    );
  }

  res.json(task);
});

const destructionId = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    throw new Api400Error("Invalid ID", undefined, "Invalid task ID");
  }

  const task = await TaskModel.findOneAndDelete({ id });

  if (!task) {
    throw new Api404Error(
      "Task Not Found",
      undefined,
      `Task ${id} not found`
    );
  }

  res.json({ message: "Task deleted successfully!" });
});

export default {
  create,
  findAll,
  findOne,
  updateId,
  destructionId,
};
