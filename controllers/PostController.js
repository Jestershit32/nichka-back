import PostModel from '../models/Post.js'
import { validationResult } from "express-validator";

export const getAll = async (req, res) => {
    try {

        const inOnePage = req.params.value ? req.params.value : 10;
        const page = req.params.page ? req.params.page : 1;

        //  else {
        let searchValue = req.params.searchValue !== "all" ? { title: { $regex: req.params.searchValue } } : {};
        // }

        if (req.params.searchValue.slice(0, 3) === "tag") {
            searchValue = { tags: { $regex: req.params.searchValue.slice(3) } }
        }

        if (req.params.userID !== "all") {
            if (req.params.userID.length === 24) {
                searchValue.user = { _id: req.params.userID };
            }
        }
        console.log(searchValue)
        let one = req.params.searchValue.slice(1)
        console.log(one)
        const skipPage = (page - 1) * inOnePage;

        const sortBy = (req) => {
            switch (req.params.sortBy) {
                case "new":
                    return ({
                        createdAt: -1
                    })
                case "old":
                    return {
                        createdAt: 1
                    }
                default:
                    return {
                        _id: 1
                    }
            }
        }

        const posts = await PostModel.find(searchValue).skip(skipPage).limit(inOnePage).sort(sortBy(req)).populate('user', ['nickname', 'firstName', 'lastName', 'avatarUrl', 'rule']).exec()
        const count = await PostModel.find(searchValue).count();

        res.status(200).json({
            countPages: Math.ceil(count / inOnePage),
            posts,
            success: true
        });
    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: "Не удалось получить статьи",
            })
    }

}


export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        let doc = await PostModel.findOneAndUpdate(
            { _id: postId, },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' },
        ).populate('user', { "passwordHash": false }).exec();

        console.log(doc);
        res.status(200).json({
            doc, success: true
        });
    }
    catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: "Не удалось получить статью",
            })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        let post = await PostModel.findOneAndDelete(
            { _id: postId, },
            { returnDocument: 'after' },)

        console.log(post);

        res.status(200).json({
            post, success: true,
        });
    }
    catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: "Не удалось удалить статью",
            })
    }


}

export const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const doc = new PostModel({
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            viewsCount: 0,
            fileUrl: "",
            user: req.userId
        })
        const post = await doc.save();

        res.status(200).json({ post, success: true });
    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: "Не удалось создать документ",
            })
    }

}
export const update = async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const postId = req.params.id


        let doc = await PostModel.findOneAndUpdate(
            { _id: postId, },
            {
                title: req.body.title,
                description: req.body.description,
                tags: req.body.tags,
                viewsCount: req.body.viewsCount,
                fileUrl: req.body.fileUrl,
                user: req.userId
            }, { returnDocument: 'after' },
        )
        console.log(doc);

        res.status(200).json({ post: doc, success: true });
    }
    catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: "Не удалось обновить статью",
            })
    }

}
export const getByTag = async (req, res) => {
    try {
        console.log(req.params.tag)
        const tag = { tags: { $regex: req.params.tag } }

        const posts = await PostModel.find(tag).sort().populate('user', ['nickname', 'firstName', 'lastName', 'avatarUrl', 'rule']).exec()


        res.status(200).json({

            posts, success: true
        });
    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: "Не удалось получить статьи",
            })
    }

}

export const getAllTags = async (req, res) => {
    try {
        // console.log(req.params.tag)
        // const tag = { tags: { $regex: req.params.tag } }

        const tags = await PostModel.distinct("tags")


        res.status(200).json({

            tags, success: true
        });
    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: "Не удалось получить все теги",
            })
    }

}