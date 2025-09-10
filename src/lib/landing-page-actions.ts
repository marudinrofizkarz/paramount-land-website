import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";
import { DATABASE_CONFIG } from "./env-config";

const db = createClient({
  url: DATABASE_CONFIG.url,
  authToken: DATABASE_CONFIG.authToken,
});

// Landing Page Types
export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: LandingPageComponent[];
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  status: "draft" | "published" | "archived";
  template_type: string;
  target_audience?: string;
  campaign_source?: string;
  tracking_code?: string;
  settings?: any;
  published_at?: string;
  expires_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface LandingPageComponent {
  id: string;
  type:
    | "hero"
    | "form"
    | "features"
    | "testimonial"
    | "cta"
    | "content"
    | "gallery"
    | "pricing"
    | "faq"
    | "statistics"
    | "video"
    | "timeline"
    | "location"
    | "custom-image"
    | "copyright"
    | "footer"
    | "facilities"
    | "unit-slider"
    | "progress-slider"
    | "bank-partnership"
    | "agent-contact"
    | "title-description"
    | "location-access"
    | "promo";
  config: any;
  order: number;
}

export interface ComponentTemplate {
  id: string;
  name: string;
  type: string;
  config: any;
  preview_image?: string;
  is_system: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Landing Page CRUD Operations
export class LandingPageActions {
  // Create landing page
  static async create(
    data: Omit<LandingPage, "id" | "created_at" | "updated_at">
  ) {
    const id = uuidv4();
    const now = new Date().toISOString();

    try {
      await db.execute(
        `INSERT INTO LandingPages (
          id, title, slug, description, content, meta_title, meta_description, 
          og_image, status, template_type, target_audience, campaign_source, 
          tracking_code, settings, published_at, expires_at, created_by, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.title,
          data.slug,
          data.description || null,
          JSON.stringify(data.content),
          data.meta_title || null,
          data.meta_description || null,
          data.og_image || null,
          data.status,
          data.template_type,
          data.target_audience || null,
          data.campaign_source || null,
          data.tracking_code || null,
          JSON.stringify(data.settings || {}),
          data.published_at || null,
          data.expires_at || null,
          data.created_by,
          now,
          now,
        ]
      );

      return { success: true, id };
    } catch (error) {
      console.error("Error creating landing page:", error);
      return { success: false, error: "Failed to create landing page" };
    }
  }

  // Get all landing pages
  static async getAll(
    filters: {
      status?: string;
      campaign_source?: string;
      created_by?: string;
      search?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    try {
      console.log("LandingPageActions.getAll called with filters:", filters);

      let sql = "SELECT * FROM LandingPages WHERE 1=1";
      const args: any[] = [];

      if (filters.status) {
        sql += " AND status = ?";
        args.push(filters.status);
      }

      if (filters.campaign_source) {
        sql += " AND campaign_source = ?";
        args.push(filters.campaign_source);
      }

      if (filters.created_by) {
        sql += " AND created_by = ?";
        args.push(filters.created_by);
      }

      if (filters.search) {
        sql += " AND (title LIKE ? OR description LIKE ? OR slug LIKE ?)";
        const searchTerm = `%${filters.search}%`;
        args.push(searchTerm, searchTerm, searchTerm);
      }

      sql += " ORDER BY updated_at DESC";

      if (filters.limit) {
        sql += " LIMIT ?";
        args.push(filters.limit);

        if (filters.offset) {
          sql += " OFFSET ?";
          args.push(filters.offset);
        }
      }

      console.log("LandingPageActions.getAll SQL:", sql);
      console.log("LandingPageActions.getAll args:", args);

      const result = await db.execute(sql, args);

      console.log(
        "LandingPageActions.getAll DB result rows count:",
        result.rows.length
      );
      console.log("LandingPageActions.getAll DB result raw:", result.rows);

      const landingPages = result.rows.map((row) => ({
        ...row,
        content: JSON.parse((row.content as string) || "[]"),
        settings: JSON.parse((row.settings as string) || "{}"),
      }));

      console.log(
        "LandingPageActions.getAll processed landing pages:",
        landingPages
      );

      return { success: true, data: landingPages };
    } catch (error) {
      console.error("Error fetching landing pages:", error);
      return { success: false, error: "Failed to fetch landing pages" };
    }
  }

  // Get count of landing pages with filters
  static async getCount(
    filters: {
      status?: string;
      campaign_source?: string;
      created_by?: string;
      search?: string;
    } = {}
  ) {
    try {
      let sql = "SELECT COUNT(*) as count FROM LandingPages WHERE 1=1";
      const args: any[] = [];

      if (filters.status) {
        sql += " AND status = ?";
        args.push(filters.status);
      }

      if (filters.campaign_source) {
        sql += " AND campaign_source = ?";
        args.push(filters.campaign_source);
      }

      if (filters.created_by) {
        sql += " AND created_by = ?";
        args.push(filters.created_by);
      }

      if (filters.search) {
        sql += " AND (title LIKE ? OR description LIKE ? OR slug LIKE ?)";
        const searchPattern = `%${filters.search}%`;
        args.push(searchPattern, searchPattern, searchPattern);
      }

      const result = await db.execute(sql, args);
      const count = result.rows[0]?.count || 0;

      return { success: true, count: Number(count) };
    } catch (error) {
      console.error("Error counting landing pages:", error);
      return {
        success: false,
        error: "Failed to count landing pages",
        count: 0,
      };
    }
  }

  // Get landing page by ID
  static async getById(id: string) {
    try {
      const result = await db.execute(
        "SELECT * FROM LandingPages WHERE id = ?",
        [id]
      );

      if (result.rows.length === 0) {
        return { success: false, error: "Landing page not found" };
      }

      const row = result.rows[0];
      const landingPage = {
        ...row,
        content: JSON.parse((row.content as string) || "[]"),
        settings: JSON.parse((row.settings as string) || "{}"),
      };

      return { success: true, data: landingPage };
    } catch (error) {
      console.error("Error fetching landing page:", error);
      return { success: false, error: "Failed to fetch landing page" };
    }
  }

  // Get landing page by slug
  static async getBySlug(slug: string) {
    try {
      const result = await db.execute(
        "SELECT * FROM LandingPages WHERE slug = ?",
        [slug]
      );

      if (result.rows.length === 0) {
        return { success: false, error: "Landing page not found" };
      }

      const row = result.rows[0];
      const landingPage = {
        ...row,
        content: JSON.parse((row.content as string) || "[]"),
        settings: JSON.parse((row.settings as string) || "{}"),
      };

      return { success: true, data: landingPage };
    } catch (error) {
      console.error("Error fetching landing page:", error);
      return { success: false, error: "Failed to fetch landing page" };
    }
  }

  // Update landing page
  static async update(id: string, data: Partial<LandingPage>) {
    try {
      const updates: string[] = [];
      const args: any[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "id" && key !== "created_at" && value !== undefined) {
          updates.push(`${key} = ?`);

          if (key === "content" || key === "settings") {
            args.push(JSON.stringify(value));
          } else {
            args.push(value);
          }
        }
      });

      updates.push("updated_at = ?");
      args.push(new Date().toISOString());
      args.push(id);

      await db.execute(
        `UPDATE LandingPages SET ${updates.join(", ")} WHERE id = ?`,
        args
      );

      return { success: true };
    } catch (error) {
      console.error("Error updating landing page:", error);
      return { success: false, error: "Failed to update landing page" };
    }
  }

  // Delete landing page
  static async delete(id: string) {
    try {
      await db.execute("DELETE FROM LandingPages WHERE id = ?", [id]);

      return { success: true };
    } catch (error) {
      console.error("Error deleting landing page:", error);
      return { success: false, error: "Failed to delete landing page" };
    }
  }

  // Publish landing page
  static async publish(id: string) {
    try {
      await db.execute(
        "UPDATE LandingPages SET status = ?, published_at = ?, updated_at = ? WHERE id = ?",
        ["published", new Date().toISOString(), new Date().toISOString(), id]
      );

      return { success: true };
    } catch (error) {
      console.error("Error publishing landing page:", error);
      return { success: false, error: "Failed to publish landing page" };
    }
  }

  // Clone landing page
  static async clone(id: string, title: string, slug: string) {
    try {
      const originalResult = await this.getById(id);
      if (!originalResult.success) {
        return originalResult;
      }

      const original = originalResult.data as unknown as LandingPage;

      const cloneData = {
        ...original,
        title,
        slug,
        status: "draft" as const,
        published_at: undefined,
      };

      delete (cloneData as any).id;
      delete (cloneData as any).created_at;
      delete (cloneData as any).updated_at;

      return await this.create(cloneData);
    } catch (error) {
      console.error("Error cloning landing page:", error);
      return { success: false, error: "Failed to clone landing page" };
    }
  }
}

// Component Template CRUD Operations
export class ComponentTemplateActions {
  // Get all component templates
  static async getAll(type?: string) {
    try {
      let sql = "SELECT * FROM LandingPageComponents WHERE 1=1";
      const args: any[] = [];

      if (type) {
        sql += " AND type = ?";
        args.push(type);
      }

      sql += " ORDER BY is_system DESC, name ASC";

      const result = await db.execute(sql, args);

      const components = result.rows.map((row) => ({
        ...row,
        config: JSON.parse((row.config as string) || "{}"),
        is_system: Boolean(row.is_system),
      }));

      return { success: true, data: components };
    } catch (error) {
      console.error("Error fetching component templates:", error);
      return { success: false, error: "Failed to fetch component templates" };
    }
  }

  // Create component template
  static async create(
    data: Omit<ComponentTemplate, "id" | "created_at" | "updated_at">
  ) {
    const id = uuidv4();
    const now = new Date().toISOString();

    try {
      await db.execute(
        `INSERT INTO LandingPageComponents (
          id, name, type, config, preview_image, is_system, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.name,
          data.type,
          JSON.stringify(data.config),
          data.preview_image || null,
          data.is_system ? 1 : 0,
          data.created_by || null,
          now,
          now,
        ]
      );

      return { success: true, id };
    } catch (error) {
      console.error("Error creating component template:", error);
      return { success: false, error: "Failed to create component template" };
    }
  }

