import { useComputedColorScheme } from "@mantine/core";

export function useColorScheme(): "light" | "dark" {
  return useComputedColorScheme('light', { getInitialValueInEffect: true })
}