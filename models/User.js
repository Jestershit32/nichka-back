import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    nickname: {
        unique: [true, "Пользователь с таким ником уже существует в нычке"],
        type: String,
        required: [true, "Никнейм обязательное поле."],
    },

    firstName: {
        type: String,
        required: [true, "Имя обязательное поле."],
    },
    lastName: {
        type: String,
        required: [true, "Фамилия обязательное поле."],
    },

    passwordHash: {
        type: String,
        required: true,
    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        default: [],
    },
    rule: {
        type: String,
        required: true,
        default: "nobody"
    },
    avatarUrl: String

},
    {
        timestamps: true,

    })
export default mongoose.model('User', UserSchema)