import { initImageEditor, resetImageEditor } from './edit-picture.js';
import { sendData } from './api.js';
import { showSuccessMessage, showUploadErrorMessage } from './messages.js';
import { isEscapeKey } from './utils.js';

const MAX_HASHTAG_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

const uploadForm = document.querySelector('.img-upload__form');
const uploadInput = uploadForm.querySelector('.img-upload__input');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('.img-upload__cancel');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');
const imagePreview = uploadForm.querySelector('.img-upload__preview img');
const effectsPreviews = uploadForm.querySelectorAll('.effects__preview');
const body = document.body;

const DEFAULT_IMAGE_SRC = imagePreview.src;

let currentObjectUrl = null;

const applyPreviewToEffects = (url) => {
  effectsPreviews.forEach((effectPreview) => {
    effectPreview.style.backgroundImage = `url("${url}")`;
  });
};

const clearEffectPreviews = () => {
  effectsPreviews.forEach((effectPreview) => {
    effectPreview.style.backgroundImage = '';
  });
};

function onUploadCancelClick() {
  closeUploadModal();
}

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    const activeElement = document.activeElement;
    if (activeElement !== hashtagInput && activeElement !== commentInput) {
      closeUploadModal();
    }
  }
}

function closeUploadModal() {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');

  uploadForm.reset();
  if (window.pristine) {
    window.pristine.reset();
  }

  resetImageEditor();

  imagePreview.src = DEFAULT_IMAGE_SRC;
  clearEffectPreviews();

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }

  uploadCancel.removeEventListener('click', onUploadCancelClick);
  document.removeEventListener('keydown', onDocumentKeydown);
}

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

const showUploadModal = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');

  uploadCancel.addEventListener('click', onUploadCancelClick);
  document.addEventListener('keydown', onDocumentKeydown);
};

const onFileInputChange = () => {
  const file = uploadInput.files && uploadInput.files[0];
  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();
  const isValid = FILE_TYPES.some((ext) => fileName.endsWith(ext));

  if (!isValid) {
    uploadInput.setCustomValidity('Неверный формат файла. Загрузите изображение (jpg, jpeg, png, gif, webp).');
    uploadInput.reportValidity();
    setTimeout(() => uploadInput.setCustomValidity(''));
    uploadInput.value = '';
    return;
  }

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }

  currentObjectUrl = URL.createObjectURL(file);
  imagePreview.src = currentObjectUrl;
  applyPreviewToEffects(currentObjectUrl);

  showUploadModal();
  resetImageEditor();
};

const onInputKeydown = (evt) => {
  if (isEscapeKey(evt)) {
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
    showUploadErrorMessage();
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = initialText;
  }
};

const initPristine = () => {
  if (typeof Pristine !== 'undefined') {
    window.pristine = new Pristine(uploadForm, {
      classTo: 'img-upload__field-wrapper',
      errorClass: 'img-upload__field-wrapper--error',
      successClass: 'img-upload__field-wrapper--success',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextTag: 'div',
      errorTextClass: 'pristine-error'
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
