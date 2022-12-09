import cors from "@fastify/cors"
import fastify from "fastify"
import JiraApi from "jira-client"

const server = fastify()

let jira: JiraApi

server.register(cors)
server.listen({ port: 9090 }, (err) => {
  if (err) {
    process.exit(1)
  }
})

server.post("/login", async () => {
  jira = new JiraApi({
    protocol: "http",
    host: "localhost",
    port: "8080",
    username: "admin",
    password: "admin",
    apiVersion: "2",
    strictSSL: true,
  })
})

server.get("/board", async (request, reply) => {
  const boards = await jira.getAllBoards()
  reply.send(boards)
})
