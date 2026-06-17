import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateRequiredFields,
} from '../src/lib/validation';

describe('validateEmail', () => {
  it('принимает корректный email', () => {
    expect(validateEmail('user@example.com')).toEqual({ valid: true });
    expect(validateEmail('test.name+tag@domain.co')).toEqual({ valid: true });
  });

  it('отклоняет пустую строку', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('пустым');
  });

  it('отклоняет строку из пробелов', () => {
    const result = validateEmail('   ');
    expect(result.valid).toBe(false);
  });

  it('отклоняет email без @', () => {
    const result = validateEmail('userexample.com');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Некорректный');
  });

  it('отклоняет email без домена', () => {
    const result = validateEmail('user@');
    expect(result.valid).toBe(false);
  });

  it('отклоняет email без имени пользователя', () => {
    const result = validateEmail('@example.com');
    expect(result.valid).toBe(false);
  });

  it('отклоняет email с пробелами внутри', () => {
    const result = validateEmail('us er@example.com');
    expect(result.valid).toBe(false);
  });
});

describe('validatePassword', () => {
  it('принимает валидный пароль', () => {
    expect(validatePassword('SecurePass1')).toEqual({ valid: true });
    expect(validatePassword('MyP@ss123')).toEqual({ valid: true });
  });

  it('отклоняет пустой пароль', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('пустым');
  });

  it('отклоняет пароль короче 8 символов', () => {
    const result = validatePassword('Ab1cdef');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('8 символов');
  });

  it('отклоняет простые пароли из blocklist', () => {
    const easyPasswords = [
      '12345678',
      'qwertyui',
      'password',
      '11111111',
      '87654321',
      '123456789',
    ];
    for (const pwd of easyPasswords) {
      const result = validatePassword(pwd);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('простой');
    }
  });

  it('отклоняет простые пароли независимо от регистра', () => {
    const result = validatePassword('PASSWORD');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('простой');
  });

  it('отклоняет пароль без заглавной буквы', () => {
    const result = validatePassword('lowercase1');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('заглавную');
  });

  it('отклоняет пароль без строчной буквы', () => {
    const result = validatePassword('UPPERCASE1');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('строчную');
  });

  it('отклоняет пароль без цифры', () => {
    const result = validatePassword('NoDigitHere');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('цифру');
  });
});

describe('validateRequiredFields', () => {
  it('принимает когда все поля заполнены', () => {
    const result = validateRequiredFields({
      email: 'test@test.com',
      password: 'mypassword',
    });
    expect(result.valid).toBe(true);
  });

  it('отклоняет когда поле пустое', () => {
    const result = validateRequiredFields({
      email: 'test@test.com',
      password: '',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('password');
  });

  it('отклоняет когда поле содержит только пробелы', () => {
    const result = validateRequiredFields({
      email: '   ',
      password: 'something',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('email');
  });
});
