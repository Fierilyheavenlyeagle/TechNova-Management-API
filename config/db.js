import mongoose from "mongoose";
import dns from "node:dns";

// Configurar servidores DNS para MongoDB Atlas
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;

    // Verificar que exista la conexión
    if (!dbURI) {
      throw new Error("MONGODB_URI is not defined");
    }

    console.log("Conectando a MongoDB Atlas...");

    // Conectar a la base de datos
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB connected ✅");
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
