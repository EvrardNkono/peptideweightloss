export const config = {
  // Pages uniquement : exclut /api, /assets et tout chemin avec une extension (.js, .css, .xml, .ico, .png...)
  matcher: '/((?!api/|assets/|.*\\..*).*)',
};

const PRERENDER_TOKEN = 'Jofnw5oMoDLdsjRmW3aX';

const BOT_USER_AGENTS = [
  'googlebot', 'google-inspectiontool', 'bingbot', 'yandex', 'baiduspider',
  'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'gptbot', 'chatgpt-user', 'claudebot', 'ccbot', 'ahrefsbot'
];

export default async function middleware(request) {
  const ua = request.headers.get('user-agent')?.toLowerCase() || '';
  const isBot = BOT_USER_AGENTS.some((bot) => ua.includes(bot));

  // Visiteur normal : on ne touche a rien, le site SPA est servi tel quel.
  if (!isBot) return;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`https://service.prerender.io/${request.url}`, {
      headers: { 'X-Prerender-Token': PRERENDER_TOKEN },
      signal: controller.signal,
      redirect: 'manual',
    });
    clearTimeout(timer);

    // Si Prerender.io echoue (503, quota, timeout...), on ne bloque JAMAIS le bot :
    // il recoit le site normal et execute le JavaScript lui-meme.
    if (res.status !== 200) return;

    const html = await res.text();
    if (!html || html.length < 3000) return;

    return new Response(html, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch {
    return;
  }
}
