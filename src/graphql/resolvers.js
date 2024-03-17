const {RegisterUser, LoginUser, DeleteUser, updateUser, getUserProfile, getAllUser}= require("../controllers/user.controller")
const {addNewBook,updateBook,deleteBook, getBooks, getSingleBook, searchBook, borrowBook, buyBook} = require("../controllers/book.controller");
const authorization = require("../middleware/authorization.middleware");


const resolvers = {
    Query: {
        users: async () => { return await getAllUser()},
        user: async (_, { id }) => {return await getUserProfile(id)},

        books: async () => {return await getBooks(); },
        book: async (_, { id }) => {return await getSingleBook(id);},
        searchBooks: async (_, { title }) => {return await searchBook(title)},
    },
    Mutation: {
        addUser: async (_, { email, password, role }) => { return await RegisterUser({ email, password, role })},
        loginUser : async (_, {email,password}, context)=> {return await LoginUser({email,password}, context)},
        updateUser: async (_, {email, password }, context) => { return await updateUser({ email, password }, context) },
        deleteUser: async (_, {}, context) => {return await DeleteUser(context)},


        addBook: async (_, { title, author, publishedYear}, context) => {
            if(!authorization(context, "Admin")){
                return await addNewBook({ title, author, publishedYear})
            }
        },
        updateBook: async (_, { id, title, author, publishedYear}, context) => {
            if(!authorization(context, "Admin")){   
                return await updateBook({id, title, author, publishedYear})
            }
        },
        deleteBook: async (_, { id }, context) => {
            if(!authorization(context, "Admin")){
                return await deleteBook(id)
            }
        },

        borrowBook: async (_, {bookId}, context) =>{ return await borrowBook(bookId, context)},
        buyBook: async (_, {bookId}, context) => {return await buyBook(bookId, context)},
    },
};

module.exports = resolvers;
