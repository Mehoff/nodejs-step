import mongoose from "mongoose";
import { Book } from "../db/schemas/BookSchema.js";
import { User } from "../db/schemas/UserSchema.js";
import { encryptSync } from "../services/bcrypt.js";

export const clearDatabaseData = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (key) await collections[key].deleteMany({});
  }
  console.log("DB cleared");
};

export const fillDatabaseWithFixtures = async () => {
  const bookData = [
    {
      title: "Каштанка",
      description: "Описание каштанки",
      path: "uploads\\kashtanka.jpg",
    },
    {
      title: "Каштанка 2",
      description: "Наконец-то вторая часть!",
      path: "uploads\\kashtanka.jpg",
    },
    {
      title: "Каштанка 3. Возвращение",
      description: "Снова она же..",
      path: "uploads\\kashtanka.jpg",
    },
  ];

  const userData = [
    {
      name: "Illya Mikhow",
      email: "mixov2000@gmail.com",
      password: encryptSync("qwerty123"),
    },
    {
      name: "Max Dmitriev",
      email: "itmaxxx@gmail.com",
      password: encryptSync("qwerty123"),
    },
    {
      name: "Matvey Gorelik",
      email: "offiza@sobaka.com",
      password: encryptSync("qwerty123"),
    },
  ];

  try {
    await Book.insertMany(bookData);
    await User.insertMany(userData);

    console.log("DB succesfully filled with data");
  } catch (err) {
    console.log(err);
    throw "Failed to insert fixture data in database";
  }
};
