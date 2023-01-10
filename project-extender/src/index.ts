import cors from "@fastify/cors"
import fastifyEnv from "@fastify/env"
import fastify from "fastify"
import { options } from "./FastifyEnvConfig"
import {
  ProviderApi,
  BasicLoginOptions,
  OauthLoginOptions,
} from "./providers/base-provider"
import { JiraCloudProviderCreator } from "./providers/jira-cloud-provider"
import { JiraServerProviderCreator } from "./providers/jira-server-provider"

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

let pbiProvider: ProviderApi

server.post<{
  Body: { provider: ProviderType } & BasicLoginOptions & OauthLoginOptions
}>("/login", async (request, reply) => {
  if (request.body.provider === ProviderType.JiraServer) {
    pbiProvider = new JiraServerProviderCreator().factoryMethod()
    await pbiProvider
      .login({
        basicLoginOptions: {
          url: request.body.url!,
          username: request.body.username,
          password: request.body.password,
        },
      })
      .then(() => {
        reply.status(200).send()
      })
      .catch((err) => {
        if (err.message === "Wrong Username or Password") {
          reply.code(401).send()
        }

        reply.status(403).send()
      })
    return
  }
  if (request.body.provider === ProviderType.JiraCloud) {
    pbiProvider = new JiraCloudProviderCreator().factoryMethod()
    await pbiProvider
      .login({
        oauthLoginOptions: {
          code: request.body.code,
          clientId: server.config.CLIENT_ID,
          clientSecret: server.config.CLIENT_SECRET,
          redirectUri: server.config.REDIRECT_URI,
        },
      })
      .then(() => {
        reply.status(200).send()
      })
      .catch(() => {
        reply.status(500).send()
      })
    return
  }
  reply.status(400).send()
})

server.post<{
  Body: {
    provider: ProviderType
    username: string
    password: string
    url: string
  }
}>("/logout", async (request, reply) => {
  await pbiProvider
    .logout()
    .then(() => {
      reply.status(204).send()
    })
    .catch(() => {
      reply.status(401).send()
    })
})
server.get("/projects", async (_, reply) => {
  reply.send(await pbiProvider.getProjects())
})
