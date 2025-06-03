import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:bptr3Vkao8PdM3SK@namastenode.pwjiryy.mongodb.net/devTinder"
  );
};
