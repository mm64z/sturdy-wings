

export async function getWithAuth(url) {
  const authorization = '4f981c43-bf28-404c-ba22-461b5979b359';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': authorization,
    }
  });
  return response.json();
}

export function getReadings() {
  const readingsUrl = 'https://snapmeter.com/api/public/meters/2080448990211/readings?start=2022-08-01&end=2023-02-01';
  return getWithAuth(readingsUrl);
}
export function getBills() {
  const billsUrl = 'https://snapmeter.com/api/public/services/2080448990210/bills?start=2022-01-01&end=2023-02-01';
  return getWithAuth(billsUrl);
}
