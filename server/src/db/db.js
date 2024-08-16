import mongoose from "mongoose";

const connectionUri =
  "mongodb+srv://aswani:aswani100aswani@chatdb.lbd6auj.mongodb.net/Node-Chat?retryWrites=true&w=majority&appName=ChatDB";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(connectionUri);
    console.log("MOngo DB Connected", connectionInstance.connection.host);
  } catch (error) {
    console.log("Mongo error", error);
    process.exit(1); //exit the process
  }
};

export default connectDB;
