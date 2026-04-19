import { defineCollection, z } from 'astro:content';

// Схема для достопримечательностей
const attractions = defineCollection({
  type: 'content',                    // это Markdown-файлы
  schema: z.object({
    // Обязательные поля
    title: z.string().min(3).max(100),           // название
    slug: z.string().regex(/^[a-z0-9-]+$/),      // красивая часть URL

    // Основная информация
    description: z.string().min(10).max(300),    // короткое описание для карточек
    address: z.string(),
    working_hours: z.string().optional(),

    // Геолокация (для карты)
    lat: z.number().min(55).max(56),             // широта Набережных Челнов
    lng: z.number().min(52).max(53),             // долгота

    // Дополнительно
    price: z.string().optional(),                // "Бесплатно" или "300 ₽"
    category: z.enum(['музеи', 'парки', 'религия', 'природа', 'история', 'архитектура', 'другое']),
    tags: z.array(z.string()).default([]),

    // Изображения
    image: z.string().optional(),                // главное фото (в public/images/...)
    gallery: z.array(z.string()).default([]),    // массив дополнительных фото

    // Статус
    draft: z.boolean().default(false),           // если true — не будет показываться на сайте
    publishedAt: z.date().optional(),
  }),
});

// Экспортируем все коллекции
export const collections = {
  attractions,
};
