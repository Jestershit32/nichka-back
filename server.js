import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validation.js";
import checkAuth from "./utils/checkAuth.js"
import * as UserController from "./controllers/UserController.js"
import * as PostController from "./controllers/PostController.js"
import * as ActionController from "./controllers/ActionController.js"


const PORT = 1337;
const nickDB = "admin";
const passwordDB = "admin1337"


mongoose.connect(`mongodb+srv://${nickDB}:${passwordDB}@hranilishe.qimdddk.mongodb.net/diplom?retryWrites=true&w=majority`)
    .then(() => console.log("Есть подключение к БД"))
    .catch((err) => console.log("Ошибка подключения к БД: " + err))


const app = express();
app.use(express.json());


app.post('/auth/registration', registerValidation, UserController.register);
app.post('/auth/login', loginValidation, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);


app.get("/sortBy:sortBy", PostController.getAll)
app.get("/posts/tag/:tag", PostController.getByTag)
app.get("/posts/", PostController.getAll)
app.get("/posts/:id", PostController.getOne)
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove)
app.patch("/posts/:id", checkAuth, postCreateValidation, PostController.update)




app.get("/user/:id", UserController.getUser)


app.patch("/action/favorites/:id/", checkAuth, ActionController.addInFavorites);
app.delete("/action/favorites/:id/", checkAuth, ActionController.removeInFavorites);

app.get("/tags", PostController.getAllTags)



app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Сервер запущен на порту: " + PORT)
})