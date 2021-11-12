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
  const IlliaId = mongoose.Types.ObjectId("123123123123");
  const MaxId = mongoose.Types.ObjectId("213213213213");
  const MatveyId = mongoose.Types.ObjectId("321321321321");

  const userData = [
    {
      _id: IlliaId,
      name: "Illya Mikhow",
      email: "mixov2000@gmail.com",
      password: encryptSync("qwerty123"),
    },
    {
      _id: MaxId,
      name: "Max Dmitriev",
      email: "itmaxxx@gmail.com",
      password: encryptSync("qwerty123"),
    },
    {
      _id: MatveyId,
      name: "Matvey Gorelik",
      email: "offiza@sobaka.com",
      password: encryptSync("qwerty123"),
    },
  ];

  const bookData = [
    {
      title: "Каштанка",
      description: "Описание каштанки",
      author: IlliaId,
      path: "uploads\\kashtanka.jpg",
    },
    {
      title: "Каштанка 2",
      description: "Наконец-то вторая часть!",
      author: IlliaId,
      path: "uploads\\kashtanka.jpg",
    },
    {
      title: "Каштанка 3. Возвращение",
      description: "Снова она же..",
      author: MaxId,
      path: "uploads\\kashtanka.jpg",
    },
    {
      title: "Каштанка Макса",
      description: "Каштанка которую добавил Макс",
      author: MaxId,
      path: "uploads\\kashtanka.jpg",
    },
    {
      title: "Удаленная Каштанка Матвея",
      description: "Каштанка которую добавил Матвей, а потом удалил",
      author: MatveyId,
      path: "uploads\\kashtanka.jpg",
      deleted: true,
    },
  ];

  try {
    await User.insertMany(userData);
    await Book.insertMany(bookData);

    console.log("DB succesfully filled with data");
  } catch (err) {
    console.log(err);
    throw "Failed to insert fixture data in database";
  }
};
