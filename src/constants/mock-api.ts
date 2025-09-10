////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter"; // For filtering

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Sample Product 1",
        description: "High-quality sample product for testing purposes",
        created_at: "2023-01-15T10:30:00.000Z",
        price: 29.99,
        photo_url: "https://api.slingacademy.com/public/sample-products/1.png",
        category: "Electronics",
        updated_at: "2023-12-01T08:15:00.000Z",
      },
      {
        id: 2,
        name: "Sample Product 2",
        description: "Another great sample product for demonstration",
        created_at: "2023-02-20T14:45:00.000Z",
        price: 15.5,
        photo_url: "https://api.slingacademy.com/public/sample-products/2.png",
        category: "Furniture",
        updated_at: "2023-11-15T16:30:00.000Z",
      },
      {
        id: 3,
        name: "Sample Product 3",
        description: "Premium sample product with excellent features",
        created_at: "2023-03-10T09:20:00.000Z",
        price: 45.75,
        photo_url: "https://api.slingacademy.com/public/sample-products/3.png",
        category: "Clothing",
        updated_at: "2023-10-20T12:45:00.000Z",
      },
      {
        id: 4,
        name: "Sample Product 4",
        description: "Affordable sample product for everyday use",
        created_at: "2023-04-05T16:10:00.000Z",
        price: 8.99,
        photo_url: "https://api.slingacademy.com/public/sample-products/4.png",
        category: "Toys",
        updated_at: "2023-09-30T11:20:00.000Z",
      },
      {
        id: 5,
        name: "Sample Product 5",
        description: "Professional grade sample product for advanced users",
        created_at: "2023-05-12T11:55:00.000Z",
        price: 125.0,
        photo_url: "https://api.slingacademy.com/public/sample-products/5.png",
        category: "Electronics",
        updated_at: "2023-08-25T14:10:00.000Z",
      },
    ];

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search,
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ["name", "description", "category"],
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search,
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split(".") : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search,
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: "Sample data for testing and learning purposes",
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts,
    };
  },

  // Get a specific product by its ID
  async getProductById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${id} not found`,
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${id} found`,
      product,
    };
  },
};

// Initialize sample products
fakeProducts.initialize();
