import { Updater } from "use-immer"
import { Case, SubActionGroup } from "../Types"
import { getAllSubActionGroups } from "./utils"

// Case

// export const addCaseFn = (setCases: Updater<Case[]>) => (caseColumn: Case) => {
//   setCases((draft) => {
//     draft.push(caseColumn)
//   })
// }

// export const deleteCaseFn = (setCases: Updater<Case[]>) => (caseId: string) => {
//   setCases((draft) => {
//     const caseColumnIndex = draft.findIndex((c) => c.id === caseId)
//     draft.splice(caseColumnIndex, 1)
//   })
// }

// export const updateCaseFn =
//   (setCases: Updater<Case[]>) =>
//   ({ id, actions, title }: Partial<Case>) => {
//     setCases((draft) => {
//       const caseColumn = draft.find((c) => c.id === id)
//       if (caseColumn && actions) caseColumn.actions = actions
//       if (caseColumn && title) caseColumn.title = title
//     })
//   }

// Action

// export const addActionFn =
//   (setCases: Updater<Case[]>) => (caseId: string, action: Action) => {
//     setCases((draft) => {
//       draft.find((c) => c.id === caseId)?.actions.push(action)
//     })
//   }

// export const updateActionFn =
//   (setCases: Updater<Case[]>) =>
//   ({ id, title, subActionGroups }: Partial<Action>) => {
//     setCases((draft) => {
//       const caseAction = getAllActions(draft).find(
//         (_action) => _action.id === id
//       )
//       if (caseAction && title) caseAction.title = title
//       if (caseAction && subActionGroups)
//         caseAction.subActionGroups = subActionGroups
//     })
//   }

// export const deleteActionFn = (setCases: Updater<Case[]>) => (id: string) => {
//   setCases((draft) => {
//     const caseAction = getAllActions(draft).find((_action) => _action.id === id)

//     if (caseAction) {
//       const caseOfAction = draft.find((_case) =>
//         _case.actions.includes(caseAction)
//       )

//       if (caseOfAction)
//         caseOfAction.actions = remove<Action>(
//           caseOfAction.actions,
//           caseOfAction.actions.findIndex(
//             (action) => action.id === caseAction.id
//           )
//         )
//     }
//   })
// }

// SubAction

// export const addSubActionFn =
//   (setCases: Updater<Case[]>) =>
//   (subActionGroupId: string, subAction: SubAction) => {
//     setCases((draft) => {
//       const subActionGroup = getAllSubActionGroups(draft).find(
//         (_subActionGroup) => _subActionGroup.id === subActionGroupId
//       )
//       if (subActionGroup) subActionGroup.subActions.push(subAction)
//     })
//   }

// export const updateSubActionFn =
//   (setCases: Updater<Case[]>) =>
//   ({ id, title }: Partial<SubAction>) => {
//     setCases((draft) => {
//       const subAction = getAllSubActions(draft).find(
//         (_subAction) => _subAction.id === id
//       )
//       if (subAction && title) subAction.title = title
//     })
//   }

// export const deleteSubActionFn =
//   (setCases: Updater<Case[]>) => (id: string) => {
//     setCases((draft) => {
//       const caseSubAction = getAllSubActions(draft).find(
//         (_subAction) => _subAction.id === id
//       )

//       if (caseSubAction) {
//         const subActionGroup = getAllSubActionGroups(draft).find(
//           (_actionGroup) => _actionGroup.subActions.includes(caseSubAction)
//         )

//         if (subActionGroup)
//           subActionGroup.subActions = remove<SubAction>(
//             subActionGroup.subActions,
//             subActionGroup.subActions.findIndex(
//               (_subAction) => _subAction.id === caseSubAction.id
//             )
//           )
//       }
//     })
//   }

// SubActionGroup

export const updateSubActionGroupFn =
  (setCases: Updater<Case[]>) =>
  ({ id, levelId, subActions }: Partial<SubActionGroup>) => {
    setCases((draft) => {
      const subActionGroup = getAllSubActionGroups(draft).find(
        (_subActionGroup) => _subActionGroup.id === id
      )
      if (subActionGroup && levelId) subActionGroup.levelId = levelId
      if (subActionGroup && subActions) subActionGroup.subActions = subActions
    })
  }
