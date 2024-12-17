import { Op } from "sequelize";

export interface SearchParams {
  languages?: string[]; // Array of language strings
  levels?: string[];    // Array of levels (e.g., beginner, intermediate, advanced)
  category?: string[];  // Array of category strings
  rating?: number;      // Minimum rating
  query?: string;       // Search query string
  sort_by?: string;     // Field to sort by (e.g., title, price)
  sort_direction?: "ASC" | "DESC"; // Sort direction
  page?: number;        // Pagination page number
}
