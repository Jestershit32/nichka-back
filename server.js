import express from "express";
import mongoose from "mongoose";
import fs from "fs";

import { registerValidation, loginValidation, postCreateValidation } from "./validation.js";

import checkAuth from "./utils/checkAuth.js"

import * as UserController from "./controllers/UserController.js"
import * as PostController from "./controllers/PostController.js"
import * as ActionController from "./controllers/ActionController.js"
import upload from "./controllers/uploadController.js"


const PORT = 1337;
const nickDB = "admin";
const passwordDB = "admin1337"


mongoose.connect(`mongodb+srv://${nickDB}:${passwordDB}@hranilishe.qimdddk.mongodb.net/diplom?retryWrites=true&w=majority`)
    .then(() => console.log("Есть подключение к БД"))
    .catch((err) => console.log("Ошибка подключения к БД: " + err))


const app = express();





app.use(express.json());


//чтоб смотреть картнки и файлы



app.post("/upload/img", upload("img"), (req, res) => {

    if (!req.file) {
        res.json({
            message: "не удалось загрузить файл"
        })

    }
    res.json({
        success: "true",
        url: `/${req.file.destination}/${req.file.filename}`,
    })

})
app.post("/upload/file", upload("file"), (req, res) => {

    if (!req.file) {
        res.json({
            message: "не удалось загрузить файл"
        })

    }
    res.json({
        success: "true",
        url: `/${req.file.destination}/${req.file.filename}`,
    })

})

app.post("/remove-file", (req, res) => {
    fs.unlink(req.body.URL, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Файл удалён");
        }
    });


})



app.use('/uploads', express.static('uploads'));
app.post('/auth/registration', registerValidation, UserController.register);
app.post('/auth/login', loginValidation, UserController.login);
app.get("/auth/me", checkAuth("nobody"), UserController.getMe);


app.get("/sortBy:sortBy", PostController.getAll)
app.get("/posts/tag/:tag", PostController.getByTag)
app.get("/posts/", PostController.getAll)
app.get("/posts/:id", PostController.getOne)
app.post("/posts", checkAuth("nobody"), postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth("nobody"), PostController.remove)
app.patch("/posts/:id", checkAuth("nobody"), postCreateValidation, PostController.update)




app.get("/user/:id", UserController.getUser)


app.patch("/action/favorites/:id/", checkAuth(), ActionController.addInFavorites);
app.delete("/action/favorites/:id/", checkAuth("nobody"), ActionController.removeInFavorites);

app.get("/tags", PostController.getAllTags)



app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Сервер запущен на порту: " + PORT)
})