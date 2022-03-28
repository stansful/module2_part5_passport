const httpPost = async <ResponseData>(url = '', data: string | FormData, headers: any): Promise<ResponseData> => {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: data,
  });

  return response.json();
};

const httpGet = async <ResponseData>(path = '', token = ''): Promise<ResponseData> => {
  const response = await fetch(path, {
    method: 'GET',
    headers: {
      Authorization: token,
    },
  });

  return response.json();
};
