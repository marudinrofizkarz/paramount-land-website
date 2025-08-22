"use server";

import db from "@/lib/database";
import { revalidatePath } from "next/cache";

interface ContactInquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  projectId: string;
  projectName: string;
  unitSlug?: string | null;
}

interface ContactInquiry {
  id: string;
  project_id: string;
  project_name: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  unit_slug: string | null;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

// Submit new contact inquiry
// Pastikan export function ada
export async function submitContactInquiry(data: ContactInquiryData) {
  try {
    const id = `inquiry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await db.execute({
      sql: `INSERT INTO ContactInquiry (
        id, project_id, project_name, name, email, phone, message, 
        inquiry_type, unit_slug, status, source, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: [
        id,
        data.projectId,
        data.projectName,
        data.name,
        data.email,
        data.phone,
        data.message || null,
        data.inquiryType,
        data.unitSlug || null,
        'new',
        'website'
      ],
    });

    // Revalidate dashboard pages
    revalidatePath('/dashboard/contact-inquiries');
    
    return { success: true, id };
  } catch (error) {
    console.error('Error submitting contact inquiry:', error);
    return { 
      success: false, 
      error: 'Failed to submit inquiry. Please try again.' 
    };
  }
}

// Get all contact inquiries for dashboard
export async function getContactInquiries(page = 1, limit = 10, status?: string) {
  try {
    let sql = `
      SELECT * FROM ContactInquiry 
      WHERE 1=1
    `;
    const args: any[] = [];

    if (status && status !== 'all') {
      sql += ` AND status = ?`;
      args.push(status);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    args.push(limit, (page - 1) * limit);

    const result = await db.execute({ sql, args });
    
    // Get total count
    let countSql = `SELECT COUNT(*) as total FROM ContactInquiry WHERE 1=1`;
    const countArgs: any[] = [];
    
    if (status && status !== 'all') {
      countSql += ` AND status = ?`;
      countArgs.push(status);
    }
    
    const countResult = await db.execute({ sql: countSql, args: countArgs });
    const totalRaw = countResult.rows[0]?.total ?? 0;
    const total = Number(totalRaw) || 0;

    // Serialize data untuk client component
    const serializedData = result.rows.map((row: any) => ({
      ...row,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at)
    }));

    return {
      success: true,
      data: serializedData as ContactInquiry[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    return {
      success: false,
      error: 'Failed to fetch contact inquiries',
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    };
  }
}

// Get inquiry by ID
export async function getInquiryById(id: string) {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM ContactInquiry WHERE id = ?',
      args: [id]
    });
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Inquiry not found'
      };
    }
    
    const inquiry = result.rows[0] as any;
    
    // Serialize data untuk client component
    const serializedInquiry = {
      ...inquiry,
      created_at: inquiry.created_at instanceof Date ? inquiry.created_at.toISOString() : String(inquiry.created_at),
      updated_at: inquiry.updated_at instanceof Date ? inquiry.updated_at.toISOString() : String(inquiry.updated_at)
    };
    
    return {
      success: true,
      data: serializedInquiry as ContactInquiry
    };
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return {
      success: false,
      error: 'Failed to fetch inquiry'
    };
  }
}

// Update inquiry status
export async function updateInquiryStatus(id: string, status: string) {
  try {
    await db.execute({
      sql: `UPDATE ContactInquiry SET status = ?, updated_at = datetime('now') WHERE id = ?`,
      args: [status, id],
    });

    revalidatePath('/dashboard/contact-inquiries');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return { 
      success: false, 
      error: 'Failed to update status' 
    };
  }
}

// Delete inquiry
export async function deleteInquiry(id: string) {
  try {
    await db.execute({
      sql: `DELETE FROM ContactInquiry WHERE id = ?`,
      args: [id],
    });

    revalidatePath('/dashboard/contact-inquiries');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return { 
      success: false, 
      error: 'Failed to delete inquiry' 
    };
  }
}