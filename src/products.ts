export type Product = {
  id: string;
  name: string;
  category: 'Tech' | 'Home' | 'Style';
  description: string;
  priceCents: number;
  rating: string;
  imageUrl: string;
  imageAlt: string;
  featuredRank: number;
};

const image = (photo: string) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=720&q=82`;

export const products: Product[] = [
  {
    id: 'arc-headphones',
    name: 'Arc Wireless Headphones',
    category: 'Tech',
    description: 'Soft-touch over-ear comfort with a warm, balanced sound.',
    priceCents: 8990,
    rating: '4.8',
    imageUrl: image('photo-1505740420928-5e560c06d30e'),
    imageAlt: 'Black over-ear headphones on a warm neutral background',
    featuredRank: 1,
  },
  {
    id: 'field-watch',
    name: 'Field Notes Watch',
    category: 'Style',
    description: 'A clean everyday dial with a brushed steel finish.',
    priceCents: 12400,
    rating: '4.7',
    imageUrl: image('photo-1523275335684-37898b6baf30'),
    imageAlt: 'Minimal wristwatch with a dark strap',
    featuredRank: 2,
  },
  {
    id: 'instant-camera',
    name: 'Pocket Instant Camera',
    category: 'Tech',
    description: 'A little analog magic for weekends and wandering.',
    priceCents: 7490,
    rating: '4.6',
    imageUrl: image('photo-1516035069371-29a1b244cc32'),
    imageAlt: 'Compact black camera on a light tabletop',
    featuredRank: 3,
  },
  {
    id: 'table-lamp',
    name: 'Morrow Table Lamp',
    category: 'Home',
    description: 'Sculptural light with a soft glow for late evenings.',
    priceCents: 5890,
    rating: '4.9',
    imageUrl: image('photo-1507473885765-e6ed057f782c'),
    imageAlt: 'Warm modern table lamp illuminating a room',
    featuredRank: 4,
  },
  {
    id: 'weekender-tote',
    name: 'Everyday Canvas Tote',
    category: 'Style',
    description: 'Room for the little extras, built for daily carry.',
    priceCents: 3200,
    rating: '4.5',
    imageUrl: image('photo-1590874103328-eac38a683ce7'),
    imageAlt: 'Structured neutral canvas handbag',
    featuredRank: 5,
  },
  {
    id: 'pour-over-set',
    name: 'Sunday Pour-over Set',
    category: 'Home',
    description: 'A ceramic dripper and carafe for a slower morning.',
    priceCents: 4650,
    rating: '4.8',
    imageUrl: image('photo-1495474472287-4d71bcdd2085'),
    imageAlt: 'Fresh coffee poured into a ceramic cup',
    featuredRank: 6,
  },
];
