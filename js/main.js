// js/main.js
import { renderPictures } from './miniatures.js';
import { initBigPicture } from './big-pictures.js';
import { initForm } from './form.js';
import { getData } from './api.js';
import { showLoadError } from './messages.js';

initBigPicture();
initForm();

getData()
  .then((photos) => {
    renderPictures(photos);
  })
  .catch(() => {
    showLoadError('Не удалось загрузить изображения. Попробуйте обновить страницу');
  });
