const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...rest), timeoutDelay);
  };
};

const isEscapeKey = (evt) => evt.key === 'Escape';

export { debounce, isEscapeKey };
