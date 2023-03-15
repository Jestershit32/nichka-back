import UserModel from "../models/User.js";
export const addInFavorites = async (req, res) => {
    try {
        const userId = req.userId;
        const docId = req.params.id;



        let user = await UserModel.findOneAndUpdate({ _id: userId, }, { $push: { "favorites": docId } }, { returnDocument: 'after' },)

        console.log(user);
        res.status(200).json({
            user, success: true
        });
    }
    catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: "Не удалось Добавить в избранное",
            })
    }

}

export const removeInFavorites = async (req, res) => {
    try {
        const userId = req.userId;
        const docId = req.params.id;

        let user = await UserModel.findOneAndUpdate({ _id: userId, }, { $pull: { "favorites": docId } }, { returnDocument: 'after' },)

        console.log(user);
        res.status(200).json({
            user, success: true
        });
    }
    catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: "Не удалось Добавить в избранное",
            })
    }

}