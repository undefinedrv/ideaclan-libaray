const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const bookSchema = new mongoose.Schema({
    "title" : {
        type : String,
        required: true,
        trim: true
    },
    "author" : {
        type : String,
        required: true,
        trim: true
    },
    "publishedYear" : {
        type : String,
        required: true,
        trim: true
    },
    "isAvailable" : {
        type : Boolean,
        required: true,
        default: 'true'
    },
    "owner": {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
  }
);

const BookModel = mongoose.model("Book", bookSchema);

module.exports = { BookModel };
