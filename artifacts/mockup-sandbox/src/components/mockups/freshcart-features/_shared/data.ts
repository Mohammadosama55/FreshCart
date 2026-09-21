export type Address = {
  id: string;
  label: string;
  recipient: string;
  lines: string;
  note: string;
};

export const addresses: Address[] = [
  { id: "home", label: "Home", recipient: "Ananya Rao", lines: "14, Palm Grove Apartments, HSR Layout, Bengaluru 560102", note: "Usually delivered to the security desk" },
  { id: "work", label: "Work", recipient: "Ananya Rao", lines: "Level 5, Cedar House, Koramangala 3rd Block, Bengaluru 560034", note: "Call when you reach the lobby" },
];

export const orders = [
  { id: "#FC-48291", date: "18 May 2024", items: "12 items", total: 846, status: "Delivered", product: "Farm fresh pantry staples" },
  { id: "#FC-47508", date: "11 May 2024", items: "8 items", total: 512, status: "Delivered", product: "Weekend breakfast basket" },
  { id: "#FC-46844", date: "03 May 2024", items: "15 items", total: 1278, status: "Delivered", product: "Monthly kitchen restock" },
];

export const products = [
  { id: "tomatoes", name: "Premium Roma Tomatoes", category: "Fresh produce", price: 48, unit: "500 g", rating: 4.8, reviews: 126, available: true, image: "/__mockup/images/freshcart-tomatoes.png", badge: "Picked this morning" },
  { id: "rice", name: "Daawat Super Basmati Rice", category: "Staples", price: 189, unit: "1 kg", rating: 4.6, reviews: 84, available: true, image: "/__mockup/images/freshcart-rice.png", badge: "Pantry favourite" },
  { id: "milk", name: "Nandini Toned Milk", category: "Dairy & eggs", price: 29, unit: "500 ml", rating: 4.9, reviews: 241, available: true, image: "/__mockup/images/freshcart-basket.png", badge: "Daily essential" },
  { id: "mango", name: "Alphonso Mangoes", category: "Fresh produce", price: 399, unit: "1 dozen", rating: 4.4, reviews: 58, available: false, image: "/__mockup/images/freshcart-basket.png", badge: "Seasonal pick" },
  { id: "atta", name: "Aashirvaad Whole Wheat Atta", category: "Staples", price: 272, unit: "5 kg", rating: 4.7, reviews: 196, available: true, image: "/__mockup/images/freshcart-rice.png", badge: "Best value" },
  { id: "paneer", name: "Milky Mist Fresh Paneer", category: "Dairy & eggs", price: 114, unit: "200 g", rating: 4.5, reviews: 72, available: true, image: "/__mockup/images/freshcart-basket.png", badge: "Made today" },
];

export const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;