export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  return response.json() as Promise<T>;
}

export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
  });
  return handleResponse<T>(response);
}

// POST request
export async function postData<T>(url: string, data: any): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return handleResponse<T>(response);
}
