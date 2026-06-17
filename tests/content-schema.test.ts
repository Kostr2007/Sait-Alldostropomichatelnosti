import { describe, it, expect } from 'vitest';
import { z } from 'astro/zod';

// Воспроизводим схему из content.config.ts для тестирования валидации
const attractionSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(300),
  address: z.string(),
  working_hours: z.string().optional(),
  lat: z.number().min(55).max(56),
  lng: z.number().min(52).max(53),
  price: z.string().optional(),
  category: z.enum([
    'музеи',
    'парки',
    'религия',
    'природа',
    'история',
    'архитектура',
    'другое',
  ]),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  publishedAt: z.date().optional(),
});

const validAttraction = {
  title: 'Мечеть Тауба',
  slug: 'mechet-tauba',
  description: 'Одна из крупнейших мечетей Набережных Челнов и Татарстана',
  address: 'просп. Хасана Туфана, 22',
  lat: 55.7245,
  lng: 52.4128,
  category: 'религия' as const,
};

describe('Attraction content schema', () => {
  describe('валидные данные', () => {
    it('принимает минимальный набор обязательных полей', () => {
      const result = attractionSchema.safeParse(validAttraction);
      expect(result.success).toBe(true);
    });

    it('принимает полный набор полей', () => {
      const full = {
        ...validAttraction,
        working_hours: '09:00 — 18:00',
        price: 'Бесплатно',
        tags: ['история', 'религия'],
        image: 'tauba-main.jpg',
        gallery: ['tauba-1.jpg', 'tauba-2.jpg'],
        draft: false,
        publishedAt: new Date('2025-01-01'),
      };
      const result = attractionSchema.safeParse(full);
      expect(result.success).toBe(true);
    });

    it('применяет значения по умолчанию для tags, gallery, draft', () => {
      const result = attractionSchema.parse(validAttraction);
      expect(result.tags).toEqual([]);
      expect(result.gallery).toEqual([]);
      expect(result.draft).toBe(false);
    });
  });

  describe('title', () => {
    it('отклоняет title короче 3 символов', () => {
      const result = attractionSchema.safeParse({
        ...validAttraction,
        title: 'Аб',
      });
      expect(result.success).toBe(false);
    });

    it('отклоняет title длиннее 100 символов', () => {
      const result = attractionSchema.safeParse({
        ...validAttraction,
        title: 'А'.repeat(101),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('slug', () => {
    it('принимает slug из строчных букв, цифр и дефисов', () => {
      const result = attractionSchema.safeParse({
        ...validAttraction,
        slug: 'my-attraction-123',
      });
      expect(result.success).toBe(true);
    });

    it('отклоняет slug с заглавными буквами', () => {
      const result = attractionSchema.safeParse({
        ...validAttraction,
        slug: 'My-Attraction',
      });
      expect(result.success).toBe(false);
    });

    it('отклоняет slug с пробелами', () => {
      const result = attractionSchema.safeParse({
        ...validAttraction,
        slug: 'my attraction',
      });
      expect(result.success).toBe(false);
    });

    it('отклоняет slug с кириллицей', () => {
      const result = attractionSchema.safeParse({
        ...validAttraction,
        slug: 'мечеть-тауба',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('description', () => {
    it('отклоняет description короче 10 символов', () => {
      const result = attractionSchema.safeParse({
        ...validAttraction,
        description: 'Короткое',
      });
      expect(result.success).toBe(false);
    });

    it('отклоняет description длиннее 300 символов', () => {
      const result = attractionSchema.safeParse({
        ...validAttraction,
        description: 'А'.repeat(301),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('геолокация (lat/lng)', () => {
    it('принимает координаты в пределах Набережных Челнов', () => {
      const result = attractionSchema.safeParse({
        ...validAttraction,
        lat: 55.5,
        lng: 52.5,
      });
      expect(result.success).toBe(true);
    });

    it('отклоняет lat за пределами 55-56', () => {
      const tooLow = attractionSchema.safeParse({
        ...validAttraction,
        lat: 54.9,
      });
      expect(tooLow.success).toBe(false);

      const tooHigh = attractionSchema.safeParse({
        ...validAttraction,
        lat: 56.1,
      });
      expect(tooHigh.success).toBe(false);
    });

    it('отклоняет lng за пределами 52-53', () => {
      const tooLow = attractionSchema.safeParse({
        ...validAttraction,
        lng: 51.9,
      });
      expect(tooLow.success).toBe(false);

      const tooHigh = attractionSchema.safeParse({
        ...validAttraction,
        lng: 53.1,
      });
      expect(tooHigh.success).toBe(false);
    });
  });

  describe('category', () => {
    it('принимает все допустимые категории', () => {
      const categories = [
        'музеи',
        'парки',
        'религия',
        'природа',
        'история',
        'архитектура',
        'другое',
      ] as const;

      for (const category of categories) {
        const result = attractionSchema.safeParse({
          ...validAttraction,
          category,
        });
        expect(result.success).toBe(true);
      }
    });

    it('отклоняет невалидную категорию', () => {
      const result = attractionSchema.safeParse({
        ...validAttraction,
        category: 'неизвестная',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('необязательные поля', () => {
    it('принимает данные без working_hours', () => {
      const result = attractionSchema.safeParse(validAttraction);
      expect(result.success).toBe(true);
    });

    it('принимает данные без price', () => {
      const result = attractionSchema.safeParse(validAttraction);
      expect(result.success).toBe(true);
    });

    it('принимает данные без image', () => {
      const result = attractionSchema.safeParse(validAttraction);
      expect(result.success).toBe(true);
    });
  });
});
