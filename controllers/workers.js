import DataModel from "../models/dataModel.js";
import AsyncWrapper from "../utils/AsyncWrapper.js";
import { UserNameValidator, WorkerIdValidator } from "../utils/validators.js";
import {
  Api404Error,
  Api500Error,
  Api400Error,
} from "../utils/custom_error/apiError.js";

/* -------------------- CREATE -------------------- */
const create = AsyncWrapper.wrapAsync(async (req, res) => {
  const age = Number(req.body.age);

  if (isNaN(age) || age < 18 || age > 65) {
    throw new Api400Error(
      "Invalid Age",
      undefined,
      `Age must be a number between 18 and 65. Received: ${age}`,
    );
  }

  UserNameValidator.validateUserName(req.body.name);

  const lastContact = await DataModel.findOne().sort({ id: -1 });

  const newId = lastContact ? lastContact.id + 1 : 1;

  const worker = new DataModel({
    id: newId,
    name: req.body.name,
    age: req.body.age,
    position: req.body.position,
    department: req.body.department,
    salary: req.body.salary,
    active: req.body.active,
  });

  try {
    const data = await worker.save();
    res.status(201).json(data);
  } catch (err) {
    throw new Api500Error(
      "Worker Creation Error",
      undefined,
      `Error creating worker: ${err.message}`,
    );
  }
});

/* -------------------- FIND ALL -------------------- */
const findAll = AsyncWrapper.wrapAsync(async (req, res) => {
  try {
    const data = await DataModel.find({}, { _id: 0 });
    res.json(data);
  } catch (err) {
    throw new Api404Error(
      "Worker Retrieval Error",
      undefined,
      `Error retrieving workers: ${err.message}`,
    );
  }
});

/* -------------------- FIND ONE -------------------- */
const findOne = AsyncWrapper.wrapAsync(async (req, res) => {
  WorkerIdValidator.validateWorkerId(req.params.id);

  const id = Number(req.params.id);

  try {
    const data = await DataModel.findOne({ id });

    if (!data) {
      return res.status(404).json({
        message: `Not found Worker with id ${id}`,
      });
    }

    res.json(data);
  } catch (err) {
    throw new Api404Error(
      "Worker Retrieval Error",
      undefined,
      `Error retrieving worker with id ${id}: ${err.message}`,
    );
  }
});

/* -------------------- DELETE -------------------- */
const destructionId = AsyncWrapper.wrapAsync(async (req, res) => {
  WorkerIdValidator.validateWorkerId(req.params.id);

  const id = Number(req.params.id);

  try {
    const data = await DataModel.findOneAndDelete({ id });

    if (!data) {
      throw new Api404Error(
        "Worker Not Found",
        undefined,
        `Cannot delete Worker with id=${id}. Maybe Worker was not found!`,
      );
    }

    res.json({ message: "Worker was deleted successfully!" });
  } catch (err) {
    throw new Api500Error(
      "Worker Deletion Error",
      undefined,
      `Could not delete Worker with id=${id}: ${err.message}`,
    );
  }
});

/* -------------------- UPDATE -------------------- */
const updateId = AsyncWrapper.wrapAsync(async (req, res) => {
  const age = Number(req.body.age);

  if (isNaN(age) || age < 18 || age > 65) {
    throw new Api400Error(
      "Invalid Age",
      undefined,
      `Age must be a number between 18 and 65. Received: ${age}`,
    );
  }

  WorkerIdValidator.validateWorkerId(req.params.id);

  const id = Number(req.params.id);

  try {
    const data = await DataModel.findOneAndUpdate(
      { id },
      {
        $set: {
          name: req.body.name,
          age: req.body.age,
          position: req.body.position,
          department: req.body.department,
          salary: req.body.salary,
          active: req.body.active,
        },
      },
      { new: true, runValidators: true },
    );
    if (!data) {
      throw new Api404Error(
        "Worker Not Found",
        undefined,
        `Cannot update Worker with id=${id}. Maybe Worker was not found!`,
      );
    }

    res.json({ message: "Worker was updated successfully!" });
  } catch (err) {
    throw new Api500Error(
      "Worker Update Error",
      undefined,
      `Could not update Worker with id=${id}: ${err.message}`,
    );
  }
});

export default {
  create,
  findAll,
  findOne,
  destructionId,
  updateId,
};
