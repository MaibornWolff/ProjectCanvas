import {Stack} from "@mantine/core";
import {Issue} from "../../../types";
import {IssueCard} from "../BacklogView/Issue/IssueCard";
import {EpicCard} from "./EpicCard";


export function EpicWrapper({
    epics,
}: {
    epics: Issue[]
}){
    return (
        <Stack
        spacing={"sm"}>
            {epics.map((epic: Issue, index) => (
                  <EpicCard {...epic} key={epic.issueKey} index={index} />
            ))}
        </Stack>
    )
}