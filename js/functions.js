const checkLength = (str, maxLength) => str.length <= maxLength;

const isPalindrome = (input) => {
  const normalized = input.replaceAll(' ', '').toLowerCase();
  let reversed = '';
  for (let i = normalized.length - 1; i >= 0; i--) {
    reversed += normalized[i];
  }
  return normalized === reversed;
};

console.log(checkLength('Hello', 5));
console.log(isPalindrome('Лёша на полке клопа нашёл '));


