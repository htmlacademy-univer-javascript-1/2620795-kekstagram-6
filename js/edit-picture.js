const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

const DEFAULT_EFFECT = 'none';
const EFFECTS = {
  none: { filter: '', range: { min: 0, max: 100 }, step: 1, unit: '' },
  chrome: { filter: 'grayscale', range: { min: 0, max: 1 }, step: 0.1, unit: '' },
  sepia: { filter: 'sepia', range: { min: 0, max: 1 }, step: 0.1, unit: '' },
  marvin: { filter: 'invert', range: { min: 0, max: 100 }, step: 1, unit: '%' },
  phobos: { filter: 'blur', range: { min: 0, max: 3 }, step: 0.1, unit: 'px' },
  heat: { filter: 'brightness', range: { min: 1, max: 3 }, step: 0.1, unit: '' }
};

const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview img');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectRadios = document.querySelectorAll('.effects__radio');

let currentScale = DEFAULT_SCALE;
let currentEffect = DEFAULT_EFFECT;
let slider = null;

const updateImageEffect = (value) => {
  const effect = EFFECTS[currentEffect];

  if (currentEffect === 'none') {
    imagePreview.style.filter = '';
    return;
  }

  imagePreview.style.filter = `${effect.filter}(${value}${effect.unit})`;
};

const updateScale = (newScale) => {
  currentScale = newScale;
  scaleControlValue.value = `${currentScale}%`;
  imagePreview.style.transform = `scale(${currentScale / 100})`;
};

const onScaleSmallerClick = () => {
  if (currentScale > MIN_SCALE) {
    updateScale(currentScale - SCALE_STEP);
  }
};

const onScaleBiggerClick = () => {
  if (currentScale < MAX_SCALE) {
    updateScale(currentScale + SCALE_STEP);
  }
};

const createSlider = () => {
  noUiSlider.create(effectLevelSlider, {
    range: EFFECTS[currentEffect].range,
    start: EFFECTS[currentEffect].range.max,
    step: EFFECTS[currentEffect].step,
    connect: 'lower',
    format: {
      to: (value) => String(parseFloat(value)), // убираем хвостовые нули
      from: (value) => Number(value)
    }
  });
};


const updateSlider = () => {
  if (slider) {
    slider.destroy();
    slider = null;
  }

  if (currentEffect === 'none') {
    effectLevelContainer.classList.add('hidden');
    effectLevelValue.value = '';
    imagePreview.style.filter = '';
    return;
  }

  effectLevelContainer.classList.remove('hidden');
  createSlider();

  slider = effectLevelSlider.noUiSlider;

  slider.on('update', (values) => {
    const val = values[0];
    const normalized = String(parseFloat(val));
    effectLevelValue.value = normalized;
    updateImageEffect(normalized);
  });

  const startVal = EFFECTS[currentEffect].range.max;
  effectLevelValue.value = startVal;
  updateImageEffect(startVal);
};

const onEffectChange = (evt) => {
  currentEffect = evt.target.value;
  updateSlider();
};

const resetImageEditor = () => {
  currentScale = DEFAULT_SCALE;
  updateScale(currentScale);

  currentEffect = DEFAULT_EFFECT;

  const noneEffectRadio = document.querySelector('#effect-none');
  if (noneEffectRadio) {
    noneEffectRadio.checked = true;
  }

  updateSlider();
};

const initImageEditor = () => {
  scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleBiggerClick);

  effectRadios.forEach((radio) => {
    radio.addEventListener('change', onEffectChange);
  });

  updateSlider();
  updateScale(DEFAULT_SCALE);
};

export { initImageEditor, resetImageEditor };
