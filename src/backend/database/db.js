import mongoose from "mongoose";

const mongooseURI = "mongodb://127.0.0.1:27017/db";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(mongooseURI);

    if (conn) {
      console.log(`Database is connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(error);
  }
};

export default connectDb;
