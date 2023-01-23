import type {
  MantineThemeOverride,
  Tuple,
  DefaultMantineColor,
} from "@mantine/core"

export const theme: MantineThemeOverride = {
  colors: {
    primaryRed: [
      "#F7A0C9",
      "#F47EB6",
      "#F15FA4",
      "#EF4394",
      "#ED2985",
      "#E71377",
      "#D0116B",
      "#BB0F60",
      "#A80E56",
    ],
    primaryBlue: [
      "#85E9FF",
      "#62E2FF",
      "#42DCFF",
      "#25D7FF",
      "#0AD2FF",
      "#00C3EF",
      "#00B0D7",
      "#009EC2",
      "#008EAF",
    ],
    primaryGreen: [
      "#C8FECE",
      "#A0FDAA",
      "#7BFC89",
      "#5AFB6B",
      "#3CFA50",
      "#1EF935",
      "#07F520",
      "#06DD1D",
      "#05C71A",
    ],
    secondary: [
      "#2A236E",
      "#262064",
      "#231D5B",
      "#201A53",
      "#1D184B",
      "#1A1644",
      "#17143D",
      "#151237",
      "#131032",
    ],
  },
  primaryColor: "primaryBlue",
  defaultRadius: "sm",
  black: "#131032",
  colorScheme: "light",
  defaultGradient: { deg: 90, from: "secondary.1", to: "primaryBlue.3" },
  fontFamily: "Poppins",
  headings: { fontFamily: "Poppins", fontWeight: "bold" },
}

type ExtendedCustomColors =
  | "primaryRed"
  | "primaryBlue"
  | "primaryGreen"
  | "secondary"
  | DefaultMantineColor

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>
  }
}
