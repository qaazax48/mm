interface ApiError extends Error {
  message: string;
}

export async function GET() {
  const url = 'https://opensheet.elk.sh/1rUvQMoxTSlOGs235x3ZjwjhJ5fJWjUBNa3fzYbAX2fg/Sheet1';

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Failed to fetch from opensheet:', errorText);
      return new Response(`Error: ${errorText}`, { status: res.status });
    }

    const data = await res.json();
    return Response.json({ data });
  } catch (err: unknown) {
    const error = err as ApiError;
    console.error('🔥 Unexpected Error:', error.message);
    return new Response('Internal Server Error', { status: 500 });
  }
} 
