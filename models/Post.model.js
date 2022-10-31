const mongoose = require('mongoose')
const { default: slugify } = require('slugify')
const mongoosePaginate = require('mongoose-paginate-v2')

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            default: '/uploads/none.jpg'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

// Middleware .pre()
// TODO: Llevar este middleware a un archivo separado

postSchema.plugin(mongoosePaginate)

postSchema.pre('validate', function(next) {
    if(this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true})
    }
    next()
})

module.exports = mongoose.model('Post', postSchema)