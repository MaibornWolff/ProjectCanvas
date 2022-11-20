import fastify from "fastify";
import { json } from "stream/consumers";

const server = fastify();

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

// Provide permission information for the current user.
server.get("/rest/api/2/mypermissions", function (request, reply) {
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

// Returns all permissions that are present in the Jira instance - Global, Project and the global ones added by plugins
server.get("/rest/api/2/permissions", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      permissions: {
        BULK_CHANGE: {
          key: "BULK_CHANGE",
          name: "Bulk Change",
          type: "GLOBAL",
          description:
            "Ability to modify a collection of issues at once. For example, resolve multiple issues in one step.",
        },
      },
    });
});

// Returns an application property.
server.get("/rest/api/2/application-properties", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send([
      {
        id: "jira.home",
        key: "jira.home",
        value: "/var/jira/jira-home",
        name: "jira.home",
        desc: "Jira home directory",
        type: "string",
        defaultValue: "",
      },
      {
        id: "jira.clone.prefix",
        key: "jira.clone.prefix",
        value: "CLONE -",
        name: "The prefix added to the Summary field of cloned issues",
        type: "string",
        defaultValue: "CLONE -",
      },
    ]);
});

// Modify an application property via PUT. The "value" field present in the PUT will override the existing value.
server.get(
  "/rest/api/2/application-properties/{id}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        id: "jira.home",
        value: "/var/jira/jira-home",
      });
  }
);

// Returns the properties that are displayed on the "General Configuration > Advanced Settings" page.
server.get(
  "/rest/api/2/application-properties/advanced-settings",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send([
        {
          id: "jira.home",
          key: "jira.home",
          value: "/var/jira/jira-home",
          name: "jira.home",
          desc: "Jira home directory",
          type: "string",
          defaultValue: "",
        },
        {
          id: "jira.clone.prefix",
          key: "jira.clone.prefix",
          value: "CLONE -",
          name: "The prefix added to the Summary field of cloned issues",
          type: "string",
          defaultValue: "CLONE -",
        },
      ]);
  }
);

// Returns the meta-data for an attachment, including the URI of the actual attached file.
server.get("/rest/api/2/attachment/{id}", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      self: "http://www.example.com/jira/rest/api/2.0/attachments/10000",
      filename: "picture.jpg",
      author: {
        self: "http://www.example.com/jira/rest/api/2/user?username=fred",
        key: "JIRAUSER10100",
        name: "fred",
        emailAddress: "fred@example.com",
        avatarUrls: {
          "48x48":
            "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
          "24x24":
            "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
          "16x16":
            "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
          "32x32":
            "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
        },
        displayName: "Fred F. User",
        active: true,
        deleted: false,
        timeZone: "Australia/Sydney",
        locale: "en_AU",
      },
      created: "2022-10-24T15:41:25.586+0000",
      size: 23123,
      mimeType: "image/jpeg",
      content: "http://www.example.com/jira/attachments/10000",
      thumbnail: "http://www.example.com/jira/secure/thumbnail/10000",
    });
});

// Returns the meta information for an attachments, specifically if they are enabled and the maximum upload size allowed.
server.get("/rest/api/2/attachment/meta", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      enabled: true,
      uploadLimit: 1000000,
    });
});

// Returns auditing records filtered using provided parameters
// TODO: parameter handling
server.get("/rest/api/2/auditing/record", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      id: 1,
      summary: "User created",
      remoteAddress: "192.168.1.1",
      authorKey: "administrator",
      created: "2014-03-19T18:45:42.967+0000",
      category: "user management",
      eventSource: "Jira Connect Plugin",
      description: "Optional description",
      objectItem: {
        id: "user",
        name: "user",
        typeName: "USER",
        parentId: "1",
        parentName: "Jira Internal Directory",
      },
      changedValues: [
        {
          fieldName: "email",
          changedFrom: "user@atlassian.com",
          changedTo: "newuser@atlassian.com",
        },
      ],
      associatedItems: [
        {
          id: "jira-software-users",
          name: "jira-software-users",
          typeName: "GROUP",
          parentId: "1",
          parentName: "Jira Internal Directory",
        },
      ],
    });
});

// Returns all system avatars of the given type.
server.get("/rest/api/2/avatar/{type}/system", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      system: [
        {
          id: "1000",
          owner: "fred",
          isSystemAvatar: true,
          isSelected: false,
          isDeletable: false,
          urls: {
            "16x16":
              "http://localhost:8090/jira/secure/useravatar?size=xsmall&avatarId=10040",
            "24x24":
              "http://localhost:8090/jira/secure/useravatar?size=small&avatarId=10040",
            "32x32":
              "http://localhost:8090/jira/secure/useravatar?size=medium&avatarId=10040",
            "48x48":
              "http://localhost:8090/jira/secure/useravatar?avatarId=10040",
          },
          selected: false,
        },
      ],
    });
});

// It gives possibility to manage old node in cluster.
server.get("/rest/api/2/cluster/nodes", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send();
});

// Returns the keys of all properties for the comment identified by the key or by the id.
server.get(
  "/rest/api/2/comment/{commentId}/properties",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        keys: [
          {
            self: "http://www.example.com/jira/rest/api/2/issue/EX-2/properties/issue.support",
            key: "issue.support",
          },
        ],
      });
  }
);

// Returns the value of the property with a given key from the comment identified by the key or by the id.
// The user who retrieves the property is required to have permissions to read the comment.
server.get(
  "/rest/api/2/comment/{commentId}/properties/{propertyKey}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        key: "issue.support",
        value: {
          "hipchat.room.id": "support-123",
          "support.time": "1m",
        },
      });
  }
);

// Returns a project component.
server.get("/rest/api/2/component/{id}", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      self: "http://www.example.com/jira/rest/api/2/component/10000",
      id: "10000",
      name: "Component 1",
      description: "This is a Jira component",
      lead: {
        self: "http://www.example.com/jira/rest/api/2/user?username=fred",
        key: "JIRAUSER10100",
        name: "fred",
        emailAddress: "fred@example.com",
        avatarUrls: {
          "48x48":
            "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
          "24x24":
            "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
          "16x16":
            "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
          "32x32":
            "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
        },
        displayName: "Fred F. User",
        active: true,
        deleted: false,
        timeZone: "Australia/Sydney",
        locale: "en_AU",
      },
      assigneeType: "PROJECT_LEAD",
      assignee: {
        self: "http://www.example.com/jira/rest/api/2/user?username=fred",
        key: "JIRAUSER10100",
        name: "fred",
        emailAddress: "fred@example.com",
        avatarUrls: {
          "48x48":
            "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
          "24x24":
            "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
          "16x16":
            "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
          "32x32":
            "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
        },
        displayName: "Fred F. User",
        active: true,
        deleted: false,
        timeZone: "Australia/Sydney",
        locale: "en_AU",
      },
      realAssigneeType: "PROJECT_LEAD",
      realAssignee: {
        self: "http://www.example.com/jira/rest/api/2/user?username=fred",
        key: "JIRAUSER10100",
        name: "fred",
        emailAddress: "fred@example.com",
        avatarUrls: {
          "48x48":
            "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
          "24x24":
            "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
          "16x16":
            "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
          "32x32":
            "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
        },
        displayName: "Fred F. User",
        active: true,
        deleted: false,
        timeZone: "Australia/Sydney",
        locale: "en_AU",
      },
      isAssigneeTypeValid: false,
      project: "HSP",
      projectId: 10000,
    });
});

