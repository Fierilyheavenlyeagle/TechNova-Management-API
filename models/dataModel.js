import mongoose from "mongoose";


const workerSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
    },
    position: {
      type: String,
    },
    department: {
      type: String,
    },
    salary: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const dataModel = mongoose.model("Worker", workerSchema);

export default dataModel;
//