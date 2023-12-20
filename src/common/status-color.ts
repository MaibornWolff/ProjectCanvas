import { MantineColor } from "@mantine/styles";
import { StatusType } from "../../types/status";

export const getStatusTypeColor = (statusType: StatusType): MantineColor => {
  switch (statusType) {
    case StatusType.TODO:
      return "gray.6"
    case StatusType.IN_PROGRESS:
      return "blue.8"
    case StatusType.DONE:
      return "green.9"
    default:
      return "gray.6"
  }
}