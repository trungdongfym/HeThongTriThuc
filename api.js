const apiUrl = 'http://localhost:4000/';

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

const getData = async () => {
  const data = await (await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })).json();
  return data;
}