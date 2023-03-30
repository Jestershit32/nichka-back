import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/User.js"



const TOKEN_CODE = "purrweb"


export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const NicknameCheck = await UserModel.findOne({ nickname: req.body.nickname })

        if (NicknameCheck) {
            return res.status(404).json(
                {

                    message: "возможно пользователь с таким никнеймом уже существует",
                }
            )
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const Hash = await bcrypt.hash(password, salt);


        const doc = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nickname: req.body.nickname,
            passwordHash: Hash,
            avatarUrl: req.body.avatarUrl
        })

        const user = await doc.save();


        const token = jwt.sign({
            _id: user._id,
            rule: user.rule
        },
            TOKEN_CODE,
            {
                expiresIn: '30d',
            },
        )

        const { passwordHash, ...userDate } = user._doc;


        res.json({
            ...userDate,
            token
        }
        )

    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Не удалосьь создать пользователя"
        })
    }

}
export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ nickname: req.body.nickname })

        if (!user) {
            return res.status(403).json({
                message: "Неверный логин или пароль",
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(403).json({
                message: "Неверный логин или пароль",
            })
        }

        const token = jwt.sign({
            _id: user._id,
            rule: user.rule
        },
            TOKEN_CODE,
            {
                expiresIn: '30d',
            },
        )
        const { passwordHash, favorites, ...userDate } = user._doc;

        res.json({
            ...userDate,
            token
        }
        )

    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: "Не удалось войти",
            })

    }


}
export const getMe = async (req, res) => {
    try {

        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            })
        }

        const { passwordHash, ...userDate } = user._doc;


        res.json(userDate)



    } catch (err) {
        return res
            .status(404)
            .json({
                message: "Нет доступа",
            })
    }
}
export const getUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await UserModel.findById(userId, { "passwordHash": false }).populate("favorites").exec();

        if (!user) {
            return res.status(404).json({
                message: "пользователь не найден"
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (err) {

    }

}