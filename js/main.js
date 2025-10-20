const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.',
  'В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают.',
  'Как можно было поймать такой неудачный момент?!'
];

const NAMES = ['Анна', 'Дмитрий', 'Елена', 'Максим', 'София', 'Евгений', 'Ибрагим', 'Иннокентий'];

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomEl = (arr) => arr[getRandomInt(0, arr.length - 1)];

const generateComment = (id) => ({
  id,
  avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
  message: getRandomEl(MESSAGES),
  name: getRandomEl(NAMES)
});


const generatePost = (id) => ({
  id,
  url: `photos/${id}.jpg`,
  description: `Описание фотографии ${id}`,
  likes: getRandomInt(15, 200),
  comments: Array.from(
    {length: getRandomInt(0, 30)},
    (_, index) => generateComment(id * 100 + index + 1)
  )
});


const generatePosts = (count) => Array.from({length: count}, (_, index) => generatePost(index + 1));
generatePosts(25);

export {generatePosts};
