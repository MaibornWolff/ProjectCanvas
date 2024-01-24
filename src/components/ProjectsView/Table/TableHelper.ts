import { Project } from "types";
import { keys } from "@mantine/core";

export function filterData(data: Project[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key]!.toLowerCase().includes(query))
  );
}

export function sortData(
  data: Project[],
  payload: {
    sortBy: keyof Project | null;
    reversed: boolean;
    search: string;
  }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (sortBy in a && sortBy in b) {
        if (payload.reversed) {
          return b[sortBy]!.localeCompare(a[sortBy] || "");
        }

        return a[sortBy]!.localeCompare(b[sortBy] || "");
      }
      return 0;
    }),
    payload.search
  );
}
