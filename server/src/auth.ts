import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

const TOKEN_HOURS = 12;

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** True when the password matches ADMIN_PASSWORD. Always false if no password is configured. */
export function checkAdminPassword(password: unknown, expected = process.env.ADMIN_PASSWORD): boolean {
  if (!expected || typeof password !== 'string') return false;
  return safeEqual(password, expected);
}

/** A token that proves the holder signed in as admin, valid for TOKEN_HOURS. */
export function createAdminToken(secret: string, now = Date.now()): string {
  const expires = String(now + TOKEN_HOURS * 60 * 60 * 1000);
  return `${expires}.${sign(expires, secret)}`;
}

export function verifyAdminToken(token: string | undefined, secret: string, now = Date.now()): boolean {
  if (!token || !secret) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (!safeEqual(signature, sign(expires, secret))) return false;
  return Number(expires) > now;
}

/**
 * Which API requests anyone may make. Everything else needs an admin token.
 * `path` is relative to /api, for example "/services" or "/services/admin".
 */
export function isPublicRequest(method: string, path: string): boolean {
  const p = path.replace(/\/+$/, '') || '/';
  if (method === 'POST' && (p === '/contact/messages' || p === '/admin/login')) return true;
  if (method !== 'GET') return false;
  if (p.endsWith('/admin')) return false; // admin lists include hidden items
  if (p === '/contact/messages') return false; // messages sent through the contact form
  return true;
}

export function tokenSecret(): string {
  return process.env.ADMIN_TOKEN_SECRET || '';
}

export function requireAdminForPrivateRoutes(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS' || isPublicRequest(req.method, req.path)) return next();
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (verifyAdminToken(token, tokenSecret())) return next();
  return res.status(401).json({ error: 'Admin sign-in required' });
}
