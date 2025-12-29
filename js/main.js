import { renderPictures } from './miniatures.js';
import { initBigPicture } from './big-pictures.js';
import { initForm } from './form.js';
import { getData } from './api.js';
import { showLoadError } from './messages.js';
import { initFilters } from './filters.js';

initBigPicture();
initForm();

getData()
  .then((photos) => {
    renderPictures(photos);
    initFilters(photos);
  })
  .catch(() => {
    showLoadError('Не удалось загрузить изображения. Попробуйте обновить страницу');
  });
