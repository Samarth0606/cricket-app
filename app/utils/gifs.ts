import type { match_ball_values } from "@prisma/client";

let runsGifs = [
  "y5ArizLngZusQW32TY",
  "kxi5FrBY0EjVCdOkRh",
  "HDqnBKUyQvWuxYTj2f",
];

const matchBallValueGifMap: {
  [key in match_ball_values]: string[];
} = {
  single: [...runsGifs],
  double: [...runsGifs],
  tripple: [...runsGifs],
  dot: [...runsGifs],
  five: [...runsGifs],
  six: [
    "lqe50lZwe90X5OHRAX",
    "U8heOYEzLUxgrjXjlQ",
    "iReASvDfSxQPXzvWpa",
    "WrWUrHuAnaXLMMloz1",
    "yAgZv0nn1cKlEIzW2w",
    "K9WRcsSSzSJHiUavyB",
  ],
  four: [
    "Dt8JhZ9F9u0MywFBoK",
    "zsQ8bk8b3VVBemo6TW",
    "9Yfb0wBEILoc9tXFps",
    "N92WzOu0BbMUnAaUvG",
  ],
  wicket: [
    "99nudz6Aij8TVoRNlQ",
    "1n2yHGTDRGnYExVqGB",
    "UX5XxssLzJPfgoM0Ta",
    "J5GWT5CgzWIEUYtNLO",
    "h6Zm9Rxh3NSqA7Vftw",
  ],
};

const getRandomGif = (value: match_ball_values) => {
  let arr = matchBallValueGifMap[value];
  const randomIndex = Math.floor(Math.random() * arr.length);
  const item = arr[randomIndex];
  return item;
};

export { getRandomGif };
