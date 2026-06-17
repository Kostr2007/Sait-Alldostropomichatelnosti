/**
 * Утилиты валидации форм регистрации/логина.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EASY_PASSWORDS = [
  '12345678',
  'qwertyui',
  'password',
  '11111111',
  '87654321',
  '123456789',
];

/** Проверяет, что email имеет корректный формат. */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { valid: false, error: 'Email не может быть пустым' };
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, error: 'Некорректный email адрес' };
  }
  return { valid: true };
}

/** Проверяет сложность пароля. */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, error: 'Пароль не может быть пустым' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Пароль должен быть не менее 8 символов' };
  }

  if (EASY_PASSWORDS.includes(password.toLowerCase())) {
    return {
      valid: false,
      error: 'Этот пароль слишком простой и часто используется',
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return {
      valid: false,
      error:
        'Пароль должен содержать заглавную букву, строчную букву и цифру',
    };
  }

  return { valid: true };
}

/** Проверяет, что все обязательные поля заполнены. */
export function validateRequiredFields(
  fields: Record<string, string>,
): ValidationResult {
  for (const [key, value] of Object.entries(fields)) {
    if (!value.trim()) {
      return { valid: false, error: `Поле "${key}" обязательно для заполнения` };
    }
  }
  return { valid: true };
}
