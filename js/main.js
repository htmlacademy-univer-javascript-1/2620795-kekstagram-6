import { initGenerators, generatePosts } from './generators.js';
import { renderPictures } from './miniatures.js';
import * as utils from './utils.js';
import * as constants from './constants.js';
import { initBigPicture } from './big-pictures.js';

initGenerators(utils, constants);

const photos = generatePosts(25);

initBigPicture();

renderPictures(photos);
