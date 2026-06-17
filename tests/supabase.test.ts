import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Мокаем @supabase/ssr
const mockCreateBrowserClient = vi.fn(() => ({ auth: {}, from: vi.fn() }));
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: mockCreateBrowserClient,
}));

describe('supabase client initialization', () => {
  const ORIGINAL_ENV = { ...import.meta.env };

  beforeEach(() => {
    vi.resetModules();
    mockCreateBrowserClient.mockClear();
  });

  afterEach(() => {
    Object.assign(import.meta.env, ORIGINAL_ENV);
  });

  it('выбрасывает ошибку если PUBLIC_SUPABASE_URL отсутствует', async () => {
    // Устанавливаем env без URL
    Object.assign(import.meta.env, {
      PUBLIC_SUPABASE_URL: '',
      PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-key',
    });

    await expect(async () => {
      await import('../src/lib/supabase');
    }).rejects.toThrow('ОШИБКА');
  });

  it('выбрасывает ошибку если PUBLIC_SUPABASE_PUBLISHABLE_KEY отсутствует', async () => {
    Object.assign(import.meta.env, {
      PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
    });

    await expect(async () => {
      await import('../src/lib/supabase');
    }).rejects.toThrow('ОШИБКА');
  });

  it('создаёт клиент при наличии обоих переменных', async () => {
    Object.assign(import.meta.env, {
      PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'anon-key-123',
    });

    const module = await import('../src/lib/supabase');
    expect(module.supabase).toBeDefined();
    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'anon-key-123',
    );
  });
});
