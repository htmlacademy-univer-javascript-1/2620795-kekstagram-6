const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET: '/data',
  POST: '/'
};

//раскомментируйте для проверки, что выводится сообщение об ошибке при неправильной отправке. Верхнюю константу - закомментируйте.
// const Route = {
//   GET: '/data',
//   POST: '/цукен/'
// };

const Method = {
  GET: 'GET',
  POST: 'POST'
};

const checkResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response;
};

const getJson = async (response) => response.json();

const getData = async () => {
  const response = await fetch(`${BASE_URL}${Route.GET}`, { method: Method.GET });
  await checkResponse(response);
  return getJson(response);
};

const sendData = async (formData) => {
  const response = await fetch(`${BASE_URL}${Route.POST}`, {
    method: Method.POST,
    body: formData
  });
  await checkResponse(response);
};

export { getData, sendData };