// Returns counts of issues related to this component.
server.get(
  "/rest/api/2/component/{id}/relatedIssueCounts",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        self: "http://www.example.com/jira/rest/api/2/component/10000",
        issueCount: 23,
      });
  }
);

// Returns paginated list of filtered active components
server.get("/rest/api/2/component/page", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      self: "http://www.example.com/jira/rest/api/2/component/page?startAt=0&maxResults=2",
      nextPage:
        "http://www.example.com/jira/rest/api/2/component/page?startAt=2&maxResults=2",
      maxResults: 2,
      startAt: 0,
      total: 5,
      isLast: false,
      values: [
        {
          self: "http://www.example.com/jira/rest/api/2/component/10000",
          id: "10000",
          name: "Component 1",
          description: "This is a Jira component",
          lead: {
            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
            key: "JIRAUSER10100",
            name: "fred",
            emailAddress: "fred@example.com",
            avatarUrls: {
              "48x48":
                "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
              "24x24":
                "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
              "16x16":
                "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
              "32x32":
                "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
            },
            displayName: "Fred F. User",
            active: true,
            deleted: false,
            timeZone: "Australia/Sydney",
            locale: "en_AU",
          },
          assigneeType: "PROJECT_LEAD",
          assignee: {
            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
            key: "JIRAUSER10100",
            name: "fred",
            emailAddress: "fred@example.com",
            avatarUrls: {
              "48x48":
                "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
              "24x24":
                "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
              "16x16":
                "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
              "32x32":
                "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
            },
            displayName: "Fred F. User",
            active: true,
            deleted: false,
            timeZone: "Australia/Sydney",
            locale: "en_AU",
          },
          realAssigneeType: "PROJECT_LEAD",
          realAssignee: {
            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
            key: "JIRAUSER10100",
            name: "fred",
            emailAddress: "fred@example.com",
            avatarUrls: {
              "48x48":
                "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
              "24x24":
                "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
              "16x16":
                "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
              "32x32":
                "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
            },
            displayName: "Fred F. User",
            active: true,
            deleted: false,
            timeZone: "Australia/Sydney",
            locale: "en_AU",
          },
          isAssigneeTypeValid: false,
          project: "HSP",
          projectId: 10000,
        },
        {
          self: "http://www.example.com/jira/rest/api/2/component/10000",
          id: "10050",
          name: "PXA",
          description: "This is a another Jira component",
          lead: {
            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
            key: "JIRAUSER10100",
            name: "fred",
            emailAddress: "fred@example.com",
            avatarUrls: {
              "48x48":
                "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
              "24x24":
                "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
              "16x16":
                "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
              "32x32":
                "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
            },
            displayName: "Fred F. User",
            active: true,
            deleted: false,
            timeZone: "Australia/Sydney",
            locale: "en_AU",
          },
          assigneeType: "PROJECT_LEAD",
          assignee: {
            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
            key: "JIRAUSER10100",
            name: "fred",
            emailAddress: "fred@example.com",
            avatarUrls: {
              "48x48":
                "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
              "24x24":
                "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
              "16x16":
                "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
              "32x32":
                "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
            },
            displayName: "Fred F. User",
            active: true,
            deleted: false,
            timeZone: "Australia/Sydney",
            locale: "en_AU",
          },
          realAssigneeType: "PROJECT_LEAD",
          realAssignee: {
            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
            key: "JIRAUSER10100",
            name: "fred",
            emailAddress: "fred@example.com",
            avatarUrls: {
              "48x48":
                "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
              "24x24":
                "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
              "16x16":
                "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
              "32x32":
                "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
            },
            displayName: "Fred F. User",
            active: true,
            deleted: false,
            timeZone: "Australia/Sydney",
            locale: "en_AU",
          },
          isAssigneeTypeValid: false,
          project: "PROJECTKEY",
          projectId: 10000,
        },
      ],
    });
});

// Returns the information if the optional features in Jira are enabled or disabled.
// If the time tracking is enabled, it also returns the detailed information about time tracking configuration.
server.get("/rest/api/2/configuration", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      votingEnabled: true,
      watchingEnabled: true,
      unassignedIssuesAllowed: false,
      subTasksEnabled: false,
      issueLinkingEnabled: true,
      timeTrackingEnabled: true,
      attachmentsEnabled: true,
      timeTrackingConfiguration: {
        workingHoursPerDay: 8,
        workingDaysPerWeek: 5,
        timeFormat: "pretty",
        defaultUnit: "day",
      },
    });
});

// Returns a full representation of the Custom Field Option that has the given id.
server.get("/rest/api/2/customFieldOption/{id}", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      self: "http://localhost:8090/jira/rest/api/2.0/customFieldOption/3",
      value: "Blue",
      disabled: false,
      id: 3,
    });
});

// TODO: parameter handling
server.get("/rest/api/2/customFields", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      id: "customfield_10000",
      name: "New custom field",
      description: "Custom field for picking groups",
      type: "com.atlassian.jira.plugin.system.customfieldtypes:grouppicker",
      searcherKey:
        "com.atlassian.jira.plugin.system.customfieldtypes:grouppickersearcher",
    });
});

// Returns a list of all dashboards, optionally filtering them.
server.get("/rest/api/2/dashboard", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      startAt: 10,
      maxResults: 10,
      total: 143,
      prev: "http://www.example.com/jira/rest/api/2/dashboard?startAt=0",
      next: "http://www.example.com/jira/rest/api/2/dashboard?startAt=10",
      dashboards: [
        {
          id: "10000",
          name: "System Dashboard",
          self: "http://www.example.com/jira/rest/api/2/dashboard/10000",
          view: "http://www.example.com/jira/secure/Dashboard.jspa?selectPageId=10000",
        },
        {
          id: "20000",
          name: "Build Engineering",
          self: "http://www.example.com/jira/rest/api/2/dashboard/20000",
          view: "http://www.example.com/jira/secure/Dashboard.jspa?selectPageId=20000",
        },
      ],
    });
});

// Returns a single dashboard.
server.get("/rest/api/2/dashboard/{id}", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      id: "10000",
      name: "System Dashboard",
      self: "http://www.example.com/jira/rest/api/2/dashboard/10000",
      view: "http://www.example.com/jira/secure/Dashboard.jspa?selectPageId=10000",
    });
});

// Returns the keys of all properties for the dashboard item identified by the id.
server.get(
  "/rest/api/2/dashboard/{dashboardId}/items/{itemId}/properties",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        keys: [
          {
            self: "http://www.example.com/jira/rest/api/2/issue/EX-2/properties/issue.support",
            key: "issue.support",
          },
        ],
      });
  }
);

// Returns the value of the property with a given key from the dashboard item identified by the id.
// The user who retrieves the property is required to have permissions to read the dashboard item.
server.get(
  "/rest/api/2/dashboard/{dashboardId}/items/{itemId}/properties/{propertyKey}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        key: "issue.support",
        value: {
          "hipchat.room.id": "support-123",
          "support.time": "1m",
        },
      });
  }
);

