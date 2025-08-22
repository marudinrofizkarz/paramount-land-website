"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import db, { query, getMany, getOne } from "@/lib/database";
import { uploadToCloudinary } from "@/lib/cloudinary";

// Base64 image upload helper
async function uploadBase64Image(
  base64String: string,
  folder: string = "hero-sliders"
) {
  if (!base64String || !base64String.startsWith("data:image")) {
    throw new Error("Invalid image format");
  }

  const result = await uploadToCloudinary(base64String, folder);

  if (!result.success || !result.url) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  return result.url;
}

// Create a new hero slider
export async function createHeroSlider(formData: FormData) {
  try {
    const id = uuidv4();
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const order = parseInt(formData.get("order") as string || "0");
    const isActive = formData.get("isActive") === "true" ? 1 : 0;
    const desktopImageBase64 = formData.get("desktopImage") as string;
    const mobileImageBase64 = formData.get("mobileImage") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const linkText = formData.get("linkText") as string;
    
    // Upload images to Cloudinary
    const desktopImage = await uploadBase64Image(desktopImageBase64);
    const mobileImage = await uploadBase64Image(mobileImageBase64);
    
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    
    // Create hero slider in database
    const result = await query(
      'INSERT INTO HeroSlider (id, title, subtitle, "order", isActive, desktopImage, mobileImage, linkUrl, linkText, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, subtitle, order, isActive, desktopImage, mobileImage, linkUrl, linkText, createdAt, updatedAt]
    );
    
    // Get the inserted record
    const heroSlider = await getOne('SELECT * FROM HeroSlider WHERE id = ?', [id]);
    
    // Convert isActive from 0/1 to boolean for frontend
    const formattedSlider = {
      ...heroSlider,
      isActive: heroSlider.isActive === 1
    };
    
    revalidatePath('/dashboard/hero-sliders');
    
    return { success: true, data: formattedSlider };
  } catch (error) {
    console.error('Error creating hero slider:', error);
    return { 
      success: false, 
      message: "Database Error: Failed to Create Hero Slider." 
    };
  }
}

// Get all hero sliders
export async function getHeroSliders() {
  try {
    const heroSliders = await getMany('SELECT * FROM HeroSlider ORDER BY "order" ASC');
    
    // Convert isActive from 0/1 to boolean for frontend
    const formattedSliders = heroSliders.map(slider => ({
      ...slider,
      isActive: slider.isActive === 1
    }));
    
    return { success: true, data: formattedSliders };
  } catch (error) {
    console.error('Error fetching hero sliders:', error);
    return { 
      success: false, 
      message: "Database Error: Failed to Fetch Hero Sliders." 
    };
  }
}

// Get public hero sliders (only active ones)
export async function getPublicHeroSliders() {
  try {
    const heroSliders = await getMany('SELECT * FROM HeroSlider WHERE isActive = 1 ORDER BY "order" ASC');
    
    // Convert isActive from 0/1 to boolean for frontend
    const formattedSliders = heroSliders.map(slider => ({
      ...slider,
      isActive: true
    }));
    
    return { success: true, data: formattedSliders };
  } catch (error) {
    console.error('Error fetching public hero sliders:', error);
    return { 
      success: false, 
      message: "Database Error: Failed to Fetch Hero Sliders." 
    };
  }
}

// Update a hero slider
export async function updateHeroSlider(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const order = parseInt(formData.get("order") as string || "0");
    const isActive = formData.get("isActive") === "true" ? 1 : 0;
    const desktopImageBase64 = formData.get("desktopImage") as string;
    const mobileImageBase64 = formData.get("mobileImage") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const linkText = formData.get("linkText") as string;
    
    // Get existing slider
    const existingSlider = await getOne('SELECT * FROM HeroSlider WHERE id = ?', [id]);
    
    if (!existingSlider) {
      return { 
        success: false, 
        message: "Hero Slider not found." 
      };
    }
    
    // Upload new images if they changed (starts with data:image)
    let desktopImage = existingSlider.desktopImage;
    let mobileImage = existingSlider.mobileImage;
    
    if (desktopImageBase64 && desktopImageBase64.startsWith('data:image')) {
      desktopImage = await uploadBase64Image(desktopImageBase64);
    }
    
    if (mobileImageBase64 && mobileImageBase64.startsWith('data:image')) {
      mobileImage = await uploadBase64Image(mobileImageBase64);
    }
    
    const updatedAt = new Date().toISOString();
    
    // Update hero slider
    await query(
      'UPDATE HeroSlider SET title = ?, subtitle = ?, "order" = ?, isActive = ?, desktopImage = ?, mobileImage = ?, linkUrl = ?, linkText = ?, updatedAt = ? WHERE id = ?',
      [title, subtitle, order, isActive, desktopImage, mobileImage, linkUrl, linkText, updatedAt, id]
    );
    
    // Get updated record
    const updatedSlider = await getOne('SELECT * FROM HeroSlider WHERE id = ?', [id]);
    
    // Convert isActive from 0/1 to boolean for frontend
    const formattedSlider = {
      ...updatedSlider,
      isActive: updatedSlider.isActive === 1
    };
    
    revalidatePath('/dashboard/hero-sliders');
    
    return { success: true, data: formattedSlider };
  } catch (error) {
    console.error('Error updating hero slider:', error);
    return { 
      success: false, 
      message: "Database Error: Failed to Update Hero Slider." 
    };
  }
}

// Delete a hero slider
export async function deleteHeroSlider(id: string) {
  try {
    await query('DELETE FROM HeroSlider WHERE id = ?', [id]);
    
    revalidatePath('/dashboard/hero-sliders');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting hero slider:', error);
    return { 
      success: false, 
      message: "Database Error: Failed to Delete Hero Slider." 
    };
  }
}

// Update the order of hero sliders
export async function updateHeroSlidersOrder(sliderIds: string[]) {
  try {
    // Update each slider's order
    for (let i = 0; i < sliderIds.length; i++) {
      await query('UPDATE HeroSlider SET "order" = ? WHERE id = ?', [i, sliderIds[i]]);
    }
    
    revalidatePath('/dashboard/hero-sliders');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating hero sliders order:', error);
    return { 
      success: false, 
      message: "Database Error: Failed to Update Hero Sliders Order." 
    };
  }
}
