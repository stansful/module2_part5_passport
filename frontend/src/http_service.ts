class HttpService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = API_URL;
  }

  public async get<ResponseData>(path = '', token = getToken()): Promise<ResponseData> {
    const response = await fetch(this.apiUrl + path, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    return response.json();
  };

  public async post<ResponseData>(path = '', data: Object | FormData, token = getToken()): Promise<ResponseData | Response> {
    if (data instanceof FormData) {
      return fetch(this.apiUrl + path, {
        method: 'POST',
        headers: { Authorization: token },
        body: data,
      });
    }

    const response = await fetch(this.apiUrl + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

const apiRequest = new HttpService();