// Creates a zip file containing email templates at local home and returns the file.
server.get("/rest/api/2/email-templates", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send();
});

// Returns a list of root templates mapped with Event Types.
// The list can be used to decide which test emails to send.
server.get("/rest/api/2/email-templates/types", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send();
});

// Returns a list of all fields, both System and Custom
server.get("/rest/api/2/field", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send([
      {
        id: "description",
        name: "Description",
        custom: false,
        orderable: true,
        navigable: true,
        searchable: true,
        clauseNames: ["description"],
        schema: {
          type: "string",
          system: "description",
        },
      },
      {
        id: "summary",
        name: "Summary",
        custom: false,
        orderable: true,
        navigable: true,
        searchable: true,
        clauseNames: ["summary"],
        schema: {
          type: "string",
          system: "summary",
        },
      },
    ]);
});

// Returns a filter given an id
server.get("/rest/api/2/filter/{id}", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      self: "http://www.example.com/jira/rest/api/2/filter/10000",
      id: "10000",
      name: "All Open Bugs",
      description: "Lists all open bugs",
      owner: {
        self: "http://www.example.com/jira/rest/api/2/user?username=fred",
        key: "JIRAUSER10100",
        name: "fred",
        emailAddress: "fred@example.com",
        avatarUrls: {
          "48x48":
            "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
          "24x24":
            "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
          "16x16":
            "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
          "32x32":
            "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
        },
        displayName: "Fred F. User",
        active: true,
        deleted: false,
        timeZone: "Australia/Sydney",
        locale: "en_AU",
      },
      jql: "type = Bug and resolution is empty",
      viewUrl: "http://www.example.com/jira/issues/?filter=10000",
      searchUrl:
        "http://www.example.com/jira/rest/api/2/search?jql=type%20%3D%20Bug%20and%20resolutino%20is%20empty",
      favourite: true,
      sharePermissions: [],
      editable: false,
      subscriptions: {
        size: 0,
        items: [],
        "max-results": 1000,
        "start-index": 0,
        "end-index": 0,
      },
    });
});

// Returns the default columns for the given filter.
// Currently logged in user will be used as the user making such request.
server.get("/rest/api/2/filter/{id}/columns", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      id: "https://docs.atlassian.com/jira/REST/schema/list-of-column-item#",
      title: "List of Column Item",
      type: "array",
      items: {
        title: "Column Item",
        type: "object",
        properties: {
          label: {
            type: "string",
          },
          value: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    });
});

// Returns all share permissions of the given filter.
server.get("/rest/api/2/filter/{id}/permission", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send([
      {
        id: 10000,
        type: "global",
        view: true,
        edit: false,
      },
      {
        id: 10010,
        type: "project",
        project: {
          self: "http://www.example.com/jira/rest/api/2/project/EX",
          id: "10000",
          key: "EX",
          name: "Example",
          avatarUrls: {
            "48x48":
              "http://www.example.com/jira/secure/projectavatar?size=large&pid=10000",
            "24x24":
              "http://www.example.com/jira/secure/projectavatar?size=small&pid=10000",
            "16x16":
              "http://www.example.com/jira/secure/projectavatar?size=xsmall&pid=10000",
            "32x32":
              "http://www.example.com/jira/secure/projectavatar?size=medium&pid=10000",
          },
          projectCategory: {
            self: "http://www.example.com/jira/rest/api/2/projectCategory/10000",
            id: "10000",
            name: "FIRST",
            description: "First Project Category",
          },
        },
        view: true,
        edit: false,
      },
      {
        id: 10010,
        type: "project",
        project: {
          self: "http://www.example.com/jira/rest/api/2/project/MKY",
          id: "10002",
          key: "MKY",
          name: "Example",
          avatarUrls: {
            "48x48":
              "http://www.example.com/jira/secure/projectavatar?size=large&pid=10002",
            "24x24":
              "http://www.example.com/jira/secure/projectavatar?size=small&pid=10002",
            "16x16":
              "http://www.example.com/jira/secure/projectavatar?size=xsmall&pid=10002",
            "32x32":
              "http://www.example.com/jira/secure/projectavatar?size=medium&pid=10002",
          },
          projectCategory: {
            self: "http://www.example.com/jira/rest/api/2/projectCategory/10000",
            id: "10000",
            name: "FIRST",
            description: "First Project Category",
          },
        },
        role: {
          self: "http://www.example.com/jira/rest/api/2/project/MKY/role/10360",
          name: "Developers",
          id: 10360,
          description: "A project role that represents developers in a project",
          actors: [
            {
              id: 10240,
              displayName: "jira-developers",
              type: "atlassian-group-role-actor",
              name: "jira-developers",
            },
          ],
        },
        view: true,
        edit: false,
      },
      {
        id: 10010,
        type: "group",
        group: {
          name: "jira-administrators",
          self: "http://www.example.com/jira/rest/api/2/group?groupname=jira-administrators",
        },
        view: true,
        edit: false,
      },
    ]);
});

// Returns a single share permission of the given filter.
server.get(
  "/rest/api/2/filter/{id}/permission/{permissionId}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        id: 10000,
        type: "global",
        view: true,
        edit: false,
      });
  }
);

// Returns the default share scope of the logged-in user.
server.get("/rest/api/2/filter/defaultShareScope", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      scope: "AUTHENTICATED",
    });
});

// Returns the favourite filters of the logged-in user.
server.get("/rest/api/2/filter/favourite", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send([
      {
        self: "http://www.example.com/jira/rest/api/2/filter/10000",
        id: "10000",
        name: "All Open Bugs",
        description: "Lists all open bugs",
        owner: {
          self: "http://www.example.com/jira/rest/api/2/user?username=fred",
          key: "JIRAUSER10100",
          name: "fred",
          emailAddress: "fred@example.com",
          avatarUrls: {
            "48x48":
              "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
            "24x24":
              "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
            "16x16":
              "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
            "32x32":
              "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
          },
          displayName: "Fred F. User",
          active: true,
          deleted: false,
          timeZone: "Australia/Sydney",
          locale: "en_AU",
        },
        jql: "type = Bug and resolution is empty",
        viewUrl: "http://www.example.com/jira/issues/?filter=10000",
        searchUrl:
          "http://www.example.com/jira/rest/api/2/search?jql=type%20%3D%20Bug%20and%20resolutino%20is%20empty",
        favourite: true,
        sharePermissions: [],
        editable: false,
        subscriptions: {
          size: 0,
          items: [],
          "max-results": 1000,
          "start-index": 0,
          "end-index": 0,
        },
      },
      {
        self: "http://www.example.com/jira/rest/api/2/filter/10010",
        id: "10010",
        name: "My issues",
        description: "Issues assigned to me",
        owner: {
          self: "http://www.example.com/jira/rest/api/2/user?username=fred",
          key: "JIRAUSER10100",
          name: "fred",
          emailAddress: "fred@example.com",
          avatarUrls: {
            "48x48":
              "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
            "24x24":
              "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
            "16x16":
              "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
            "32x32":
              "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
          },
          displayName: "Fred F. User",
          active: true,
          deleted: false,
          timeZone: "Australia/Sydney",
          locale: "en_AU",
        },
        jql: "assignee = currentUser() and resolution is empty",
        viewUrl: "http://www.example.com/jira/issues/?filter=10010",
        searchUrl:
          "http://www.example.com/jira/rest/api/2/search?jql=assignee+in+%28currentUser%28%29%29+and+resolution+is+empty",
        favourite: true,
        sharePermissions: [
          {
            id: 10000,
            type: "global",
            view: true,
            edit: false,
          },
          {
            id: 10010,
            type: "project",
            project: {
              self: "http://www.example.com/jira/rest/api/2/project/EX",
              id: "10000",
              key: "EX",
              name: "Example",
              avatarUrls: {
                "48x48":
                  "http://www.example.com/jira/secure/projectavatar?size=large&pid=10000",
                "24x24":
                  "http://www.example.com/jira/secure/projectavatar?size=small&pid=10000",
                "16x16":
                  "http://www.example.com/jira/secure/projectavatar?size=xsmall&pid=10000",
                "32x32":
                  "http://www.example.com/jira/secure/projectavatar?size=medium&pid=10000",
              },
              projectCategory: {
                self: "http://www.example.com/jira/rest/api/2/projectCategory/10000",
                id: "10000",
                name: "FIRST",
                description: "First Project Category",
              },
            },
            view: true,
            edit: false,
          },
        ],
        editable: false,
        subscriptions: {
          size: 0,
          items: [],
          "max-results": 1000,
          "start-index": 0,
          "end-index": 0,
        },
      },
      {
        name: "All Open Bugs",
        description: "Lists all open bugs",
        jql: "type = Bug and resolution is empty",
        favourite: true,
        sharePermissions: [],
        editable: true,
      },
    ]);
});

