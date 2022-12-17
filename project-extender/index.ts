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

async function redirectToJiraCloud() {
  const CLIENT_ID = "511A0SDAnrGJxxw4hrwYa2SOsRzpEbNC"
  const SCOPE =
    "read:me%20read:jira-user%20manage:jira-configuration%20read:jira-work%20read:account%20manage:jira-project%20manage:jira-configuration%20write:jira-work%20manage:jira-webhook%20manage:jira-data-provider"
  const REDIRECT_URI = "http://localhost:5173"
  await fetch(
    `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=consent`
  ).then((response) => response.json())
}

server.get("/logincloud", async () => {
  await redirectToJiraCloud()
})
