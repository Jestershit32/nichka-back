import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import cors from "cors"

import { registerValidation, loginValidation, postCreateValidation } from "./validation.js";

import checkAuth from "./utils/checkAuth.js"
import PostModel from './models/Post.js'
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




app.use(cors())
app.use(express.json());


//чтоб смотреть картнки и файлы



app.post("/upload/img", checkAuth("nobody"), upload("img"), (req, res) => {

    if (!req.file) {
        res.status(503).json({
            message: "не удалось загрузить файл"
        })

    }
    res.json({
        success: "true",
        url: `/${req.file.destination}/${req.file.filename}`,
    })

})
app.post("/upload/file/:id", checkAuth("nobody"), upload("file"), async (req, res) => {

    let checkFile = await PostModel.findById(req.params.id)
    let doc;
    if (!req.file) {

        if (!checkFile.fileUrl) {
            doc = await PostModel.findOneAndDelete(
                { _id: req.params.id }
            )
        }
        res.status(503).json({
            message: "не удалось загрузить файл",
            doc
        })
    } else {
        doc = await PostModel.findOneAndUpdate(
            { _id: req.params.id },
            { fileUrl: `/${req.file.destination}/${req.file.filename}` },
            { new: true }
        )
        res.json({
            doc,
            success: "true",
            fileUrl: `/${req.file.destination}/${req.file.filename}`,
        })
    }
})

app.post("/remove-file", checkAuth("nobody"), async (req, res) => {
    console.log(req.body.url)
    if (req.body.url.split("/")[1] !== "uploads") {

        res.status(500).json({
            success: "false",
            message: "Ошибка нельзя удалять другие файлы дурак"
        })

    } else {
        await fs.unlink(req.body.url.slice(1), (err) => {
            if (err) {
                res.json({
                    url: req.body.url,
                    success: "false",
                    message: "Ошибка при удалени (возможно файла не существует)"
                })
            } else {
                console.log("Файл удалён");
                res.json({
                    success: "true",
                    message: "файл удален"
                })
            }
        });


    }
})



app.use('/uploads', express.static('uploads'));
app.post('/auth/registration', registerValidation, UserController.register);
app.post('/auth/login', loginValidation, UserController.login);
app.get("/auth/me", checkAuth("nobody"), UserController.getMe);

app.get("/posts/tag/:tag", PostController.getByTag)// не исполььзовал сделал все через поиск всех постов
app.get("/posts/:page/:value/:sortBy/:searchValue/:userID", PostController.getAll)
app.get("/posts/:id", PostController.getOne)
app.post("/posts", checkAuth("nobody"), postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth("nobody"), PostController.remove)
app.patch("/posts/:id", checkAuth("nobody"), postCreateValidation, PostController.update)




app.get("/user/:id", UserController.getUser)


app.patch("/action/favorites/:id/", checkAuth("nobody"), ActionController.addInFavorites);
app.delete("/action/favorites/:id/", checkAuth("nobody"), ActionController.removeInFavorites);

app.get("/tags", PostController.getAllTags)



app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Сервер запущен на порту: " + PORT)
})