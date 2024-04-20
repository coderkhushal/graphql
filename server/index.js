const express = require("express")
const { ApolloServer } = require("@apollo/server")
const bodyParser = require("body-parser")
const cors = require("cors")
const { expressMiddleware } = require("@apollo/server/express4")

async function startserver() {
    //making servers and defining schemas of graphql
    const app = express()
    const server = new ApolloServer({
        typeDefs: `

            
            type User{
                id: ID!
                name: String!
                username: String!
                email : String!
                phone : String!
                website: String!
            }
            type Todo{
                id: ID!
                title: String!
                completed: Boolean
                user : User
            }
            type Query{
                getTodos:[Todo]
                getAllUsers:[User]
                getUser(id:ID!) :User
            }
        `,

        resolvers: {
            // if anyone tries to fetch the user of todo 
            Todo:{
                user: async(todo)=>{
                    
                    let res = await fetch(`https://jsonplaceholder.typicode.com/users/${todo.id}`)
                    
                    let data= await res.json()
               
                    return data
                }
            },
            Query: {
                getTodos: async () => {
                    let res = await fetch("https://jsonplaceholder.typicode.com/todos")
                    let data = await res.json()
                    return data
                },
                getAllUsers: async () => {
                    let res = await fetch("https://jsonplaceholder.typicode.com/users")
                    let data = await res.json()
                    return data
                },
                getUser: async (parent, { id }) => {
                    let res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
                    let data = await res.json()
                    return data
                },

            }
        }
    })

    // using middlewares
    app.use(cors())
    app.use(bodyParser.json())

    //starting server 
    await server.start()
    //hanlding graphql requests
    app.use("/graphql", expressMiddleware(server))

    //starting express app
    app.listen(8000, () => {
        console.log("server started on 8000 port")
    })
}
startserver()