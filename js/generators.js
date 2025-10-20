let utilFunctions, constants;

const initGenerators = (utils, consts) => {
  utilFunctions = utils;
  constants = consts;
};

const generateComment = (id) => ({
  id,
  avatar: `img/avatar-${utilFunctions.getRandomInt(1, 6)}.svg`,
  message: utilFunctions.getRandomEl(constants.MESSAGES),
  name: utilFunctions.getRandomEl(constants.NAMES)
});

const generatePost = (id) => ({
  id,
  url: `photos/${id}.jpg`,
  description: `Описание фотографии ${id}`,
  likes: utilFunctions.getRandomInt(15, 200),
  comments: Array.from(
    {length: utilFunctions.getRandomInt(0, 30)},
    (_, index) => generateComment(id * 100 + index + 1)
  )
});

const generatePosts = (count) => Array.from({length: count}, (_, index) => generatePost(index + 1));

export { initGenerators, generatePosts };
