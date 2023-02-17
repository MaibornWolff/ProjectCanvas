export const getRndInteger = (min = 0, max = 100000) =>
  Math.floor(Math.random() * (max - min)) + min
