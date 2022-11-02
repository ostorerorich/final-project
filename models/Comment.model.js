const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        author: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        postId: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.model('Comments', commentSchema)