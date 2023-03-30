import UserModel from "../models/User.js";
import PostModel from "../models/Post.js";
export const addInFavorites = async (req, res) => {
    try {
        const userId = req.userId;
        const docId = req.params.id;

        let userCheck = await UserModel.find({ "favorites": docId, "_id": userId }).populate("favorites").exec();
        console.log(userCheck);
        if (userCheck.length !== 0) {
            throw "уже есть у вас в изранных"
        }

        let user = await UserModel.findOneAndUpdate({ _id: userId, }, { $push: { "favorites": docId } }, { returnDocument: 'after' },)

        let post = await PostModel.findById({ _id: docId, })
        res.status(200).json({
            user, post, success: true
        });
    }
    catch (err) {
        console.log(err)
        res
            .status(500)
            .json({

                message: err,
            })
    }

}

export const removeInFavorites = async (req, res) => {
    try {
        const userId = req.userId;
        const docId = req.params.id;

        let userCheck = await UserModel.find({ "favorites": docId, "_id": userId }).populate("favorites").exec();

        if (userCheck.length === 0) {
            throw "у вас нет этой записи в избранных"
        }

        let user = await UserModel.findOneAndUpdate({ _id: userId, }, { $pull: { "favorites": docId } }, { returnDocument: 'after' },)
        let post = await PostModel.findById({ _id: docId, })
        console.log(user);
        res.status(200).json({
            post, user, success: true
        });
    }
    catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: err,
            })
    }

}