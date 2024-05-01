const { ApolloServer, gql } = require('apollo-server');
const axios = require("axios").default;

const typeDefs = gql `
    type Query {
        posts(input: PaginationInput): [Post]!
        post (postId: Int!): Post
        comment (commentId: Int!): Comment
    }

    input PaginationInput{
        page: Int!
        count: Int!
    }
    input CommentInput{
        postId: Int!
        name: String!
        email: String
        body: String
    }

    input postDeleteInput{
        postId: Int!
    } 
    type Mutation {
        createComment(input: CommentInput): Comment
        deletePost(input: postDeleteInput): String
    }

    type Post {
        id: Int,
        title: String
        body: String
        comments(input: PaginationInput): [Comment]
    }

    type Comment {
        id: Int
        name: String
        email: String
        body: String
    }
`
const resolvers = {
    Mutation:{
        createComment: async(_, {input})=>{
            console.log(input);
            const {postId, name, email="unspecified", body="unspecified"} = input
            const {data: result} = await axios.post(`http://localhost:3000/posts/${postId}/comments`, {name, email, body})
            return result
        },
        deletePost: async(_, {input})=>{
            const {postId} = input;
            await axios.delete(`http://localhost:3000/posts/${postId}`)
            return `Deleted ${postId}`
        }
    },
    Query :{
        posts : async(_, args) => {
           const {input: {page, count}} = args
           const {data: posts} = await axios.get(`http://localhost:3000/posts?_page=${page}&_limit=${count}`)
           return posts
        },
        post : async(_, args) => {
           const {data: post} = await axios.get(`http://localhost:3000/posts/${args.postId}`)
           return post
        },
        comment:  async(_,args) => {
            const {data: comments} = await axios.get(`http://localhost:3000/comments/${args.commentId}`)
            return comments
         }
    },
    Post: {
        comments: async(parentValue, args) =>{
            const {input: {page, count}} = args
            const {data: postComments} = await axios.get(`https://jsonplaceholder.typicode.com/posts/${parentValue.id}/comments?_page=${page}&_limit=${count}`)
            return postComments
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen(3005).then(({port})=>{console.log(`Listening on port ${port} ...`);})