// This resource returns a paginated list of users who are members of the specified group and its subgroups.
// Users in the page are ordered by user names.
// User of this resource is required to have sysadmin or admin permissions.
server.get("/rest/api/2/group/member", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      self: "http://www.example.com/jira/rest/api/2/group/member?groupname=jira-administrators&includeInactiveUsers=false&startAt=2&maxResults=2",
      nextPage:
        "http://www.example.com/jira/rest/api/2/group/member?groupname=jira-administrators&includeInactiveUsers=false&startAt=4&maxResults=2",
      maxResults: 2,
      startAt: 3,
      total: 5,
      isLast: false,
      values: [
        {
          self: "http://example/jira/rest/api/2/user?username=fred",
          name: "Fred",
          key: "fred",
          emailAddress: "fred@atlassian.com",
          avatarUrls: {},
          displayName: "Fred",
          active: true,
          timeZone: "Australia/Sydney",
        },
        {
          self: "http://example/jira/rest/api/2/user?username=barney",
          name: "Barney",
          key: "barney",
          emailAddress: "barney@atlassian.com",
          avatarUrls: {},
          displayName: "Barney",
          active: false,
          timeZone: "Australia/Sydney",
        },
      ],
    });
});

// Returns groups with substrings matching a given query.
// This is mainly for use with the group picker,
// so the returned groups contain html to be used as picker suggestions.
// The groups are also wrapped in a single response object that also contains a header
// for use in the picker, specifically Showing X of Y matching groups.
// -The number of groups returned is limited by the system property "jira.ajax.autocomplete.limit"
// -The groups will be unique and sorted.
server.get("/rest/api/2/groups/picker", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      header: "Showing 20 of 25 matching groups",
      total: 25,
      groups: [
        {
          name: "jdog-developers",
          html: "<b>j</b>dog-developers",
        },
        {
          name: "juvenal-bot",
          html: "<b>j</b>uvenal-bot",
        },
      ],
    });
});

// Returns a list of users and groups matching query with highlighting.
// This resource cannot be accessed anonymously.
server.get("/rest/api/2/groupuserpicker", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      id: "https://docs.atlassian.com/jira/REST/schema/users-and-groups#",
      title: "Users And Groups",
      type: "object",
      properties: {
        users: {
          title: "User Picker Results",
          type: "object",
          properties: {
            users: {
              type: "array",
              items: {
                title: "User Picker User",
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  key: {
                    type: "string",
                  },
                  html: {
                    type: "string",
                  },
                  displayName: {
                    type: "string",
                  },
                  avatarUrl: {
                    type: "string",
                    format: "uri",
                  },
                },
                additionalProperties: false,
              },
            },
            total: {
              type: "integer",
            },
            header: {
              type: "string",
            },
          },
          additionalProperties: false,
        },
        groups: {
          title: "Group Suggestions",
          type: "object",
          properties: {
            header: {
              type: "string",
            },
            total: {
              type: "integer",
            },
            groups: {
              type: "array",
              items: {
                title: "Group Suggestion",
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  html: {
                    type: "string",
                  },
                  labels: {
                    type: "array",
                    items: {
                      title: "Group Label",
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                        },
                        title: {
                          type: "string",
                        },
                        type: {
                          type: "string",
                          enum: ["ADMIN", "SINGLE", "MULTIPLE"],
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    });
});

// Summarizes index condition of current node.
// Returned data consists of:
// nodeId - Node identifier.
// reportTime - Time of this report creation.
// issueIndex - Summary of issue index status.
// replicationQueues - Map of index replication queues, where keys represent nodes from which replication operations came from.
// issueIndex can contain:

// indexReadable - If false the end point failed to read data from issue index (check Jira logs for detailed stack trace), otherwise true. When false other fields of issueIndex can be not visible.
// countInDatabase - Count of issues found in database.
// countInIndex - Count of issues found while querying index.
// lastUpdatedInDatabase - Time of last update of issue found in database.
// lastUpdatedInIndex - Time of last update of issue found while querying index.
// replicationQueues's map values can contain:

// lastConsumedOperation - Last executed index replication operation by current node from sending node's queue.
// lastConsumedOperation.id - Identifier of the operation.
// lastConsumedOperation.replicationTime - Time when the operation was sent to other nodes.
// lastOperationInQueue - Last index replication operation in sending node's queue.
// lastOperationInQueue.id - Identifier of the operation.
// lastOperationInQueue.replicationTime - Time when the operation was sent to other nodes.
// queueSize - Number of operations in queue from sending node to current node.
server.get("/rest/api/2/index/summary", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      nodeId: "node1",
      reportTime: "2017-07-08T00:46:16.000+0000",
      issueIndex: {
        indexReadable: true,
        countInDatabase: 12072,
        countInIndex: 10072,
        countInArchive: 2000,
        lastUpdatedInDatabase: "2017-07-08T00:46:16.000+0000",
        lastUpdatedInIndex: "2017-07-07T23:48:53.000+0000",
      },
      replicationQueues: {
        node2: {
          lastConsumedOperation: {
            id: 16822,
            replicationTime: "2017-07-07T23:10:56.000+0000",
          },
          lastOperationInQueue: {
            id: 16822,
            replicationTime: "2017-07-07T23:10:56.000+0000",
          },
          queueSize: 0,
        },
        node3: {
          lastConsumedOperation: {
            id: 16522,
          },
          lastOperationInQueue: {
            id: 16522,
          },
          queueSize: 0,
        },
      },
    });
});

