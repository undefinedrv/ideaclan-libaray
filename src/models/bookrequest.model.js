const bookRequestSchema = new mongoose.Schema({
    "requester" : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    "book" : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    "currentOwner":{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    "status" : {
        type : String,
        enum: ["pending", "approved", "denied"],
        default: "pending"
    }
},{
    timestamps : true,
})

const BookRequestModel = mongoose.model("BookRequest", bookRequestSchema)

module.exports = {BookRequestModel}
