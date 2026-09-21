export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};

const PRERENDER_TOKEN = 'Jofnw5oMoDLdsjRmW3aX';
const BOT_USER_AGENTS = [
  'googlebot', 'bingbot', 'yandex', 'baiduspider',
  'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'gptbot', 'chatgpt-user', 'claudebot', 'ccbot'
];

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));

  if (isBot) {
    const targetUrl = `https://service.prerender.io/${request.url}`;

    const prerenderedResponse = await fetch(targetUrl, {
      headers: { 'X-Prerender-Token': PRERENDER_TOKEN }
    });

    const html = await prerenderedResponse.text();

    return new Response(html, {
      status: prerenderedResponse.status,
      headers: { 'content-type': 'text/html' }
    });
  }
}