import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    manager: {
      type: String,
    },
    budget: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const departmentModel = mongoose.model("departments", departmentSchema);

export default departmentModel;
//