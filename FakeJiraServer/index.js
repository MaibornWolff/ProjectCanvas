"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)();
server.get("/ping", async (request, reply) => {
    return "pong";
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
// #################################################################
// ##########      FAKE JIRA API IMPLEMENTATION         ############
// #################################################################
server.get("/rest/api/2/mypermissions", function (request, reply) {
    // Your code
    reply
        .code(200)
        .header("Content-Type", "application/json; charset=utf-8")
        .send({
        permissions: {
            EDIT_ISSUE: {
                id: "12",
                key: "EDIT_ISSUES",
                name: "Edit Issues",
                type: "PROJECT",
                description: "Ability to edit issues.",
                havePermission: true,
            },
        },
    });
});
