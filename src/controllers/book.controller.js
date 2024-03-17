const { BookModel } = require("../models/book.model");
const { UserModel } = require("../models/user.model");


const addNewBook = async (bookData)=>{
    const { title, author, publishedYear} = bookData;

    try {
        if(!title || !author || !publishedYear){
            throw new Error("All fields are required, Please add all reqired infromastion");
        }

        const newBook = await BookModel.create({ title, author, publishedYear});
        if(!newBook){
            throw Error("Unable to create new book at that moment");
        }

        return newBook;
    } catch (error) {
        throw error;
    }
}

const updateBook = async (data) => {
    const { id, title, author, publishedYear } = data;

    const updates = {};
    if (title) updates.title = title;
    if (author) updates.author = author;
    if (publishedYear) updates.publishedYear = publishedYear;

    try {
        const updatedBook = await BookModel.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedBook) {
            throw new Error("Book not found or unable to update the book right now");
        }

        return updatedBook;
    } catch (error) {
        throw error;
    }
};


const deleteBook = async (id)=>{
    try {
       const deletedBook =  await BookModel.findByIdAndDelete(id);

       if(!deletedBook){
         throw Error("Unable to delete book at that moment");
       }

       return deletedBook;
    } catch (error) {
        throw error
    }
}

const getSingleBook = async (id) => {
    if (!id) {
      throw new Error("id not found");
    }
    try {
      const book = await BookModel.findById(id).populate("owner");
      if (!book) {
        throw new Error("Book not found");
      }
  
      return book;
    } catch (error) {
      throw error;
    }
};
  
const getBooks = async () => {
    try {
      const Books = await BookModel.find().populate("owner");
      if (!Books) {
        throw new Error("Unable to access Books right now");
      }
  
      return Books;
    } catch (error) {
      throw error;
    }
};

const searchBook = async (title) => {
    try {
        const books = await BookModel.find({ "title": new RegExp(title, 'i') });
        if (!books) {
            throw new Error("No books found with the given title");
        }
        return books;
    } catch (error) {
        throw error;
    }
}

const borrowBook = async(bookId, context)=>{
    try {
        if(!context.user){
            throw new Error('You must be logged in to do this');
        }

        const book = await BookModel.findById(bookId);
        if (!book.isAvailable) {
            throw new Error('Book is not available for borrowing');
        }
        
        const user = await UserModel.findById(context.user._id);
        if(!user){
            throw new Error("User not found, please login again");
        }

        user.borrowedBooks.push(book);
        book.isAvailable = false;
        book.owner = context.user._id;

        await user.save();
        await book.save();

        const updatedbook = await BookModel.findById(bookId).populate('owner');
        return updatedbook;
    } catch (error) {
        throw error
    }
}

const buyBook = async (bookId, context)=>{
    try {
        if(!context.user){
            throw new Error('You must be logged in to do this');
        }
        const book = await BookModel.findById(bookId);
        if (!book.isAvailable) {
            throw new Error('Book is not available for purchase');
        
        }

        const user = await UserModel.findById(context.user._id);
        if(!user){
            throw new Error("User not found, please login again");
        }

        user.purchasedBooks.push(book);
        book.isAvailable = false;
        book.owner = context.user._id;

        await user.save();
        await book.save();

        const updatedbook = await BookModel.findById(bookId).populate('owner');
        return updatedbook;
    } catch (error) {
        throw error
    }
}
 
module.exports = {addNewBook,updateBook,deleteBook, getBooks, getSingleBook,searchBook, borrowBook, buyBook}