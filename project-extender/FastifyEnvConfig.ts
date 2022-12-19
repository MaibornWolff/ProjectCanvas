declare module "fastify" {
  interface FastifyInstance {
    config: {
      CLIENT_ID: string
      CLIENT_SECRET: string
      REDIRECT_URI: string
    }
  }
}

const schema = {
  type: "object",
  properties: {
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

export const options = {
  dotenv: true,
  schema,
}
