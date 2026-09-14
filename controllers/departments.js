import DepartmentModel from "../models/departmentModel.js";
import AsyncWrapper from "../utils/AsyncWrapper.js";
import {
  Api404Error,
  Api500Error,
  Api400Error,
} from "../utils/custom_error/apiError.js";

/* -------------------- CREAR -------------------- */
const create = AsyncWrapper.wrapAsync(async (req, res) => {
  if (!req.body.name || req.body.name.trim() === "") {
    throw new Api400Error(
      "Invalid Name",
      undefined,
      "Department name is required",
    );
  }

  const lastDepartment = await DepartmentModel.findOne().sort({ id: -1 });
  const newId = lastDepartment ? lastDepartment.id + 1 : 1;

  const department = new DepartmentModel({
    id: newId,
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    manager: req.body.manager,
    budget: req.body.budget,
    active: req.body.active,
  });

  try {
    const data = await department.save();
    res.status(201).json(data);
  } catch (err) {
    throw new Api500Error(
      "Department Creation Error",
      undefined,
      `Error creating department: ${err.message}`,
    );
  }
});

/* -------------------- FIND ALL -------------------- */
const findAll = AsyncWrapper.wrapAsync(async (req, res) => {
  try {
    const data = await DepartmentModel.find({}, { _id: 0 });
    res.json(data);
  } catch (err) {
    throw new Api500Error(
      "Department Retrieval Error",
      undefined,
      `Error retrieving departments: ${err.message}`,
    );
  }
});

/* -------------------- FIND ONE -------------------- */
const findOne = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new Api400Error(
      "Invalid ID",
      undefined,
      "Department ID must be a number",
    );
  }

  try {
    const data = await DepartmentModel.findOne({ id });

    if (!data) {
      throw new Api404Error(
        "Department Not Found",
        undefined,
        `Not found Department with id ${id}`,
      );
    }

    res.json(data);
  } catch (err) {
    throw new Api500Error(
      "Department Retrieval Error",
      undefined,
      `Error retrieving department with id ${id}: ${err.message}`,
    );
  }
});

/* -------------------- DELETE -------------------- */
const destructionId = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new Api400Error(
      "Invalid ID",
      undefined,
      "Department ID must be a number",
    );
  }

  try {
    const data = await DepartmentModel.findOneAndDelete({ id });

    if (!data) {
      throw new Api404Error(
        "Department Not Found",
        undefined,
        `Cannot delete Department with id=${id}. Maybe it was not found!`,
      );
    }

    res.json({ message: "Department was deleted successfully!" });
  } catch (err) {
    throw new Api500Error(
      "Department Deletion Error",
      undefined,
      `Could not delete Department with id=${id}: ${err.message}`,
    );
  }
});

/* -------------------- UPDATE -------------------- */
const updateId = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new Api400Error(
      "Invalid ID",
      undefined,
      "Department ID must be a number",
    );
  }

  try {
    const data = await DepartmentModel.findOneAndUpdate(
      { id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          location: req.body.location,
          manager: req.body.manager,
          budget: req.body.budget,
          active: req.body.active,
        },
      },
      { new: true, runValidators: true },
    );

    if (!data) {
      throw new Api404Error(
        "Department Not Found",
        undefined,
        `Cannot update Department with id=${id}. Maybe it was not found!`,
      );
    }

    res.json({ message: "Department was updated successfully!" });
  } catch (err) {
    throw new Api500Error(
      "Department Update Error",
      undefined,
      `Could not update Department with id=${id}: ${err.message}`,
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
//