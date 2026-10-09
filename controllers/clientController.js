
import ClientModel from "../models/clientModel.js";
import AsyncWrapper from "../utils/AsyncWrapper.js";
import {
  Api400Error,
  Api404Error,
  Api500Error,
} from "../utils/custom_error/apiError.js";

const create = AsyncWrapper.wrapAsync(async (req, res) => {
  const name = req.body.name?.trim();

  if (!name) {
    throw new Api400Error(
      "Invalid Name",
      undefined,
      "Client name is required"
    );
  }

  try {
    const last = await ClientModel.findOne().sort({ id: -1 });
    const id = last ? last.id + 1 : 1;

    const client = await ClientModel.create({
      id,
      name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      active: req.body.active,
    });

    res.status(201).json(client);
  } catch (err) {
    throw new Api500Error(
      "Client Creation Error",
      undefined,
      err.message
    );
  }
});

const findAll = AsyncWrapper.wrapAsync(async (req, res) => {
  const clients = await ClientModel.find({}, { _id: 0 });
  res.json(clients);
});

const findOne = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    throw new Api400Error("Invalid ID", undefined, "Invalid client ID");
  }

  const client = await ClientModel.findOne({ id });

  if (!client) {
    throw new Api404Error(
      "Client Not Found",
      undefined,
      `Client ${id} not found`
    );
  }

  res.json(client);
});

const updateId = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    throw new Api400Error("Invalid ID", undefined, "Invalid client ID");
  }

  const allowed = [
    "name", "email", "phone", "company",
    "address", "city", "country", "active"
  ];

  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key))
  );

  const client = await ClientModel.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!client) {
    throw new Api404Error(
      "Client Not Found",
      undefined,
      `Client ${id} not found`
    );
  }

  res.json(client);
});

const destructionId = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    throw new Api400Error("Invalid ID", undefined, "Invalid client ID");
  }

  const client = await ClientModel.findOneAndDelete({ id });

  if (!client) {
    throw new Api404Error(
      "Client Not Found",
      undefined,
      `Client ${id} not found`
    );
  }

  res.json({ message: "Client deleted successfully!" });
});

export default {
  create,
  findAll,
  findOne,
  updateId,
  destructionId,
};
