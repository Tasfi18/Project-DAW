import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkAdminPassword,
  createAdminToken,
  isPublicRequest,
  verifyAdminToken,
} from './auth.js';

const SECRET = 'test-secret-that-is-long-enough';

test('the admin password is checked on the server', () => {
  assert.equal(checkAdminPassword('right', 'right'), true);
  assert.equal(checkAdminPassword('wrong', 'right'), false);
  assert.equal(checkAdminPassword(undefined, 'right'), false);
  assert.equal(checkAdminPassword('anything', undefined), false); // no password configured
});

test('a token is accepted until it expires', () => {
  const now = Date.UTC(2026, 0, 1);
  const token = createAdminToken(SECRET, now);
  assert.equal(verifyAdminToken(token, SECRET, now + 60_000), true);
  assert.equal(verifyAdminToken(token, SECRET, now + 13 * 60 * 60 * 1000), false);
});

test('a token signed with another secret or edited by hand is refused', () => {
  const token = createAdminToken(SECRET);
  assert.equal(verifyAdminToken(token, 'another-secret'), false);
  const [, signature] = token.split('.');
  assert.equal(verifyAdminToken(`${Date.now() + 10 ** 12}.${signature}`, SECRET), false);
  assert.equal(verifyAdminToken('garbage', SECRET), false);
  assert.equal(verifyAdminToken(undefined, SECRET), false);
});

test('visitors can read the site and send a contact message', () => {
  assert.equal(isPublicRequest('GET', '/services'), true);
  assert.equal(isPublicRequest('GET', '/content'), true);
  assert.equal(isPublicRequest('POST', '/contact/messages'), true);
  assert.equal(isPublicRequest('POST', '/admin/login'), true);
});

test('changes, admin lists and contact messages need the admin token', () => {
  assert.equal(isPublicRequest('POST', '/services'), false);
  assert.equal(isPublicRequest('PUT', '/team/1'), false);
  assert.equal(isPublicRequest('DELETE', '/software/3'), false);
  assert.equal(isPublicRequest('POST', '/upload'), false);
  assert.equal(isPublicRequest('GET', '/services/admin'), false);
  assert.equal(isPublicRequest('GET', '/contact/messages'), false);
  assert.equal(isPublicRequest('GET', '/contact/messages/'), false);
  assert.equal(isPublicRequest('PUT', '/contact/messages/5'), false);
});
