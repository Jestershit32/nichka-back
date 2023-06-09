import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    },

    viewsCount: {
        type: Number,
        defoult: 0
    },
    fileUrl: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

},
    {
        timestamps: true,

    })
export default mongoose.model('Post', PostSchema)