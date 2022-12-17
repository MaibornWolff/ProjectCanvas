import cors from "@fastify/cors"
import fastify from "fastify"
import JiraApi from "jira-client"
import fetch from "cross-fetch"
import fastifyEnv from "@fastify/env"

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: string
      CLIENT_ID: string
      CLIENT_SECRET: string
      REDIRECT_URI: string
    }
  }
}

const schema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
    CLIENT_ID: {
      type: "string",
      default: null,
    },
    CLIENT_SECRET: {
      type: "string",
      default: null,
    },
    REDIRECT_URI: {
      type: "string",
      default: null,
    },
  },
}

const options = {
  dotenv: true,
  schema,
}
const server = fastify()

let jira: JiraApi

server.register(cors)
server.register(fastifyEnv, options)
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

async function getAccessToken(code: string) {
  return fetch("https://auth.atlassian.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: server.config.CLIENT_ID,
      client_secret: server.config.CLIENT_SECRET,
      redirect_uri: server.config.REDIRECT_URI,
      code,
    }),
  }).then(async (response) => {
    const { access_token: accessToken } = await response.json()
    return accessToken
  })
}

server.post<{ Body: { code: string } }>("/logincloud", async (request) => {
  const accessToken = await getAccessToken(request.body.code)
  await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(async (response) => {
    console.log(await response.json())
  })
})
