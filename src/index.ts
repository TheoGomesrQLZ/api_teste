import express from "express";
import { config } from "dotenv";
import path from "path";
import { GetUsersController } from "./controllers/get-users/getUsers";
import { MongoGetUsersRepository } from "./repositories/get-users/mongo-getUsers";
import { MongoClient } from "./database/mongo";
import { MongoCreateUserRepository } from "./repositories/create-user/mongo-createUsers";
import { CreateUserController } from "./controllers/create-user/createUser";
import { MongoUpdateUserRepository } from "./repositories/update-user/mongoUpdateUser";
import { UpdateUserController } from "./controllers/update-user/updateUser";

const main = async () => {
  config();

  const app = express();
  app.use(express.json());

  app.use(express.static(path.join(__dirname,"frontend")));

  await MongoClient.connect();


  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "html", "home.html"));
  });

  app.get("/users", async (req, res) => {
    const mongoGetUsersRepository = new MongoGetUsersRepository();
    const getUsersController = new GetUsersController(mongoGetUsersRepository);

    const { body, statusCode } = await getUsersController.handle();

    res.status(statusCode).send(body);
  });

  app.post("/users", async (req, res) => {
    const mongoCreateUserRepository = new MongoCreateUserRepository();
    const createUserController = new CreateUserController(
      mongoCreateUserRepository,
    );

    const { body, statusCode } = await createUserController.handle({
      body: req.body,
    });

    res.status(statusCode).send(body);
  });

  app.patch('/users/:id', async (req, res) => {
    const mongoUpdateUserRepository = new MongoUpdateUserRepository();
    const updateUserController = new UpdateUserController(mongoUpdateUserRepository);

    const {body, statusCode} =  await updateUserController.handle({
      body: req.body,
      params: req.params
    })

    res.status(statusCode).send(body)
  });


  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`listening on port http://localhost:${port}/`),
  );
};

main();
