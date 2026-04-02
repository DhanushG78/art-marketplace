import { AppConfig } from '../types/config';

export const appConfig: AppConfig = {
  appName: "Art & Handmade Marketplace",

  entity: {
    name: "Artwork",
    route: "artworks",
  },

  fields: [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "price", label: "Price", type: "number" },
    { name: "category", label: "Category", type: "select", options: ["painting", "sculpture", "craft", "digital", "photography"] },
    { name: "artistName", label: "Artist Name", type: "text" },

    { name: "style", label: "Style", type: "text" },
    { name: "dimensions", label: "Dimensions", type: "text" },
    { name: "isHandmade", label: "Handmade", type: "boolean" },
    { name: "image", label: "Artwork Image URL", type: "file" }
  ],

  ui: {
    showImage: true,
    showPrice: true
  },

  features: {
    auth: true,
    admin: true,
  },
};