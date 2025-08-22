'use server';

import db from '@/lib/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  featured_image: z.string().optional(),
  bg_color: z.string().optional(),
  is_published: z.boolean().default(false),
});

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  category: string;
  featured_image?: string;
  bg_color?: string;
  is_published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export async function createNews(formData: FormData) {
  try {
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      featured_image: formData.get('featured_image') as string,
      bg_color: formData.get('bg_color') as string,
      is_published: formData.get('is_published') === 'true',
    };

    const validatedData = newsSchema.parse(data);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const published_at = validatedData.is_published ? now : null;

    await db.execute({
      sql: `INSERT INTO news (id, title, slug, description, content, category, featured_image, bg_color, is_published, published_at, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        validatedData.title,
        validatedData.slug,
        validatedData.description,
        validatedData.content || '',
        validatedData.category,
        validatedData.featured_image || '',
        validatedData.bg_color || 'bg-gradient-to-br from-primary/20 to-primary/5',
        validatedData.is_published,
        published_at,
        now,
        now,
      ],
    });

    revalidatePath('/dashboard/news');
    revalidatePath('/');
    
    return { success: true, message: 'News created successfully' };
  } catch (error) {
    console.error('Error creating news:', error);
    return { success: false, error: 'Failed to create news' };
  }
}

export async function updateNews(id: string, formData: FormData) {
  try {
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      featured_image: formData.get('featured_image') as string,
      bg_color: formData.get('bg_color') as string,
      is_published: formData.get('is_published') === 'true',
    };

    const validatedData = newsSchema.parse(data);
    const now = new Date().toISOString();
    
    // Get current news to check if publication status changed
    const currentNewsResponse = await getNewsById(id);
    let published_at: string | null = null;
    
    if (currentNewsResponse.success && currentNewsResponse.data) {
      const currentNews = currentNewsResponse.data;
      // Fix: Handle undefined case for published_at
      published_at = currentNews.published_at || null;
      
      // If changing from unpublished to published, set published_at
      if (!currentNews.is_published && validatedData.is_published) {
        published_at = now;
      }
      // If changing from published to unpublished, clear published_at
      else if (currentNews.is_published && !validatedData.is_published) {
        published_at = null;
      }
    } else if (validatedData.is_published) {
      // If this is a new publish, set published_at
      published_at = now;
    }

    await db.execute({
      sql: `UPDATE news SET title = ?, slug = ?, description = ?, content = ?, category = ?, 
             featured_image = ?, bg_color = ?, is_published = ?, published_at = ?, updated_at = ?
             WHERE id = ?`,
      args: [
        validatedData.title,
        validatedData.slug,
        validatedData.description,
        validatedData.content || '',
        validatedData.category,
        validatedData.featured_image || '',
        validatedData.bg_color || 'bg-gradient-to-br from-primary/20 to-primary/5',
        validatedData.is_published,
        published_at,
        now,
        id,
      ],
    });

    revalidatePath('/dashboard/news');
    revalidatePath('/');
    
    return { success: true, message: 'News updated successfully' };
  } catch (error) {
    console.error('Error updating news:', error);
    return { success: false, error: 'Failed to update news' };
  }
}

export async function deleteNews(id: string) {
  try {
    await db.execute({
      sql: 'DELETE FROM news WHERE id = ?',
      args: [id],
    });

    revalidatePath('/dashboard/news');
    revalidatePath('/');
    
    return { success: true, message: 'News deleted successfully' };
  } catch (error) {
    console.error('Error deleting news:', error);
    return { success: false, error: 'Failed to delete news' };
  }
}

export async function getAllNews() {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM news ORDER BY created_at DESC',
      args: [],
    });

    // Convert date fields to strings to avoid serialization issues
    const serializedData = result.rows.map((row: any) => ({
      ...row,
      published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
    })) as NewsItem[];

    return {
      success: true,
      data: serializedData,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return { success: false, error: 'Failed to fetch news' };
  }
}

export async function getPublishedNews(page = 1, limit = 9) {
  try {
    // Get total count for pagination
    const countResult = await db.execute({
      sql: 'SELECT COUNT(*) as total FROM news WHERE is_published = true',
      args: [],
    });
    
    const total = countResult.rows[0].total as number;
    const offset = (page - 1) * limit;
    
    const result = await db.execute({
      sql: 'SELECT * FROM news WHERE is_published = true ORDER BY published_at DESC LIMIT ? OFFSET ?',
      args: [limit, offset],
    });

    // Convert date fields to strings to avoid serialization issues
    const serializedData = result.rows.map((row: any) => ({
      ...row,
      published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
    })) as NewsItem[];

    return {
      success: true,
      data: serializedData,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching published news:', error);
    return { success: false, error: 'Failed to fetch published news' };
  }
}

export async function getNewsById(id: string) {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM news WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return { success: false, error: 'News not found' };
    }

    const row = result.rows[0] as any;
    const serializedData = {
      ...row,
      published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
    } as NewsItem;

    return { success: true, data: serializedData };
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    return { success: false, error: 'Failed to fetch news' };
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM news WHERE slug = ?',
      args: [slug],
    });

    if (result.rows.length === 0) {
      return { success: false, error: 'News not found' };
    }

    const row = result.rows[0] as any;
    const serializedData = {
      ...row,
      published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
    } as NewsItem;

    return { success: true, data: serializedData };
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    return { success: false, error: 'Failed to fetch news' };
  }
}

export async function toggleNewsStatus(id: string) {
  try {
    const newsResponse = await getNewsById(id);
    if (!newsResponse.success || !newsResponse.data) {
      return { success: false, error: 'News not found' };
    }

    const news = newsResponse.data;
    const newStatus = !news.is_published;
    const now = new Date().toISOString();
    const published_at = newStatus ? now : null;

    await db.execute({
      sql: 'UPDATE news SET is_published = ?, published_at = ?, updated_at = ? WHERE id = ?',
      args: [newStatus, published_at, now, id],
    });

    revalidatePath('/dashboard/news');
    revalidatePath('/');
    
    return { success: true, message: `News ${newStatus ? 'published' : 'unpublished'} successfully` };
  } catch (error) {
    console.error('Error toggling news status:', error);
    return { success: false, error: 'Failed to toggle news status' };
  }
}