// Returns a full representation of the issue for the given issue key.
server.get("/rest/api/2/issue/{issueIdOrKey}", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      expand:
        "renderedFields,names,schema,operations,editmeta,changelog,versionedRepresentations",
      id: "10002",
      self: "http://www.example.com/jira/rest/api/2/issue/10002",
      key: "EX-1",
      fields: {
        watcher: {
          self: "http://www.example.com/jira/rest/api/2/issue/EX-1/watchers",
          isWatching: false,
          watchCount: 1,
          watchers: [
            {
              self: "http://www.example.com/jira/rest/api/2/user?username=fred",
              name: "fred",
              displayName: "Fred F. User",
              active: false,
            },
          ],
        },
        attachment: [
          {
            self: "http://www.example.com/jira/rest/api/2.0/attachments/10000",
            filename: "picture.jpg",
            author: {
              self: "http://www.example.com/jira/rest/api/2/user?username=fred",
              key: "JIRAUSER10100",
              name: "fred",
              emailAddress: "fred@example.com",
              avatarUrls: {
                "48x48":
                  "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
                "24x24":
                  "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
                "16x16":
                  "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
                "32x32":
                  "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
              },
              displayName: "Fred F. User",
              active: true,
              deleted: false,
              timeZone: "Australia/Sydney",
              locale: "en_AU",
            },
            created: "2022-10-24T15:41:25.586+0000",
            size: 23123,
            mimeType: "image/jpeg",
            content: "http://www.example.com/jira/attachments/10000",
            thumbnail: "http://www.example.com/jira/secure/thumbnail/10000",
          },
        ],
        "sub-tasks": [
          {
            id: "10000",
            type: {
              id: "10000",
              name: "",
              inward: "Parent",
              outward: "Sub-task",
            },
            outwardIssue: {
              id: "10003",
              key: "EX-2",
              self: "http://www.example.com/jira/rest/api/2/issue/EX-2",
              fields: {
                status: {
                  iconUrl:
                    "http://www.example.com/jira//images/icons/statuses/open.png",
                  name: "Open",
                },
              },
            },
          },
        ],
        description: "example bug report",
        project: {
          self: "http://www.example.com/jira/rest/api/2/project/EX",
          id: "10000",
          key: "EX",
          name: "Example",
          avatarUrls: {
            "48x48":
              "http://www.example.com/jira/secure/projectavatar?size=large&pid=10000",
            "24x24":
              "http://www.example.com/jira/secure/projectavatar?size=small&pid=10000",
            "16x16":
              "http://www.example.com/jira/secure/projectavatar?size=xsmall&pid=10000",
            "32x32":
              "http://www.example.com/jira/secure/projectavatar?size=medium&pid=10000",
          },
          projectCategory: {
            self: "http://www.example.com/jira/rest/api/2/projectCategory/10000",
            id: "10000",
            name: "FIRST",
            description: "First Project Category",
          },
        },
        comment: [
          {
            self: "http://www.example.com/jira/rest/api/2/issue/10010/comment/10000",
            id: "10000",
            author: {
              self: "http://www.example.com/jira/rest/api/2/user?username=fred",
              name: "fred",
              displayName: "Fred F. User",
              active: false,
            },
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget venenatis elit. Duis eu justo eget augue iaculis fermentum. Sed semper quam laoreet nisi egestas at posuere augue semper.",
            updateAuthor: {
              self: "http://www.example.com/jira/rest/api/2/user?username=fred",
              name: "fred",
              displayName: "Fred F. User",
              active: false,
            },
            created: "2022-10-24T15:41:25.545+0000",
            updated: "2022-10-24T15:41:25.546+0000",
            visibility: {
              type: "role",
              value: "Administrators",
            },
          },
        ],
        issuelinks: [
          {
            id: "10001",
            type: {
              id: "10000",
              name: "Dependent",
              inward: "depends on",
              outward: "is depended by",
            },
            outwardIssue: {
              id: "10004L",
              key: "PRJ-2",
              self: "http://www.example.com/jira/rest/api/2/issue/PRJ-2",
              fields: {
                status: {
                  iconUrl:
                    "http://www.example.com/jira//images/icons/statuses/open.png",
                  name: "Open",
                },
              },
            },
          },
          {
            id: "10002",
            type: {
              id: "10000",
              name: "Dependent",
              inward: "depends on",
              outward: "is depended by",
            },
            inwardIssue: {
              id: "10004",
              key: "PRJ-3",
              self: "http://www.example.com/jira/rest/api/2/issue/PRJ-3",
              fields: {
                status: {
                  iconUrl:
                    "http://www.example.com/jira//images/icons/statuses/open.png",
                  name: "Open",
                },
              },
            },
          },
        ],
        worklog: [
          {
            self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
            author: {
              self: "http://www.example.com/jira/rest/api/2/user?username=fred",
              name: "fred",
              displayName: "Fred F. User",
              active: false,
            },
            updateAuthor: {
              self: "http://www.example.com/jira/rest/api/2/user?username=fred",
              name: "fred",
              displayName: "Fred F. User",
              active: false,
            },
            comment: "I did some work here.",
            updated: "2022-10-24T15:41:25.593+0000",
            visibility: {
              type: "group",
              value: "jira-developers",
            },
            started: "2022-10-24T15:41:25.593+0000",
            timeSpent: "3h 20m",
            timeSpentSeconds: 12000,
            id: "100028",
            issueId: "10002",
          },
        ],
        updated: 1,
        timetracking: {
          originalEstimate: "10m",
          remainingEstimate: "3m",
          timeSpent: "6m",
          originalEstimateSeconds: 600,
          remainingEstimateSeconds: 200,
          timeSpentSeconds: 400,
        },
      },
      names: {
        watcher: "watcher",
        attachment: "attachment",
        "sub-tasks": "sub-tasks",
        description: "description",
        project: "project",
        comment: "comment",
        issuelinks: "issuelinks",
        worklog: "worklog",
        updated: "updated",
        timetracking: "timetracking",
      },
      schema: {},
    });
});

// Returns all comments for an issue.
// Results can be ordered by the "created" field which means the date a comment was added.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/comment",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        startAt: 0,
        maxResults: 1,
        total: 1,
        comments: [
          {
            self: "http://www.example.com/jira/rest/api/2/issue/10010/comment/10000",
            id: "10000",
            author: {
              self: "http://www.example.com/jira/rest/api/2/user?username=fred",
              name: "fred",
              displayName: "Fred F. User",
              active: false,
            },
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget venenatis elit. Duis eu justo eget augue iaculis fermentum. Sed semper quam laoreet nisi egestas at posuere augue semper.",
            updateAuthor: {
              self: "http://www.example.com/jira/rest/api/2/user?username=fred",
              name: "fred",
              displayName: "Fred F. User",
              active: false,
            },
            created: "2022-10-24T15:41:25.545+0000",
            updated: "2022-10-24T15:41:25.546+0000",
            visibility: {
              type: "role",
              value: "Administrators",
            },
          },
        ],
      });
  }
);