  // Update component template
  static async update(id: string, data: Partial<ComponentTemplate>) {
    try {
      const updates: string[] = [];
      const args: any[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "id" && key !== "created_at" && value !== undefined) {
          updates.push(`${key} = ?`);

          if (key === "config") {
            args.push(JSON.stringify(value));
          } else if (key === "is_system") {
            args.push(value ? 1 : 0);
          } else {
            args.push(value);
          }
        }
      });

      updates.push("updated_at = ?");
      args.push(new Date().toISOString());
      args.push(id);

      await db.execute(
        `UPDATE LandingPageComponents SET ${updates.join(", ")} WHERE id = ?`,
        args
      );

      return { success: true };
    } catch (error) {
      console.error("Error updating component template:", error);
      return { success: false, error: "Failed to update component template" };
    }
  }

  // Delete component template
  static async delete(id: string) {
    try {
      await db.execute(
        "DELETE FROM LandingPageComponents WHERE id = ? AND is_system = 0",
        [id]
      );

      return { success: true };
    } catch (error) {
      console.error("Error deleting component template:", error);
      return { success: false, error: "Failed to delete component template" };
    }
  }
}

// Analytics functions
export class LandingPageAnalytics {
  // Track page visit
  static async trackVisit(
    landingPageId: string,
    source: string = "direct",
    deviceType: string = "desktop"
  ) {
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    try {
      // Check if record exists for today
      const existing = await db.execute(
        "SELECT id, visit_count FROM LandingPageAnalytics WHERE landing_page_id = ? AND date = ? AND source = ? AND device_type = ?",
        [landingPageId, date, source, deviceType]
      );

      if (existing.rows.length > 0) {
        // Update existing record
        await db.execute(
          "UPDATE LandingPageAnalytics SET visit_count = visit_count + 1 WHERE id = ?",
          [existing.rows[0].id]
        );
      } else {
        // Create new record
        await db.execute(
          "INSERT INTO LandingPageAnalytics (id, landing_page_id, visit_count, source, device_type, date) VALUES (?, ?, 1, ?, ?, ?)",
          [uuidv4(), landingPageId, source, deviceType, date]
        );
      }

      return { success: true };
    } catch (error) {
      console.error("Error tracking visit:", error);
      return { success: false, error: "Failed to track visit" };
    }
  }

