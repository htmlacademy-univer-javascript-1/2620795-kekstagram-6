import { initImageEditor, resetImageEditor } from './edit-picture.js';
import { sendData } from './api.js';
import { showErrorMessage, showSuccessMessage } from './messages.js';

const MAX_HASHTAG_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const uploadForm = document.querySelector('.img-upload__form');
const uploadInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('.img-upload__cancel');
const hashtagInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');
const body = document.body;

let cancelHandler = null;
let keydownHandler = null;

const validateHashtags = (value) => {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > MAX_HASHTAG_COUNT) {
    return false;
  }

  for (const hashtag of hashtags) {
    if (!HASHTAG_REGEX.test(hashtag)) {
      return false;
    }

    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return false;
    }
  }

  const uniqueHashtags = new Set(hashtags);
  return uniqueHashtags.size === hashtags.length;
};

const getHashtagErrorMessage = (value) => {
  if (!value.trim()) {
    return '';
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > MAX_HASHTAG_COUNT) {
    return `Нельзя указать больше ${MAX_HASHTAG_COUNT} хэш-тегов`;
  }

  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с символа #';
    }

    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из одной решётки';
    }

    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return `Максимальная длина одного хэш-тега ${MAX_HASHTAG_LENGTH} символов`;
    }

    if (!HASHTAG_REGEX.test(hashtag)) {
      return 'Хэш-тег содержит недопустимые символы';
    }
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return 'Хэш-теги не должны повторяться';
  }

  return '';
};

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const getCommentErrorMessage = () => `Длина комментария не может составлять больше ${MAX_COMMENT_LENGTH} символов`;

const closeUploadModal = () => {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');

  uploadForm.reset();
  if (window.pristine) {
    window.pristine.reset();
  }

  resetImageEditor();

  if (cancelHandler) {
    uploadCancel.removeEventListener('click', cancelHandler);
    cancelHandler = null;
  }

  if (keydownHandler) {
    document.removeEventListener('keydown', keydownHandler);
    keydownHandler = null;
  }
};

const createCancelHandler = () => () => {
  closeUploadModal();
};

const createKeydownHandler = () => (evt) => {
  if (evt.key === 'Escape') {
    const activeElement = document.activeElement;
    if (activeElement !== hashtagInput && activeElement !== commentInput) {
      closeUploadModal();
    }
  }
};

const showUploadModal = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');

  cancelHandler = createCancelHandler();
  keydownHandler = createKeydownHandler();

  uploadCancel.addEventListener('click', cancelHandler);
  document.addEventListener('keydown', keydownHandler);
};

const onFileInputChange = () => {
  showUploadModal();
};

const onInputKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  if (window.pristine && !window.pristine.validate()) {
    return;
  }

  const submitButton = uploadForm.querySelector('.img-upload__submit');
  const initialText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = 'Публикуем…';

  try {
    const formData = new FormData(uploadForm);
    await sendData(formData);

    closeUploadModal();

    showSuccessMessage();
  } catch (err) {
    showErrorMessage();
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = initialText;
  }
};

const initPristine = () => {
  if (typeof Pristine !== 'undefined') {
    window.pristine = new Pristine(uploadForm, {
      classTo: 'img-upload__field-wrapper',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextClass: 'img-upload__field-wrapper--error'
    });

    window.pristine.addValidator(hashtagInput, validateHashtags, getHashtagErrorMessage);
    window.pristine.addValidator(commentInput, validateComment, getCommentErrorMessage);
  }
};

const initForm = () => {
  uploadInput.addEventListener('change', onFileInputChange);
  uploadForm.addEventListener('submit', onFormSubmit);

  hashtagInput.addEventListener('keydown', onInputKeydown);
  commentInput.addEventListener('keydown', onInputKeydown);

  initImageEditor();
  initPristine();
};

export { initForm };
