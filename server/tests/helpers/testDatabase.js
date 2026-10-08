import mongoose from "mongoose";

const TEST_DB_URI =
  "mongodb://127.0.0.1:27017/mern_internship_challenge_test";

export const connectTestDatabase = async () => {
  await mongoose.connect(TEST_DB_URI);
};

export const clearTestDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
};

export const closeTestDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};