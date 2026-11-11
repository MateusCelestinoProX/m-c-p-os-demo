// Vercel Serverless Function: POST /api/auth
// Autenticação Segura e Demo Gateway para MCP OS Showcase
const crypto = require('crypto');

// Hashes SHA-256 autorizados para ambiente de demonstração
const DEMO_PASSWORDS = [
  // 'demo123'
  'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
  // 'mcpos-demo'
  'd097fe79b4a4cb740d7ce9842a2080a8f8ec35a8206d281a8b1961ef06fc727a'
];

const DEMO_IDENTIFIERS = [
  'demo@mcpos.dev',
  'admin@mcpos.dev',
  'demo',
  'admin'
];

const SESSION_SECRET = process.env.SESSION_SECRET || 'mcpos_demo_root_sign_key_2026_shield';

// Controle anti-bruteforce em memória por IP
const ipAttempts = new Map();
const MAX_ATTEMPTS = 15;
const LOCKOUT_MS = 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = ipAttempts.get(ip);
  if (!record) return { allowed: true };

  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSec = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingSec };
  }

  if (record.lockedUntil && now >= record.lockedUntil) {
    ipAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function registerAttempt(ip, success) {
  const now = Date.now();
  if (success) {
    ipAttempts.delete(ip);
    return;
  }
  let record = ipAttempts.get(ip) || { count: 0, lockedUntil: null };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }
  ipAttempts.set(ip, record);
}

function createSignedSessionToken(user) {
  const payload = {
    sub: user,
    role: 'demo_admin',
    iat: Date.now(),
    exp: Date.now() + (30 * 24 * 60 * 60 * 1000)
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido.' });
  }

  const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();

  const rateStatus = checkRateLimit(clientIp);
  if (!rateStatus.allowed) {
    return res.status(429).json({
      success: false,
      message: `Muitas tentativas. Bloqueado por mais ${rateStatus.remainingSec} segundos.`
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) { body = {}; }
    }
    const identifier = String(body?.identifier || body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '').trim();

    // Permite login de demonstração direto com identificador demo
    if (identifier === 'demo' || identifier === 'demo@mcpos.dev') {
      registerAttempt(clientIp, true);
      const token = createSignedSessionToken(identifier);
      const isHttps = req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';
      const cookieFlags = `Path=/; SameSite=Lax${isHttps ? '; Secure' : ''}`;
      res.setHeader('Set-Cookie', [
        `mcp_admin_session=${encodeURIComponent(token)}; ${cookieFlags}`,
        `mcp_admin_email=${encodeURIComponent(identifier)}; ${cookieFlags}`
      ]);

      return res.status(200).json({
        success: true,
        token: token,
        exp: Date.now() + (30 * 24 * 60 * 60 * 1000),
        user: identifier,
        message: 'Acesso Demo autorizado com sucesso.'
      });
    }

    if (!identifier || !password) {
      registerAttempt(clientIp, false);
      return res.status(400).json({ success: false, message: 'Identificador e senha são obrigatórios.' });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    const isUserValid = DEMO_IDENTIFIERS.includes(identifier);
    let isPasswordValid = DEMO_PASSWORDS.includes(passwordHash) || password === 'demo123' || password === 'mcpos-demo';

    if (isUserValid && isPasswordValid) {
      registerAttempt(clientIp, true);
      const token = createSignedSessionToken(identifier);
      const isHttps = req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';
      const cookieFlags = `Path=/; SameSite=Lax${isHttps ? '; Secure' : ''}`;
      res.setHeader('Set-Cookie', [
        `mcp_admin_session=${encodeURIComponent(token)}; ${cookieFlags}`,
        `mcp_admin_email=${encodeURIComponent(identifier)}; ${cookieFlags}`
      ]);

      return res.status(200).json({
        success: true,
        token: token,
        exp: Date.now() + (30 * 24 * 60 * 60 * 1000),
        user: identifier,
        message: 'Autenticado com sucesso no MCP OS [DEMO].'
      });
    }

    registerAttempt(clientIp, false);
    return res.status(401).json({
      success: false,
      message: 'Acesso de demonstração: use demo@mcpos.dev / demo123 ou clique em Entrar como Demo.'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro interno de autenticação.' });
  }
};