  // Track conversion
  static async trackConversion(
    landingPageId: string,
    source: string = "direct",
    deviceType: string = "desktop"
  ) {
    const date = new Date().toISOString().split("T")[0];

    try {
      const existing = await db.execute(
        "SELECT id, conversion_count FROM LandingPageAnalytics WHERE landing_page_id = ? AND date = ? AND source = ? AND device_type = ?",
        [landingPageId, date, source, deviceType]
      );

      if (existing.rows.length > 0) {
        await db.execute(
          "UPDATE LandingPageAnalytics SET conversion_count = conversion_count + 1 WHERE id = ?",
          [existing.rows[0].id]
        );
      } else {
        await db.execute(
          "INSERT INTO LandingPageAnalytics (id, landing_page_id, conversion_count, source, device_type, date) VALUES (?, ?, 1, ?, ?, ?)",
          [uuidv4(), landingPageId, source, deviceType, date]
        );
      }

      return { success: true };
    } catch (error) {
      console.error("Error tracking conversion:", error);
      return { success: false, error: "Failed to track conversion" };
    }
  }

  // Get analytics for landing page
  static async getAnalytics(
    landingPageId: string,
    startDate?: string,
    endDate?: string
  ) {
    try {
      let sql = "SELECT * FROM LandingPageAnalytics WHERE landing_page_id = ?";
      const args = [landingPageId];

      if (startDate) {
        sql += " AND date >= ?";
        args.push(startDate);
      }

      if (endDate) {
        sql += " AND date <= ?";
        args.push(endDate);
      }

      sql += " ORDER BY date DESC";

      const result = await db.execute(sql, args);

      return { success: true, data: result.rows };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return { success: false, error: "Failed to fetch analytics" };
    }
  }
}
