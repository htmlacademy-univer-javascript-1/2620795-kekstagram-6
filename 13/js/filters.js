import { renderPictures, clearPictures } from './miniatures.js';
import { debounce } from './utils.js';

const RANDOM_PHOTOS_COUNT = 10;
const RERENDER_DELAY = 500; // 5.3 ТЗ

const imgFilters = document.querySelector('.img-filters');
const filterForm = document.querySelector('.img-filters__form');
const btnDefault = document.querySelector('#filter-default');
const btnRandom = document.querySelector('#filter-random');
const btnDiscussed = document.querySelector('#filter-discussed');

let originalPhotos = [];

const getRandomUnique = (items, count) => {
  const copy = items.slice();
  // Перемешиваем Фишер-Йейтсом
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
};

const getDiscussed = (items) => items
  .slice()
  .sort((a, b) => b.comments.length - a.comments.length);

const setActive = (button) => {
  filterForm.querySelectorAll('.img-filters__button').forEach((btn) => btn.classList.remove('img-filters__button--active'));
  button.classList.add('img-filters__button--active');
};

const rerender = debounce((photos) => {
  clearPictures();
  renderPictures(photos);
}, RERENDER_DELAY);

const applyDefault = () => {
  setActive(btnDefault);
  rerender(originalPhotos);
};

const applyRandom = () => {
  setActive(btnRandom);
  const subset = getRandomUnique(originalPhotos, RANDOM_PHOTOS_COUNT);
  rerender(subset);
};

const applyDiscussed = () => {
  setActive(btnDiscussed);
  const sorted = getDiscussed(originalPhotos);
  rerender(sorted);
};

const onFiltersClick = (evt) => {
  const target = evt.target;
  if (!target.classList.contains('img-filters__button')) {
    return;
  }
  switch (target.id) {
    case 'filter-default':
      applyDefault();
      break;
    case 'filter-random':
      applyRandom();
      break;
    case 'filter-discussed':
      applyDiscussed();
      break;
  }
};

const initFilters = (photos) => {
  originalPhotos = photos.slice(); // не мутируем исходный порядок

  // 5.2 — показать блок фильтров после загрузки данных
  imgFilters.classList.remove('img-filters--inactive');

  // Навешиваем обработчик переключения (Б26: один обработчик на форму)
  filterForm.addEventListener('click', onFiltersClick);

  // Стартовое состояние — «По умолчанию» уже активно в разметке; перерисовка не нужна,
  // т.к. миниатюры уже отрисованы в main.js сразу после загрузки.
};

export { initFilters };
