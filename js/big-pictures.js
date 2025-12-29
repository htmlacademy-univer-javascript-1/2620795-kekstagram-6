const COMMENTS_PER_LOAD = 5;

let currentComments = [];
let shownCommentsCount = 0;

const createCommentElement = (comment) => {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const p = document.createElement('p');
  p.classList.add('social__text');
  p.textContent = comment.message;

  li.append(img, p);
  return li;
};

const updateCommentCount = () => {
  const bigPicture = document.querySelector('.big-picture');
  const commentCount = bigPicture.querySelector('.social__comment-count');
  const totalComments = currentComments.length;
  commentCount.innerHTML = `${shownCommentsCount} из <span class="comments-count">${totalComments}</span> комментариев`;
};

const showMoreComments = () => {
  const socialComments = document.querySelector('.social__comments');
  const commentsLoader = document.querySelector('.comments-loader');
  const commentsToShow = Math.min(COMMENTS_PER_LOAD, currentComments.length - shownCommentsCount);

  for (let i = shownCommentsCount; i < shownCommentsCount + commentsToShow; i++) {
    const commentElement = createCommentElement(currentComments[i]);
    socialComments.appendChild(commentElement);
  }

  shownCommentsCount += commentsToShow;
  updateCommentCount();

  if (shownCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  }
};

const onLoadCommentsClick = () => {
  showMoreComments();
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
}

function closeBigPicture() {
  const bigPicture = document.querySelector('.big-picture');
  const body = document.body;

  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');

  currentComments = [];
  shownCommentsCount = 0;

  document.removeEventListener('keydown', onDocumentKeydown);
}

const showBigPicture = (photo) => {
  const bigPicture = document.querySelector('.big-picture');
  const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count'); // span внутри счётчика
  const socialComments = bigPicture.querySelector('.social__comments');
  const socialCaption = bigPicture.querySelector('.social__caption');
  const commentCount = bigPicture.querySelector('.social__comment-count');
  const commentsLoader = bigPicture.querySelector('.comments-loader');
  const body = document.body;

  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description;
  likesCount.textContent = photo.likes;
  if (commentsCount) {
    commentsCount.textContent = photo.comments.length;
  }
  socialCaption.textContent = photo.description;

  socialComments.innerHTML = '';
  currentComments = photo.comments;
  shownCommentsCount = 0;

  commentCount.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  updateCommentCount();
  showMoreComments();

  document.addEventListener('keydown', onDocumentKeydown);

  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');
};

const onCloseButtonClick = () => {
  closeBigPicture();
};

const initBigPicture = () => {
  const bigPicture = document.querySelector('.big-picture');
  const closeButton = bigPicture.querySelector('.big-picture__cancel');
  const loadCommentsButton = bigPicture.querySelector('.comments-loader');

  closeButton.addEventListener('click', onCloseButtonClick);
  loadCommentsButton.addEventListener('click', onLoadCommentsClick);
};

export { showBigPicture, initBigPicture };
