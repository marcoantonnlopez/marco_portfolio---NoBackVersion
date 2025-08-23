// frontend/src/lib/api.ts
const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || "";
const LOCAL_BASE  = "http://localhost:3001";

/**
 * Si quieres cambiar qué endpoint se usa para "ping", define
 * NEXT_PUBLIC_PING_PATH=/proyectos/liderazgo en tus envs.
 * Debe ser una ruta PÚBLICA que exista en tu API.
 */
const PING_PATH = process.env.NEXT_PUBLIC_PING_PATH || "/proyectos/liderazgo";

// caché en memoria para no “probar” en cada request
let resolvedBase: string | null = null;
let lastCheckTs = 0;

function isDev() {
  return process.env.NODE_ENV === "development";
}

/** Considera el backend "UP" si responde con cualquier status < 500. */
async function tryUrl(url: string, timeoutMs = 700): Promise<boolean> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      cache: "no-store",
      // aceptar json si hay
      headers: { accept: "application/json, text/plain, */*" },
      method: "GET",
    });
    // 2xx–4xx => el servidor está vivo (401/403 son válidos para "alive")
    return res.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

/** Ping que no depende de /healthz ni de HEAD / */
async function ping(base: string): Promise<boolean> {
  // 1) prueba ruta pública configurable
  if (await tryUrl(`${base}${PING_PATH}`)) return true;

  // 2) intenta otras rutas públicas comunes (por si PING_PATH no existe)
  const fallbacks = ["/proyectos/liderazgo", "/proyectos/desarrollo", "/proyectos/diseno"];
  for (const p of fallbacks) {
    if (await tryUrl(`${base}${p}`)) return true;
  }

  // 3) como último recurso, prueba GET a la raíz (podría dar 401; lo contamos como up si < 500)
  return await tryUrl(base);
}

async function resolveBase(): Promise<string> {
  // usa caché en dev 15s; en prod no re-pingeamos
  if (resolvedBase && (!isDev() || Date.now() - lastCheckTs < 15_000)) {
    return resolvedBase;
  }

  if (isDev()) {
    // intenta LOCAL rápido; si falla usa REMOTO (si existe) y si no, vuelve a LOCAL
    const localUp = await ping(LOCAL_BASE).catch(() => false);
    resolvedBase = localUp ? LOCAL_BASE : (REMOTE_BASE || LOCAL_BASE);
    lastCheckTs = Date.now();
    return resolvedBase;
  }

  // PROD/Preview: usa REMOTO si está definido; no ping aquí
  resolvedBase = REMOTE_BASE || "";
  return resolvedBase;
}

/** Fetch con fallback: en dev prueba LOCAL y, si falla, reintenta en REMOTO. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const p = path.startsWith("/") ? path : `/${path}`;

  const baseA = await resolveBase();
  if (baseA) {
    try {
      const res = await fetch(`${baseA}${p}`, { cache: "no-store", ...init });
      if (res.ok) return (await res.json()) as T;

      // si no ok y estamos en dev, intenta remoto como fallback (si es distinto)
      if (isDev() && REMOTE_BASE && baseA !== REMOTE_BASE) {
        const resB = await fetch(`${REMOTE_BASE}${p}`, { cache: "no-store", ...init });
        if (resB.ok) {
          resolvedBase = REMOTE_BASE; // “promueve” remoto para siguientes llamadas
          return (await resB.json()) as T;
        }
        const detail = await resB.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} / fallback: ${resB.status} ${resB.statusText} ${detail}`);
      } else {
        const detail = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText}${detail ? ` - ${detail}` : ""}`);
      }
    } catch (e) {
      // network/timeout → intenta remoto en dev si aplica
      if (isDev() && REMOTE_BASE && baseA !== REMOTE_BASE) {
        const resB = await fetch(`${REMOTE_BASE}${p}`, { cache: "no-store", ...init }).catch(() => null);
        if (resB?.ok) {
          resolvedBase = REMOTE_BASE;
          return (await resB.json()) as T;
        }
      }
      throw e;
    }
  }

  // Sin base en prod: error explícito
  throw new Error(
    "API base URL is not configured. Set NEXT_PUBLIC_API_BASE (production) or run backend on http://localhost:3001 (development)."
  );
}

/** Útil para logs/debug en cliente */
export async function getCurrentApiBase(): Promise<string> {
  return await resolveBase();
}