// Returns a single comment.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/comment/{id}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        self: "http://www.example.com/jira/rest/api/2/issue/10010/comment/10000",
        id: "10000",
        author: {
          self: "http://www.example.com/jira/rest/api/2/user?username=fred",
          name: "fred",
          displayName: "Fred F. User",
          active: false,
        },
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget venenatis elit. Duis eu justo eget augue iaculis fermentum. Sed semper quam laoreet nisi egestas at posuere augue semper.",
        updateAuthor: {
          self: "http://www.example.com/jira/rest/api/2/user?username=fred",
          name: "fred",
          displayName: "Fred F. User",
          active: false,
        },
        created: "2022-10-24T15:41:25.545+0000",
        updated: "2022-10-24T15:41:25.546+0000",
        visibility: {
          type: "role",
          value: "Administrators",
        },
      });
  }
);

// Returns the meta data for editing an issue.
// The fields in the editmeta correspond to the fields in the edit screen for the issue.
// Fields not in the screen will not be in the editmeta.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/editmeta",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        fields: {
          summary: {
            required: false,
            schema: {
              type: "array",
              items: "option",
              custom:
                "com.atlassian.jira.plugin.system.customfieldtypes:multiselect",
              customId: 10001,
            },
            name: "My Multi Select",
            fieldId: "customfield_10000",
            operations: ["set", "add"],
            allowedValues: ["red", "blue"],
          },
        },
      });
  }
);

// A REST sub-resource representing the remote issue links on the issue.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/remotelink",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send([
        {
          id: 10000,
          self: "http://www.example.com/jira/rest/api/issue/MKY-1/remotelink/10000",
          globalId: "system=http://www.mycompany.com/support&id=1",
          application: {
            type: "com.acme.tracker",
            name: "My Acme Tracker",
          },
          relationship: "causes",
          object: {
            url: "http://www.mycompany.com/support?id=1",
            title: "TSTSUP-111",
            summary: "Crazy customer support issue",
            icon: {
              url16x16: "http://www.mycompany.com/support/ticket.png",
              title: "Support Ticket",
            },
            status: {
              resolved: true,
              icon: {
                url16x16: "http://www.mycompany.com/support/resolved.png",
                title: "Case Closed",
                link: "http://www.mycompany.com/support?id=1&details=closed",
              },
            },
          },
        },
        {
          id: 10001,
          self: "http://www.example.com/jira/rest/api/issue/MKY-1/remotelink/10001",
          globalId: "system=http://www.anothercompany.com/tester&id=1234",
          application: {
            type: "com.acme.tester",
            name: "My Acme Tester",
          },
          relationship: "is tested by",
          object: {
            url: "http://www.anothercompany.com/tester/testcase/1234",
            title: "Test Case #1234",
            summary: "Test that the submit button saves the thing",
            icon: {
              url16x16:
                "http://www.anothercompany.com/tester/images/testcase.gif",
              title: "Test Case",
            },
            status: {
              resolved: false,
              icon: {
                url16x16:
                  "http://www.anothercompany.com/tester/images/person/fred.gif",
                title: "Tested by Fred Jones",
                link: "http://www.anothercompany.com/tester/person?username=fred",
              },
            },
          },
        },
      ]);
  }
);

// Get the remote issue link with the given id on the issue.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/remotelink/{linkId}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        id: 10000,
        self: "http://www.example.com/jira/rest/api/issue/MKY-1/remotelink/10000",
        globalId: "system=http://www.mycompany.com/support&id=1",
        application: {
          type: "com.acme.tracker",
          name: "My Acme Tracker",
        },
        relationship: "causes",
        object: {
          url: "http://www.mycompany.com/support?id=1",
          title: "TSTSUP-111",
          summary: "Crazy customer support issue",
          icon: {
            url16x16: "http://www.mycompany.com/support/ticket.png",
            title: "Support Ticket",
          },
          status: {
            resolved: true,
            icon: {
              url16x16: "http://www.mycompany.com/support/resolved.png",
              title: "Case Closed",
              link: "http://www.mycompany.com/support?id=1&details=closed",
            },
          },
        },
      });
  }
);

// Get a list of the transitions possible for this issue by the current user,
// along with fields that are required and their types.
// Fields will only be returned if expand=transitions.fields.
// The fields in the metadata correspond to the fields in the transition screen for that transition.
// Fields not in the screen will not be in the metadata.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/transitions",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        expand: "transitions",
        transitions: [
          {
            id: "2",
            name: "Close Issue",
            opsbarSequence: 10,
            to: {
              self: "http://localhost:8090/jira/rest/api/2.0/status/10000",
              description: "The issue is currently being worked on.",
              iconUrl: "http://localhost:8090/jira/images/icons/progress.gif",
              name: "In Progress",
              id: "10000",
              statusCategory: {
                self: "http://localhost:8090/jira/rest/api/2.0/statuscategory/1",
                id: 1,
                key: "in-flight",
                colorName: "yellow",
                name: "In Progress",
              },
            },
            fields: {
              summary: {
                required: false,
                schema: {
                  type: "array",
                  items: "option",
                  custom:
                    "com.atlassian.jira.plugin.system.customfieldtypes:multiselect",
                  customId: 10001,
                },
                name: "My Multi Select",
                fieldId: "customfield_10000",
                hasDefaultValue: false,
                operations: ["set", "add"],
                allowedValues: ["red", "blue", "default value"],
              },
            },
          },
          {
            id: "711",
            name: "QA Review",
            opsbarSequence: 20,
            to: {
              self: "http://localhost:8090/jira/rest/api/2.0/status/5",
              description: "The issue is closed.",
              iconUrl: "http://localhost:8090/jira/images/icons/closed.gif",
              name: "Closed",
              id: "5",
              statusCategory: {
                self: "http://localhost:8090/jira/rest/api/2.0/statuscategory/9",
                id: 9,
                key: "completed",
                colorName: "green",
              },
            },
            fields: {
              summary: {
                required: false,
                schema: {
                  type: "array",
                  items: "option",
                  custom:
                    "com.atlassian.jira.plugin.system.customfieldtypes:multiselect",
                  customId: 10001,
                },
                name: "My Multi Select",
                fieldId: "customfield_10000",
                hasDefaultValue: false,
                operations: ["set", "add"],
                allowedValues: ["red", "blue", "default value"],
              },
              colour: {
                required: false,
                schema: {
                  type: "array",
                  items: "option",
                  custom:
                    "com.atlassian.jira.plugin.system.customfieldtypes:multiselect",
                  customId: 10001,
                },
                name: "My Multi Select",
                fieldId: "customfield_10000",
                hasDefaultValue: false,
                operations: ["set", "add"],
                allowedValues: ["red", "blue", "default value"],
              },
            },
          },
        ],
      });
  }
);

// A REST sub-resource representing the voters on the issue.
server.get("/rest/api/2/issue/{issueIdOrKey}/votes", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      self: "http://www.example.com/jira/rest/api/issue/MKY-1/votes",
      votes: 24,
      hasVoted: true,
      voters: [
        {
          self: "http://www.example.com/jira/rest/api/2/user?username=fred",
          key: "JIRAUSER10100",
          name: "fred",
          emailAddress: "fred@example.com",
          avatarUrls: {
            "48x48":
              "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
            "24x24":
              "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
            "16x16":
              "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
            "32x32":
              "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
          },
          displayName: "Fred F. User",
          active: true,
          deleted: false,
          timeZone: "Australia/Sydney",
          locale: "en_AU",
        },
      ],
    });
});

