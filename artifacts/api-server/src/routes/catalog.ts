import { Router, type IRouter } from "express";
import {
  GetCatalogHighlightsResponse,
  ListCategoriesResponse,
  ListProductsQueryParams,
  ListProductsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const products = [
  {
    id: "alphonso-mangoes",
    name: "Alphonso Mangoes",
    category: "Fruits",
    price: 349,
    compareAtPrice: 399,
    unit: "1 kg",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=85",
    accent: "#fff1c7",
    badge: "Seasonal",
    featured: true,
  },
  {
    id: "avocado-hass",
    name: "Hass Avocado",
    category: "Fruits",
    price: 179,
    compareAtPrice: 219,
    unit: "2 pieces",
    image:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=85",
    accent: "#e4f4d2",
    badge: "Popular",
    featured: true,
  },
  {
    id: "baby-spinach",
    name: "Baby Spinach",
    category: "Vegetables",
    price: 79,
    compareAtPrice: null,
    unit: "200 g",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=85",
    accent: "#dff2dc",
    badge: "Farm fresh",
    featured: true,
  },
  {
    id: "cherry-tomatoes",
    name: "Cherry Tomatoes",
    category: "Vegetables",
    price: 99,
    compareAtPrice: 119,
    unit: "250 g",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85",
    accent: "#ffe2d9",
    badge: null,
    featured: true,
  },
  {
    id: "sourdough-loaf",
    name: "Country Sourdough",
    category: "Bakery",
    price: 189,
    compareAtPrice: null,
    unit: "400 g",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
    accent: "#f4e2c7",
    badge: "Baked today",
    featured: true,
  },
  {
    id: "greek-yogurt",
    name: "Greek Yogurt",
    category: "Dairy",
    price: 149,
    compareAtPrice: 169,
    unit: "400 g",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",
    accent: "#e4eff9",
    badge: "High protein",
    featured: false,
  },
  {
    id: "cold-pressed-juice",
    name: "Orange Cold-Pressed Juice",
    category: "Drinks",
    price: 129,
    compareAtPrice: null,
    unit: "300 ml",
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=900&q=85",
    accent: "#ffe6bf",
    badge: "No added sugar",
    featured: false,
  },
  {
    id: "masala-oats",
    name: "Masala Oats",
    category: "Pantry",
    price: 109,
    compareAtPrice: 129,
    unit: "500 g",
    image:
      "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=900&q=85",
    accent: "#f9e7c7",
    badge: "Value pick",
    featured: false,
  },
  {
    id: "basmati-rice",
    name: "Everyday Basmati Rice",
    category: "Pantry",
    price: 239,
    compareAtPrice: 279,
    unit: "5 kg",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=85",
    accent: "#f2efdf",
    badge: null,
    featured: false,
  },
  {
    id: "dark-chocolate",
    name: "70% Dark Chocolate",
    category: "Treats",
    price: 159,
    compareAtPrice: 189,
    unit: "100 g",
    image:
      "https://images.unsplash.com/photo-1548907040-4d42bfc2e4b8?auto=format&fit=crop&w=900&q=85",
    accent: "#f1ded8",
    badge: "New",
    featured: false,
  },
  {
    id: "pink-lady-apples",
    name: "Pink Lady Apples",
    category: "Fruits",
    price: 219,
    compareAtPrice: null,
    unit: "1 kg",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85",
    accent: "#ffe4e1",
    badge: null,
    featured: false,
  },
  {
    id: "paneer-fresh",
    name: "Fresh Malai Paneer",
    category: "Dairy",
    price: 189,
    compareAtPrice: null,
    unit: "200 g",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85",
    accent: "#f7edcf",
    badge: "Local dairy",
    featured: false,
  },
];

const categories = [
  { id: "Fruits", name: "Fruits", count: 18, icon: "fruit" },
  { id: "Vegetables", name: "Vegetables", count: 24, icon: "vegetable" },
  { id: "Dairy", name: "Dairy & eggs", count: 12, icon: "dairy" },
  { id: "Bakery", name: "Bakery", count: 9, icon: "bakery" },
  { id: "Pantry", name: "Pantry", count: 31, icon: "pantry" },
  { id: "Drinks", name: "Drinks", count: 15, icon: "drinks" },
  { id: "Treats", name: "Treats", count: 14, icon: "treats" },
];

router.get("/products", (req, res) => {
  const query = ListProductsQueryParams.parse(req.query);
  const search = query.search?.trim().toLowerCase();
  const data = products.filter((product) => {
    const matchesCategory = !query.category || product.category === query.category;
    const matchesSearch =
      !search ||
      `${product.name} ${product.category}`.toLowerCase().includes(search);
    const matchesFeatured = query.featured === undefined || product.featured === query.featured;
    return matchesCategory && matchesSearch && matchesFeatured;
  });

  res.json(ListProductsResponse.parse(data));
});

router.get("/categories", (_req, res) => {
  res.json(ListCategoriesResponse.parse(categories));
});

router.get("/catalog/highlights", (_req, res) => {
  res.json(
    GetCatalogHighlightsResponse.parse({
      headline: "Fresh groceries, right on time.",
      subheadline: "Your neighborhood store, delivered in under 30 minutes.",
      deliveryWindow: "15–30 min",
      minimumOrder: 199,
      freeDeliveryThreshold: 499,
    }),
  );
});

export { products };
export default router;