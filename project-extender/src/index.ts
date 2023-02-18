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
import { Issue } from "./types"

export * from "./types"

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

let issueProvider: ProviderApi

server.post<{
  Body: { provider: ProviderType } & BasicLoginOptions & OauthLoginOptions
}>("/login", async (request, reply) => {
  if (request.body.provider === ProviderType.JiraServer) {
    issueProvider = new JiraServerProviderCreator().factoryMethod()
    await issueProvider
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
        if (err.message === "Wrong URL") reply.status(403).send()
        reply.status(400).send()
      })
    return
  }
  if (request.body.provider === ProviderType.JiraCloud) {
    issueProvider = new JiraCloudProviderCreator().factoryMethod()
    await issueProvider
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
  await issueProvider
    .logout()
    .then(() => {
      reply.status(204).send()
    })
    .catch(() => {
      reply.status(401).send()
    })
})

server.get("/projects", async (_, reply) => {
  await issueProvider
    .getProjects()
    .then((projects) => {
      reply.status(200).send(projects)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get<{
  Querystring: { projectIdOrKey: string }
}>("/issueTypesByProject", async (request, reply) => {
  await issueProvider
    .getIssueTypesByProject(request.query.projectIdOrKey)
    .then((issueTypes) => {
      reply.status(200).send(issueTypes)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get<{
  Querystring: { projectIdOrKey: string }
}>("/assignableUsersByProject", async (request, reply) => {
  await issueProvider
    .getAssignableUsersByProject(request.query.projectIdOrKey)
    .then((users) => {
      reply.status(200).send(users)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get("/currentUser", async (_, reply) => {
  await issueProvider
    .getCurrentUser()
    .then((user) => {
      reply.status(200).send(user)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get<{ Querystring: { project: string } }>(
  "/boardIdsByProject",
  async (request, reply) => {
    await issueProvider
      .getBoardIds(request.query.project)
      .then((boardIds) => {
        reply.status(200).send(boardIds)
      })
      .catch((error) => reply.status(400).send(error))
  }
)

server.get<{
  Querystring: { boardId: number }
}>("/sprintsByBoardId", async (request, reply) => {
  await issueProvider
    .getSprints(request.query.boardId)
    .then((sprints) => {
      reply.status(200).send(sprints)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get<{
  Querystring: { project: string; boardId: number }
}>("/issuesByProject", (request, reply) => {
  issueProvider
    .getIssuesByProject(request.query.project, request.query.boardId)
    .then((issues) => {
      reply.status(200).send(issues)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get<{
  Querystring: { sprint: number; project: string; boardId: number }
}>("/issuesBySprint", (request, reply) => {
  issueProvider
    .getIssuesBySprint(request.query.sprint)
    .then((issues) => {
      reply.status(200).send(issues)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get<{
  Querystring: { project: string; boardId: number }
}>("/backlogIssuesByProjectAndBoard", (request, reply) => {
  issueProvider
    .getBacklogIssuesByProjectAndBoard(
      request.query.project,
      request.query.boardId
    )
    .then((issues) => {
      reply.status(200).send(issues)
    })
    .catch((error) => reply.status(400).send(error))
})

server.post<{
  Body: { sprint: number; issue: string; rankBefore: string; rankAfter: string }
}>("/moveIssueToSprintAndRank", (request, reply) => {
  issueProvider
    .moveIssueToSprintAndRank(
      request.body.sprint,
      request.body.issue,
      request.body.rankBefore,
      request.body.rankAfter
    )
    .then(() => {
      reply.status(200).send()
    })
    .catch((error) => reply.status(400).send(error))
})

server.post<{
  Body: { issueIdOrKey: string }
}>("/moveIssueToBacklog", (request, reply) => {
  issueProvider
    .moveIssueToBacklog(request.body.issueIdOrKey)
    .then(() => {
      reply.status(200).send()
    })
    .catch((error) => reply.status(400).send(error))
})

server.put<{
  Body: {
    issue: string
    rankBefore: string
    rankAfter: string
  }
}>("/rankIssueInBacklog", (request, reply) => {
  issueProvider
    .rankIssueInBacklog(
      request.body.issue,
      request.body.rankBefore,
      request.body.rankAfter
    )
    .then(() => {
      reply.status(200).send()
    })
    .catch((error) => reply.status(400).send(error))
})

server.post<{
  Body: {
    issue: Issue
  }
}>("/createIssue", (request, reply) => {
  issueProvider
    .createIssue(request.body.issue)
    .then((issueKey) => {
      reply.status(200).send(issueKey)
    })
    .catch((error) => reply.status(400).send(error))
})

server.put<{
  Body: {
    issue: Issue
    issueIdOrKey: string
  }
}>("/editIssue", (request, reply) => {
  issueProvider
    .editIssue(request.body.issue, request.body.issueIdOrKey)
    .then(() => {
      reply.status(200).send()
    })
    .catch((error) => {
      reply.status(400).send(error)
    })
})

server.get<{
  Querystring: { projectIdOrKey: string }
}>("/epicsByProject", (request, reply) => {
  issueProvider
    .getEpicsByProject(request.query.projectIdOrKey)
    .then((epics) => {
      reply.status(200).send(epics)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get("/labels", async (_, reply) => {
  await issueProvider
    .getLabels()
    .then((labels) => {
      reply.status(200).send(labels)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get("/priorities", async (_, reply) => {
  await issueProvider
    .getPriorities()
    .then((priorities) => {
      reply.status(200).send(priorities)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get("/issueTypesWithFieldsMap", async (_, reply) => {
  await issueProvider
    .getIssueTypesWithFieldsMap()
    .then((mapResponse) => {
      reply.status(200).send(mapResponse)
    })
    .catch((error) => reply.status(400).send(error))
})
server.get<{
  Querystring: { issueKey: string; targetStatus: string }
}>("/setStatus", (request, reply) => {
  issueProvider
    .setTransition(request.query.issueKey, request.query.targetStatus)
    .then(() => {
      reply.status(200).send()
    })
})

server.get<{
  Querystring: { issueIdOrKey: string }
}>("/editableIssueFieldsMap", async (request, reply) => {
  await issueProvider
    .getEditableIssueFieldsMap(request.query.issueIdOrKey)
    .then((fields) => {
      reply.status(200).send(fields)
    })
    .catch((error) => reply.status(400).send(error))
})

server.get<{
  Querystring: { issueIdOrKey: string }
}>("/issueReporter", async (request, reply) => {
  await issueProvider
    .getIssueReporter(request.query.issueIdOrKey)
    .then((reporter) => {
      reply.status(200).send(reporter)
    })
    .catch((error) => reply.status(400).send(error))
})
