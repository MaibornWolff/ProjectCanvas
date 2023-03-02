export const defaultStoryMap = [
  {
    id: "a1",
    title: "a1",
    actions: [
      {
        id: "s1",
        title: "action1",
        subActionGroups: [
          {
            id: "sg-1",
            levelId: "level-1",
            subActions: [
              { id: "ss-1", title: "sub-action11" },
              { id: "ss-2", title: "sub-action12" },
            ],
          },
          {
            id: "sg-2",
            levelId: "level-2",
            subActions: [],
          },
        ],
      },
      {
        id: "s2",
        title: "action2",
        subActionGroups: [
          {
            id: "sg-3",
            levelId: "level-1",
            subActions: [
              { id: "ss-3", title: "sub-action21" },
              { id: "ss-4", title: "sub-action22" },
            ],
          },
          {
            id: "sg-4",
            levelId: "level-2",
            subActions: [],
          },
        ],
      },
    ],
  },
  {
    id: "a2",
    title: "a2",
    actions: [
      {
        id: "s3",
        title: "action3",
        subActionGroups: [
          {
            id: "sg-5",
            levelId: "level-1",
            subActions: [],
          },
          {
            id: "sg-6",
            levelId: "level-2",
            subActions: [{ id: "ss-6", title: "sub-action31" }],
          },
        ],
      },
    ],
  },
]
