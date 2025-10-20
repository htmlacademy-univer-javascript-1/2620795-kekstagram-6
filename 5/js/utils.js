const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomEl = (arr) => arr[getRandomInt(0, arr.length - 1)];

export { getRandomInt, getRandomEl };
