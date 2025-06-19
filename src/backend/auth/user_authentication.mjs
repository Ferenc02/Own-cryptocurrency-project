import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const validatePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

const mongooseURI = "mongodb://127.0.0.1:27017/db/users";

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
