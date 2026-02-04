import mongoose from "mongoose";

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URI;

export default db;
