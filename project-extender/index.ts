import cors from "@fastify/cors"
import fastifyEnv from "@fastify/env"
import fastify from "fastify"
import { ProviderApi } from "./BaseProvider"
import { JiraCloudProviderCreator } from "./JiraCloudProvider"
import { JiraServerProviderCreator } from "./JiraServerProvider"

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
export const server = fastify()

server.register(cors)
server.register(fastifyEnv, options)
server.listen({ port: 9090 }, (err) => {
  if (err) {
    process.exit(1)
  }
})

enum ProviderType {
  JiraServer = "JiraServer",
  JiraCloud = "JiraCloud",
}

interface JiraServerOptions {
  provider: ProviderType
  port: string
  host: string
  username: string
  password: string
}
interface JiraCloudOptions {
  provider: ProviderType
  code: string
}

let pbiProvider: ProviderApi

server.post<{
  Body: JiraCloudOptions & JiraServerOptions
}>("/login", async (request) => {
  if (request.body.provider === ProviderType.JiraServer) {
    pbiProvider = new JiraServerProviderCreator().factoryMethod()
    pbiProvider.login({
      basicLoginOptions: {
        host: request.body.host,
        port: request.body.port,
        username: request.body.username,
        password: request.body.password,
      },
    })
  } else if (request.body.provider === ProviderType.JiraCloud) {
    pbiProvider = new JiraCloudProviderCreator().factoryMethod()
    pbiProvider.login({
      oauthLoginOptions: {
        code: request.body.code,
        clientId: server.config.CLIENT_ID,
        clientSecret: server.config.CLIENT_SECRET,
        redirectUri: server.config.REDIRECT_URI,
      },
    })
  }
})

server.get("/projects", async (request, reply) => {
  const projects = pbiProvider.getProjects()
  console.log(projects)
  reply.send(projects)
})