// Returns the list of watchers for the issue with the given key.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/watchers",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        self: "http://www.example.com/jira/rest/api/2/issue/EX-1/watchers",
        isWatching: false,
        watchCount: 1,
        watchers: [
          {
            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
            name: "fred",
            displayName: "Fred F. User",
            active: false,
          },
        ],
      });
  }
);

// Returns all work logs for an issue.
// Note: Work logs won't be returned if the Log work field is hidden for the project.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/worklog",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        startAt: 0,
        maxResults: 1,
        total: 1,
        worklogs: [
          {
            self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
            author: {
              self: "http://www.example.com/jira/rest/api/2/user?username=fred",
              name: "fred",
              displayName: "Fred F. User",
              active: false,
            },
            updateAuthor: {
              self: "http://www.example.com/jira/rest/api/2/user?username=fred",
              name: "fred",
              displayName: "Fred F. User",
              active: false,
            },
            comment: "I did some work here.",
            updated: "2022-10-24T15:41:25.593+0000",
            visibility: {
              type: "group",
              value: "jira-developers",
            },
            started: "2022-10-24T15:41:25.593+0000",
            timeSpent: "3h 20m",
            timeSpentSeconds: 12000,
            id: "100028",
            issueId: "10002",
          },
        ],
      });
  }
);

// Returns a specific worklog.
// Note: The work log won't be returned if the Log work field is hidden for the project.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/worklog/{id}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
        author: {
          self: "http://www.example.com/jira/rest/api/2/user?username=fred",
          name: "fred",
          displayName: "Fred F. User",
          active: false,
        },
        updateAuthor: {
          self: "http://www.example.com/jira/rest/api/2/user?username=fred",
          name: "fred",
          displayName: "Fred F. User",
          active: false,
        },
        comment: "I did some work here.",
        updated: "2022-10-24T15:41:25.593+0000",
        visibility: {
          type: "group",
          value: "jira-developers",
        },
        started: "2022-10-24T15:41:25.593+0000",
        timeSpent: "3h 20m",
        timeSpentSeconds: 12000,
        id: "100028",
        issueId: "10002",
      });
  }
);

// Returns the metadata for issue types used for creating issues.
// Data will not be returned if the user does not have permission to create issues in that project.
server.get(
  "/rest/api/2/issue/createmeta/{projectIdOrKey}/issuetypes",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        id: "https://docs.atlassian.com/jira/REST/schema/page-of-create-meta-issue-type#",
        title: "Page of Create Meta Issue Type",
        type: "object",
        properties: {
          last: {
            type: "boolean",
          },
          size: {
            type: "integer",
          },
          start: {
            type: "integer",
          },
          total: {
            type: "integer",
          },
          values: {
            type: "array",
            items: {
              title: "Create Meta Issue Type",
              type: "object",
              properties: {
                self: {
                  type: "string",
                },
                id: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                iconUrl: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                subtask: {
                  type: "boolean",
                },
                avatarId: {
                  type: "integer",
                },
                expand: {
                  type: "string",
                },
                fields: {
                  type: "object",
                  patternProperties: {
                    ".+": {
                      title: "Field Meta",
                      type: "object",
                      properties: {
                        required: {
                          type: "boolean",
                        },
                        schema: {
                          title: "Json Type",
                          type: "object",
                          properties: {
                            type: {
                              type: "string",
                            },
                            items: {
                              type: "string",
                            },
                            system: {
                              type: "string",
                            },
                            custom: {
                              type: "string",
                            },
                            customId: {
                              type: "integer",
                            },
                          },
                          additionalProperties: false,
                        },
                        name: {
                          type: "string",
                        },
                        fieldId: {
                          type: "string",
                        },
                        autoCompleteUrl: {
                          type: "string",
                        },
                        hasDefaultValue: {
                          type: "boolean",
                        },
                        operations: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        allowedValues: {
                          type: "array",
                          items: {},
                        },
                        defaultValue: {},
                      },
                      additionalProperties: false,
                      required: ["required"],
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
              required: ["subtask"],
            },
          },
        },
        additionalProperties: false,
        required: ["last", "size", "start"],
      });
  }
);

// Returns the metadata for issue types used for creating issues.
// Data will not be returned if the user does not have permission to create issues in that project.
server.get(
  "/rest/api/2/issue/createmeta/{projectIdOrKey}/issuetypes/{issueTypeId}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        id: "https://docs.atlassian.com/jira/REST/schema/page-of-field-meta#",
        title: "Page of Field Meta",
        type: "object",
        properties: {
          last: {
            type: "boolean",
          },
          size: {
            type: "integer",
          },
          start: {
            type: "integer",
          },
          total: {
            type: "integer",
          },
          values: {
            type: "array",
            items: {
              title: "Field Meta",
              type: "object",
              properties: {
                required: {
                  type: "boolean",
                },
                schema: {
                  title: "Json Type",
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                    },
                    items: {
                      type: "string",
                    },
                    system: {
                      type: "string",
                    },
                    custom: {
                      type: "string",
                    },
                    customId: {
                      type: "integer",
                    },
                  },
                  additionalProperties: false,
                },
                name: {
                  type: "string",
                },
                fieldId: {
                  type: "string",
                },
                autoCompleteUrl: {
                  type: "string",
                },
                hasDefaultValue: {
                  type: "boolean",
                },
                operations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                allowedValues: {
                  type: "array",
                  items: {},
                },
                defaultValue: {},
              },
              additionalProperties: false,
              required: ["required"],
            },
          },
        },
        additionalProperties: false,
        required: ["last", "size", "start"],
      });
  }
);

// Returns suggested issues which match the auto-completion query for the user which executes this request.
// This REST method will check the user's history and the user's browsing context and select this issues,
// which match the query.
server.get("/rest/api/2/issue/picker", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      id: "https://docs.atlassian.com/jira/REST/schema/issue-picker-result#",
      title: "Issue Picker Result",
      type: "object",
      properties: {
        sections: {
          type: "array",
          items: {
            title: "Issue Section",
            type: "object",
            properties: {
              label: {
                type: "string",
              },
              sub: {
                type: "string",
              },
              id: {
                type: "string",
              },
              msg: {
                type: "string",
              },
              issues: {
                type: "array",
                items: {
                  title: "Issue Picker Issue",
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                    },
                    keyHtml: {
                      type: "string",
                    },
                    img: {
                      type: "string",
                    },
                    summary: {
                      type: "string",
                    },
                    summaryText: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    });
});

// Returns the keys of all properties for the issue identified by the key or by the id.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/properties",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        keys: [
          {
            self: "http://www.example.com/jira/rest/api/2/issue/EX-2/properties/issue.support",
            key: "issue.support",
          },
        ],
      });
  }
);

// Returns the value of the property with a given key from the issue identified by the key or by the id.
// The user who retrieves the property is required to have permissions to read the issue.
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/properties/{propertyKey}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        key: "issue.support",
        value: {
          "hipchat.room.id": "support-123",
          "support.time": "1m",
        },
      });
  }
);

// Returns an issue's subtask list
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/subtask",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        id: "https://docs.atlassian.com/jira/REST/schema/response#",
        title: "Response",
        type: "object",
      });
  }
);

