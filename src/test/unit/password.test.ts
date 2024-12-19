
import { describe, it, expect } from 'vitest';


import { hashPassword, comparePassword } from '../../utils/helpers'

describe('Password Hashing Helper', () => {
  const plainPassword = 'securePassword123';

  it('should hash a password and return a non-empty string', async () => {
    const hashedPassword = await hashPassword(plainPassword);
    expect(hashedPassword).toBeDefined();
    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword).not.toBe(plainPassword);
  });

  it('should verify a correct password against its hash', async () => {
    const hashedPassword = await hashPassword(plainPassword);
    const isMatch = await comparePassword(plainPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it('should reject an incorrect password against a hash', async () => {
    const hashedPassword = await hashPassword(plainPassword);
    const isMatch = await comparePassword('wrongPassword', hashedPassword);
    expect(isMatch).toBe(false);
  });
});
