import { body } from 'express-validator'

export const registerValidation = [
    body("nickname", "Некорректная длина ника").isLength({ min: 3, max: 20 }),
    body("firstName", "Некорректная длина Имени").isLength({ min: 3, max: 15 }),
    body("lastName", "Некорректная длина Фамилии").isLength({ min: 3, max: 15 }),
    body("password", "Неккоректный пароль").isLength({ min: 4, max: 15 }),
    body("avatarUrl", "Не является ссылкой").optional()
]

export const loginValidation = [
    body("nickname", "Некорректная длина ника").isLength({ min: 3, max: 20 }),
    body("password", "Неккоректный пароль").isLength({ min: 4, max: 15 }),
]



export const postCreateValidation = [
    body("title", "Слишком маленькое название (минимум 3 символа)").isLength({ min: 3 }).isString(),
    body("title", "Слишком большое название (максимум 40 символа)").isLength({ max: 40 }).isString(),

    body("description", "Слишком маленькое описание (минимум 5 символов)").isLength({ min: 5 }).isString(),
    body("description", "Слишком большое описание (максимум 120 символов)").isLength({ max: 120 }).isString(),


    body("tags", "Неверный формат тегов").optional().isArray(),
    // body("fileUrl", "О").isString()
]