const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String
    role: String!
    purchasedBooks: [Book]
    borrowedBooks: [Book]
    accessToken: String
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: String!
    isAvailable: Boolean
    owner: User
  }

  type Query {
    users: [User]
    user(id: ID!): User
    books: [Book]
    book(id: ID!): Book
    searchBooks(title: String!): [Book]
  }

  type Mutation {
    addUser(email: String!, password: String!, role: String!): User
    loginUser(email: String!, password: String!): User
    updateUser( email: String, password: String): User
    deleteUser: User

    addBook(title: String!, author: String!, publishedYear: String!): Book
    updateBook(id: ID!, title: String, author: String, publishedYear: String, isAvailable: Boolean, owner: ID): Book
    deleteBook(id: ID!): Book

    borrowBook(bookId: ID!) : Book
    buyBook(bookId: ID!) : Book
  }
`;

module.exports = typeDefs;
