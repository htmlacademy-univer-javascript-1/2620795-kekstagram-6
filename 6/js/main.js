import * as utils from './util.js';
import * as constants from './constants.js';
import { initGenerators, generatePosts } from './generators.js';


initGenerators(utils, constants);


const posts = generatePosts(25);
export { posts };

