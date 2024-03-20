import { MantineColor } from "@mantine/core";
import { StatusType } from "@canvas/types";

export const getStatusTypeColor = (statusType: StatusType): MantineColor => {
  switch (statusType) {
    case StatusType.TODO:
      return "gray.6";
    case StatusType.IN_PROGRESS:
      return "blue.8";
    case StatusType.DONE:
      return "green.9";
    default:
      return "gray.6";
  }
};
