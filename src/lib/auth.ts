import { supabase } from './supabase';

export interface SignUpResult {
  success: boolean;
  error?: string;
}

export async function signUpUser(
  email: string,
  password: string,
): Promise<SignUpResult> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export function validateEmail(email: string): string | null {
  if (!email) return 'Пожалуйста, заполните все поля';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Пожалуйста, введите корректный email адрес';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Пожалуйста, заполните все поля';
  if (password.length < 8) return 'Пароль должен быть не менее 8 символов';

  const easyPasswords = [
    '12345678',
    'qwertyui',
    'password',
    '11111111',
    '87654321',
    '123456789',
  ];
  if (easyPasswords.includes(password.toLowerCase())) {
    return 'Этот пароль слишком простой и часто используется. Придумайте другой.';
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return 'Пароль должен содержать:\n• Хотя бы одну заглавную букву (A-Z)\n• Хотя бы одну строчную букву (a-z)\n• Хотя бы одну цифру (0-9)';
  }

  return null;
}
