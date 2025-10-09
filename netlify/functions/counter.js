// Simple page view counter (works on Netlify)
export async function handler(event, context) {
  const kvUrl = 'https://api.npoint.io/storage'; // We'll create this below
  const response = await fetch(kvUrl);
  const data = await response.json();

  const page = event.queryStringParameters.page || 'index';
  data[page] = (data[page] || 0) + 1;

  await fetch(kvUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ page, count: data[page] }),
  };
}