// TODO: (likely a boolean value or a "STATUS"?)
server.get(
  "/rest/api/2/issue/{issueIdOrKey}/subtask/move",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send();
  }
);

// Returns an issue link with the specified id.
server.get("/rest/api/2/issueLink/{linkId}", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      id: "10001",
      type: {
        id: "1000",
        name: "Duplicate",
        inward: "Duplicated by",
        outward: "Duplicates",
        self: "http://www.example.com/jira/rest/api/2//issueLinkType/1000",
      },
      inwardIssue: {
        id: "10004",
        key: "PRJ-3",
        self: "http://www.example.com/jira/rest/api/2/issue/PRJ-3",
        fields: {
          status: {
            iconUrl:
              "http://www.example.com/jira//images/icons/statuses/open.png",
            name: "Open",
          },
        },
      },
      outwardIssue: {
        id: "10004L",
        key: "PRJ-2",
        self: "http://www.example.com/jira/rest/api/2/issue/PRJ-2",
        fields: {
          status: {
            iconUrl:
              "http://www.example.com/jira//images/icons/statuses/open.png",
            name: "Open",
          },
        },
      },
    });
});

// Returns a list of available issue link types, if issue linking is enabled.
// Each issue link type has an id, a name and a label for the outward and inward link relationship.
server.get("/rest/api/2/issueLinkType", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      issueLinkTypes: [
        {
          id: "1000",
          name: "Duplicate",
          inward: "Duplicated by",
          outward: "Duplicates",
          self: "http://www.example.com/jira/rest/api/2//issueLinkType/1000",
        },
        {
          id: "1010",
          name: "Blocks",
          inward: "Blocked by",
          outward: "Blocks",
          self: "http://www.example.com/jira/rest/api/2//issueLinkType/1010",
        },
      ],
    });
});

// Returns for a given issue link type id all information about this issue link type.
server.get(
  "/rest/api/2/issueLinkType/{issueLinkTypeId}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        id: "1000",
        name: "Duplicate",
        inward: "Duplicated by",
        outward: "Duplicates",
        self: "http://www.example.com/jira/rest/api/2//issueLinkType/1000",
      });
  }
);

// Returns all issue security schemes that are defined.
server.get("/rest/api/2/issuesecurityschemes", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      issueSecuritySchemes: [
        {
          self: "http://www.example.com/jira/rest/api/2/issuesecurityschemes/1000",
          id: 1000,
          name: "Default Issue Security Scheme",
          description: "Description for the default issue security scheme",
          defaultSecurityLevelId: 10021,
        },
      ],
    });
});

// Returns the issue security scheme along with that are defined.
server.get("/rest/api/2/issuesecurityschemes/{id}", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      self: "http://www.example.com/jira/rest/api/2/issuesecurityschemes/1000",
      id: 1000,
      name: "Default Issue Security Scheme",
      description: "Description for the default issue security scheme",
      defaultSecurityLevelId: 10021,
      levels: [
        {
          self: "http://www.example.com/jira/rest/api/2/securitylevel/10021",
          id: "10021",
          description:
            "Only the reporter and internal staff can see this issue.",
          name: "Reporter Only",
        },
      ],
    });
});

// Returns a list of all issue types visible to the user
server.get("/rest/api/2/issuetype", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send([
      {
        self: "http://localhost:8090/jira/rest/api/2.0/issueType/3",
        id: "3",
        description: "A task that needs to be done.",
        iconUrl: "http://localhost:8090/jira/images/icons/issuetypes/task.png",
        name: "Task",
        subtask: false,
        avatarId: 1,
      },
      {
        self: "http://localhost:8090/jira/rest/api/2.0/issueType/1",
        id: "1",
        description: "A problem with the software.",
        iconUrl: "http://localhost:8090/jira/images/icons/issuetypes/bug.png",
        name: "Bug",
        subtask: false,
        avatarId: 10002,
      },
    ]);
});

// Returns a full representation of the issue type that has the given id.
server.get("/rest/api/2/issuetype/{id}", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      self: "http://localhost:8090/jira/rest/api/2.0/issueType/3",
      id: "3",
      description: "A task that needs to be done.",
      iconUrl: "http://localhost:8090/jira/images/icons/issuetypes/task.png",
      name: "Task",
      subtask: false,
      avatarId: 1,
    });
});

// Returns a list of all alternative issue types for the given issue type id.
// The list will contain these issues types, to which issues assigned to the given issue type can be migrated.
// The suitable alternatives are issue types which are assigned to the same workflow,
// the same field configuration and the same screen scheme.
server.get(
  "/rest/api/2/issuetype/{id}/alternatives",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send([
        {
          self: "http://localhost:8090/jira/rest/api/2.0/issueType/3",
          id: "3",
          description: "A task that needs to be done.",
          iconUrl:
            "http://localhost:8090/jira/images/icons/issuetypes/task.png",
          name: "Task",
          subtask: false,
          avatarId: 1,
        },
        {
          self: "http://localhost:8090/jira/rest/api/2.0/issueType/1",
          id: "1",
          description: "A problem with the software.",
          iconUrl: "http://localhost:8090/jira/images/icons/issuetypes/bug.png",
          name: "Bug",
          subtask: false,
          avatarId: 10002,
        },
      ]);
  }
);

// Returns paginated list of filtered issue types
server.get("/rest/api/2/issuetype/page", function (request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      self: "http://www.example.com/jira/rest/api/2//issueTypes/page?startAt=0&maxResults=2",
      nextPage:
        "http://www.example.com/jira/rest/api/2//issueTypes/page?startAt=2&maxResults=2",
      maxResults: 2,
      startAt: 0,
      total: 5,
      isLast: false,
      values: [
        {
          self: "http://localhost:8090/jira/rest/api/2.0/issueType/3",
          id: "3",
          description: "A task that needs to be done.",
          iconUrl:
            "http://localhost:8090/jira/images/icons/issuetypes/task.png",
          name: "Task",
          subtask: false,
          avatarId: 1,
        },
        {
          self: "http://localhost:8090/jira/rest/api/2.0/issueType/1",
          id: "1",
          description: "A problem with the software.",
          iconUrl: "http://localhost:8090/jira/images/icons/issuetypes/bug.png",
          name: "Bug",
          subtask: false,
          avatarId: 10002,
        },
      ],
    });
});

// Returns the keys of all properties for the issue type identified by the id.
server.get(
  "/rest/api/2/issuetype/{issueTypeId}/properties",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        keys: [
          {
            self: "http://www.example.com/jira/rest/api/2/issue/EX-2/properties/issue.support",
            key: "issue.support",
          },
        ],
      });
  }
);

// Returns the value of the property with a given key from the issue type identified by the id.
// The user who retrieves the property is required to have permissions to view the issue type.
server.get(
  "/rest/api/2/issuetype/{issueTypeId}/properties/{propertyKey}",
  function (request, reply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        key: "issue.support",
        value: {
          "hipchat.room.id": "support-123",
          "support.time": "1m",
        },
      });
  }
);

// ############## GET TEMPLATE ###############
// server.get("", function (request, reply) {
//   reply
//     .code(200)
//     .header("Content-Type", "application/json; charset=utf-8")
//     .send();
// });
