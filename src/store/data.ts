export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  description: string;
}

export const mockProducts: Product[] = [
  { id: 'p1', brand: 'AllSaints', title: 'Oversized Leather Bomber', price: 8999, originalPrice: 8999, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800', description: 'A premium heavyweight leather bomber jacket. A classic investment piece.' },
  { id: 'p2', brand: 'Nike', title: 'Air Runner V1', price: 4999, originalPrice: 4999, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', description: 'High-performance running shoes with breathable mesh and responsive cushioning.' },
  { id: 'p3', brand: 'New Balance', title: 'Street Glide X', price: 4599, originalPrice: 4599, imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800', description: 'Everyday lifestyle sneakers offering all-day comfort and retro aesthetics.' },
  { id: 'p4', brand: 'SuitSupply', title: 'Formal Velvet Blazer', price: 6499, originalPrice: 6499, imageUrl: 'https://images.unsplash.com/photo-1594938298596-39e51dd68571?auto=format&fit=crop&q=80&w=800', description: 'An elegant deep-navy velvet blazer tailored for weddings and evening occasions.' },
  { id: 'p5', brand: 'Artisan', title: 'Vintage Silver Cuff', price: 1299, originalPrice: 1299, imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', description: 'Hand-hammered sterling silver cuff bracelet. Unique statement accessory.' },
  { id: 'p6', brand: 'Uniqlo', title: 'Heavyweight Blank Tee', price: 999, originalPrice: 999, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', description: 'The perfect essential t-shirt. Thick cotton, boxy fit, built to last.' },
  { id: 'p7', brand: 'Zara', title: 'Pleated Wide Leg Trousers', price: 2999, originalPrice: 3499, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800', description: 'High-waisted pleated trousers with a relaxed, flowing fit.' },
  { id: 'p8', brand: 'Ray-Ban', title: 'Classic Aviator Sunglasses', price: 5499, originalPrice: 5499, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800', description: 'Timeless aviator frames with polarized lenses and gold detailing.' },
  { id: 'p9', brand: 'Levi\'s', title: '501 Original Fit Jeans', price: 3299, originalPrice: 4299, imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800', description: 'The original straight fit jeans that started it all. Raw indigo wash.' },
  { id: 'p10', brand: 'Patagonia', title: 'Fleece Zip Vest', price: 3999, originalPrice: 3999, imageUrl: 'https://images.unsplash.com/photo-1588622152666-6b83f510be13?auto=format&fit=crop&q=80&w=800', description: 'Recycled polyester fleece vest for core warmth in transitional weather.' },
  { id: 'p11', brand: 'Cos', title: 'Merino Wool Turtleneck', price: 4599, originalPrice: 5999, imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800', description: 'Ultra-soft fine merino wool turtleneck in a sleek, minimalist cut.' },
  { id: 'p12', brand: 'Birkenstock', title: 'Boston Soft Footbed', price: 6999, originalPrice: 6999, imageUrl: 'https://images.unsplash.com/photo-1603195221379-998826720d20?auto=format&fit=crop&q=80&w=800', description: 'Suede leather clog with the signature cork footbed for unmatched comfort.' },
  { id: 'p13', brand: 'Acne Studios', title: 'Mohair Beanie', price: 2999, originalPrice: 2999, imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800', description: 'Chunky ribbed knit beanie spun from a soft mohair blend.' },
  { id: 'p14', brand: 'H&M', title: 'Linen Resort Shirt', price: 1499, originalPrice: 1999, imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&q=80&w=800', description: 'Breathable linen-blend shirt with a relaxed camp collar.' },
  { id: 'p15', brand: 'Adidas', title: 'Samba OG', price: 7999, originalPrice: 7999, imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&q=80&w=800', description: 'The iconic low-profile silhouette with soft leather and suede overlays.' },
  { id: 'p16', brand: 'Common Projects', title: 'Achilles Low', price: 18999, originalPrice: 18999, imageUrl: 'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&q=80&w=800', description: 'Minimalist luxury sneakers handmade in Italy from premium nappa leather.' },
  { id: 'p17', brand: 'Carhartt WIP', title: 'Detroit Jacket', price: 8499, originalPrice: 8499, imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800', description: 'Rugged canvas work jacket with a corduroy collar and blanket lining.' },
  { id: 'p18', brand: 'Aesop', title: 'Resurrection Hand Balm', price: 2199, originalPrice: 2199, imageUrl: 'https://images.unsplash.com/photo-1629198725800-4b52b21762c4?auto=format&fit=crop&q=80&w=800', description: 'A rich, readily absorbed moisturizing balm for labor-wearied hands and cuticles.' },
  { id: 'p19', brand: 'Salomon', title: 'XT-6 Advanced', price: 15999, originalPrice: 15999, imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800', description: 'Trail running shoe adapted for city life. Lightweight and exceptionally durable.' },
  { id: 'p20', brand: 'Everlane', title: 'Cashmere Crew', price: 9999, originalPrice: 12999, imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800', description: 'Grade-A cashmere sweater that gets softer with every wear.' },
  { id: 'p21', brand: 'Arc\'teryx', title: 'Beta AR Jacket', price: 35000, originalPrice: 35000, imageUrl: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&q=80&w=800', description: 'Versatile GORE-TEX PRO shell for severe alpine conditions and city rain.' },
  { id: 'p22', brand: 'Vejas', title: 'Campo Sneakers', price: 11999, originalPrice: 11999, imageUrl: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=800', description: 'Chrome-free leather sneakers with wild rubber soles sourced from the Amazon.' },
  { id: 'p23', brand: 'A.P.C.', title: 'Half-Moon Bag', price: 28999, originalPrice: 28999, imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800', description: 'Iconic smooth leather shoulder bag with a distinct curved silhouette.' },
  { id: 'p24', brand: 'Stüssy', title: 'Fuzzy Dice Tee', price: 3499, originalPrice: 3499, imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800', description: 'Classic streetwear graphic tee printed on heavyweight cotton.' },
];
