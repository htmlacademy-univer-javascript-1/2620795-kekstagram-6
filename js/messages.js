import { isEscapeKey } from './utils.js';

const body = document.body;

const showLoadError = (message = 'Не удалось загрузить данные. Попробуйте обновить страницу') => {
  const banner = document.createElement('div');
  banner.textContent = message;
  banner.style.position = 'fixed';
  banner.style.top = '0';
  banner.style.left = '0';
  banner.style.right = '0';
  banner.style.zIndex = '1000';
  banner.style.padding = '12px 16px';
  banner.style.fontSize = '16px';
  banner.style.textAlign = 'center';
  banner.style.color = '#fff';
  banner.style.background = '#ef3f4a';
  banner.style.boxShadow = '0 2px 8px rgba(0,0,0,.2)';
  body.appendChild(banner);
};

const setupClosableOverlay = (element, closeButtonSelector, stopPropagation = false) => {
  function onDocumentKeydown(evt) {
    if (isEscapeKey(evt)) {
      if (stopPropagation) {
        evt.stopPropagation();
      }
      close();
    }
  }

  function onDocumentClick(evt) {
    const inner = element.querySelector('section');
    if (inner && !inner.contains(evt.target)) {
      close();
    }
  }

  function close() {
    element.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
  }

  const onButtonClick = () => close();

  const button = element.querySelector(closeButtonSelector);
  if (button) {
    button.addEventListener('click', onButtonClick, { once: true });
  }
  document.addEventListener('keydown', onDocumentKeydown);
  setTimeout(() => document.addEventListener('click', onDocumentClick, { once: true }));
};

const showSuccessMessage = () => {
  const template = document.querySelector('#success');
  const fragment = template.content.cloneNode(true);
  const root = fragment.querySelector('.success');
  body.appendChild(fragment);
  setupClosableOverlay(document.querySelector('.success'), '.success__button');
  return root;
};

const showErrorMessage = () => {
  const template = document.querySelector('#error');
  const fragment = template.content.cloneNode(true);
  const root = fragment.querySelector('.error');
  body.appendChild(fragment);
  setupClosableOverlay(document.querySelector('.error'), '.error__button');
  return root;
};

const showUploadErrorMessage = () => {
  const template = document.querySelector('#error');
  const fragment = template.content.cloneNode(true);
  const root = fragment.querySelector('.error');
  root.style.zIndex = '3';
  const errorButton = root.querySelector('.error__button');
  if (errorButton) {
    errorButton.textContent = 'Попробовать снова';
  }
  body.appendChild(fragment);
  setupClosableOverlay(document.querySelector('.error'), '.error__button', true);
  return root;
};

export { showSuccessMessage, showErrorMessage, showUploadErrorMessage, showLoadError };
