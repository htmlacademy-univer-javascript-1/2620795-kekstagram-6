const checkLength = (str, maxLength) => str.length <= maxLength;

const isPalindrome = (input) => {
  const normalized = input.replaceAll(' ', '').toLowerCase();
  let reversed = '';
  for (let i = normalized.length - 1; i >= 0; i--) {
    reversed += normalized[i];
  }
  return normalized === reversed;
};

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const isMeetingWithinWorkday = (workStart, workEnd, meetingStart, meetingDuration) => {
  const meetingStartMinutes = timeToMinutes(meetingStart);
  const meetingEndMinutes = meetingStartMinutes + meetingDuration;
  return meetingStartMinutes >= timeToMinutes(workStart) && meetingEndMinutes <= timeToMinutes(workEnd);
};

//console.log(isMeetingWithinWorkday('08:00', '14:30', '14:00', 90));
//console.log(checkLength('Hello', 5));
//console.log(isPalindrome('Лёша на полке клопа нашёл '));
export {checkLength, isPalindrome, isMeetingWithinWorkday};

