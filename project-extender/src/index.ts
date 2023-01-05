import cors from "@fastify/cors"
import fastifyEnv from "@fastify/env"
import fastify, { FastifyRequest } from "fastify"
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
  // Already logged in
  await pbiProvider
    ?.isLoggedIn()
    .then(() => {
      reply.status(200).send()
    })
    // Left empty as this is a pre check
    // Errors will be treated later
    .catch(() => {})

  if (request.body.provider === ProviderType.JiraServer) {
    pbiProvider = new JiraServerProviderCreator().factoryMethod(request.body)
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
      .catch(() => {
        // TODO: add error for what went wrong
        reply.status(500).send()
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
        // TODO: add error for what went wrong
        reply.status(500).send()
      })
    return
  }
  // TODO: add error for unknown provider
  // (maybe through fastify's schema validation, so we don't have to do this manually)
  reply.status(400).send()
})

server.get("/projects", async (_, reply) => {
  reply.send(await pbiProvider.getProjects())
})

server.get(
  "/pbis",
  async (
    req: FastifyRequest<{
      Querystring: { project: string }
    }>,
    reply
  ) => {
    const projectToGet = req.query.project
    // console.log("logging the querystring")
    // console.log(projectToGet)
    // console.log("logging the querystring")
    reply.send(await pbiProvider.getPbis(projectToGet))
  }
)
