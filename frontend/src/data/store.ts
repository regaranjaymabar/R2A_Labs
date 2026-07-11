export type Store = {
  id: number;
  laptopId: number;
  name: string;
  storeImage?: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviews: number;
  phone: string;
  open: string;
  mapsUrl: string;
  specialPrice: number;
  available: boolean;
  distance?: number | null;
};

export const stores: Store[] = [
  {
      id: 1,
      laptopId: 1,
      name: "ASUS Exclusive Store Bandung",
      storeImage: "https://cdn.antaranews.com/cache/1200x800/2022/02/10/image002.jpg.webp",
      address: "Jl. Asia Afrika No.102, Bandung",
      latitude: -6.9218,
      longitude: 107.6072,
      rating: 4.9,
      reviews: 412,
      phone: "022-7200001",
      open: "09:00 - 21:00",
      mapsUrl: "https://maps.google.com/?q=ASUS+Exclusive+Store+Bandung",
      specialPrice: 17399000,
      available: true
  },
  {
      id: 2,
      laptopId: 1,
      name: "BEC Laptop Center",
      storeImage: "https://sanepo.com/wp-content/uploads/2023/03/Rekomendasi-Toko-Laptop-BEC-Bandung-Temukan-yang-Terbaik.jpg",
      address: "Bandung Electronic Center",
      latitude: -6.9037,
      longitude: 107.6186,
      rating: 4.8,
      reviews: 652,
      phone: "022-7200002",
      open: "09:00 - 20:00",
      mapsUrl: "https://maps.google.com/?q=BEC+Laptop+Center",
      specialPrice: 17299000,
      available: true
  },
  {
      id: 3,
      laptopId: 1,
      name: "Electronic City Bandung",
      storeImage: "https://www.kliknklik.com/wp-content/uploads/2022/07/IMG_20220603_113756-scaled.jpg",
      address: "Jl. Soekarno Hatta No.321",
      latitude: -6.9397,
      longitude: 107.6339,
      rating: 4.7,
      reviews: 310,
      phone: "022-7200003",
      open: "10:00 - 22:00",
      mapsUrl: "https://maps.google.com/?q=Electronic+City+Bandung",
      specialPrice: 17549000,
      available: true
  },

  // ================= Laptop 2 =================
  {
      id: 4,
      laptopId: 2,
      name: "ASUS Exclusive Store Jakarta",
      address: "Mall Taman Anggrek",
      latitude: -6.1782,
      longitude: 106.7925,
      rating: 4.9,
      reviews: 611,
      phone: "021-8000001",
      open: "10:00 - 22:00",
      mapsUrl: "https://maps.google.com/?q=ASUS+Exclusive+Store+Jakarta",
      specialPrice: 24799000,
      available: true
  },
  {
      id: 5,
      laptopId: 2,
      name: "Enter Komputer",
      address: "Mangga Dua Mall",
      latitude: -6.1377,
      longitude: 106.8255,
      rating: 4.9,
      reviews: 1200,
      phone: "021-8000002",
      open: "09:00 - 21:00",
      mapsUrl: "https://maps.google.com/?q=Enter+Komputer+Mangga+Dua",
      specialPrice: 24699000,
      available: true
  },
  {
      id: 6,
      laptopId: 2,
      name: "Bhinneka Store",
      address: "Jl. Gunung Sahari",
      latitude: -6.1509,
      longitude: 106.8435,
      rating: 4.8,
      reviews: 522,
      phone: "021-8000003",
      open: "09:00 - 20:00",
      mapsUrl: "https://maps.google.com/?q=Bhinneka+Store",
      specialPrice: 24999000,
      available: true
  },

  // ================= Laptop 3 =================
  {
      id: 7,
      laptopId: 3,
      name: "Lenovo Exclusive Store",
      address: "Pakuwon Mall Surabaya",
      latitude: -7.2891,
      longitude: 112.6733,
      rating: 4.8,
      reviews: 462,
      phone: "031-8100001",
      open: "10:00 - 22:00",
      mapsUrl: "https://maps.google.com/?q=Lenovo+Exclusive+Store+Pakuwon+Mall",
      specialPrice: 16849000,
      available: true
  },
  {
      id: 8,
      laptopId: 3,
      name: "Sentra Laptop Surabaya",
      address: "Jl. Raya Darmo",
      latitude: -7.2828,
      longitude: 112.7392,
      rating: 4.7,
      reviews: 312,
      phone: "031-8100002",
      open: "09:00 - 21:00",
      mapsUrl: "https://maps.google.com/?q=Sentra+Laptop+Surabaya",
      specialPrice: 16999000,
      available: true
  },
  {
      id: 9,
      laptopId: 3,
      name: "Electronic City Surabaya",
      address: "Galaxy Mall",
      latitude: -7.2758,
      longitude: 112.7826,
      rating: 4.6,
      reviews: 220,
      phone: "031-8100003",
      open: "10:00 - 22:00",
      mapsUrl: "https://maps.google.com/?q=Electronic+City+Galaxy+Mall",
      specialPrice: 17049000,
      available: true
  },

  // ================= Laptop 4 =================
  {
      id: 10,
      laptopId: 4,
      name: "HP Store Semarang",
      address: "Paragon Mall",
      latitude: -6.9838,
      longitude: 110.4091,
      rating: 4.8,
      reviews: 411,
      phone: "024-8100001",
      open: "09:00 - 21:00",
      mapsUrl: "https://maps.google.com/?q=HP+Store+Paragon+Mall",
      specialPrice: 11799000,
      available: true
  },
  {
      id: 11,
      laptopId: 4,
      name: "Global Computer",
      address: "Jl. Pandanaran",
      latitude: -6.9902,
      longitude: 110.4203,
      rating: 4.7,
      reviews: 268,
      phone: "024-8100002",
      open: "09:00 - 20:00",
      mapsUrl: "https://maps.google.com/?q=Global+Computer+Semarang",
      specialPrice: 11899000,
      available: true
  },
  {
      id: 12,
      laptopId: 4,
      name: "Semarang Laptop Center",
      address: "Simpang Lima",
      latitude: -6.9932,
      longitude: 110.4208,
      rating: 4.6,
      reviews: 180,
      phone: "024-8100003",
      open: "10:00 - 22:00",
      mapsUrl: "https://maps.google.com/?q=Semarang+Laptop+Center",
      specialPrice: 11949000,
      available: true
  },

  // ================= Laptop 5 =================
  {
      id: 13, laptopId: 5, name: "Acer Store Yogyakarta", address: "Malioboro Mall", latitude: -7.7928, longitude: 110.3658, rating: 4.8, reviews: 342, phone: "0274-810001", open: "09:00 - 21:00", mapsUrl: "https://maps.google.com/?q=Acer+Store+Yogyakarta", specialPrice: 8799000,
      available: true
  },
  {
      id: 14, laptopId: 5, name: "Jogja Laptop", address: "Jl. Kaliurang", latitude: -7.765, longitude: 110.377, rating: 4.7, reviews: 221, phone: "0274-810002", open: "09:00 - 20:00", mapsUrl: "https://maps.google.com/?q=Jogja+Laptop", specialPrice: 8899000,
      available: true
  },
  {
      id: 15, laptopId: 5, name: "Electronic City Jogja", address: "Ambarukmo Plaza", latitude: -7.782, longitude: 110.401, rating: 4.6, reviews: 180, phone: "0274-810003", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=Electronic+City+Jogja", specialPrice: 8999000,
      available: true
  },

  // ================= Laptop 6 =================
  {
      id: 16, laptopId: 6, name: "Lenovo Legion Store", address: "Mall Kelapa Gading", latitude: -6.157, longitude: 106.907, rating: 4.9, reviews: 751, phone: "021-810001", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=Lenovo+Legion+Store", specialPrice: 21299000,
      available: true
  },
  {
      id: 17, laptopId: 6, name: "Enter Komputer", address: "Mangga Dua", latitude: -6.138, longitude: 106.826, rating: 4.9, reviews: 1300, phone: "021-810002", open: "09:00 - 21:00", mapsUrl: "https://maps.google.com/?q=Enter+Komputer", specialPrice: 21499000,
      available: true
  },
  {
      id: 18, laptopId: 6, name: "Bhinneka", address: "Gunung Sahari", latitude: -6.151, longitude: 106.843, rating: 4.8, reviews: 612, phone: "021-810003", open: "09:00 - 20:00", mapsUrl: "https://maps.google.com/?q=Bhinneka", specialPrice: 21399000,
      available: true
  },

  // ================= Laptop 7 =================
  {
      id: 19, laptopId: 7, name: "iBox", address: "Central Park Mall", latitude: -6.176, longitude: 106.791, rating: 4.9, reviews: 2400, phone: "021-820001", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=iBox", specialPrice: 19899000,
      available: true
  },
  {
      id: 20, laptopId: 7, name: "Digimap", address: "Grand Indonesia", latitude: -6.195, longitude: 106.821, rating: 4.8, reviews: 1100, phone: "021-820002", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=Digimap", specialPrice: 19999000,
      available: true
  },
  {
      id: 21, laptopId: 7, name: "Hello Store", address: "Pondok Indah Mall", latitude: -6.264, longitude: 106.784, rating: 4.8, reviews: 980, phone: "021-820003", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=Hello+Store", specialPrice: 19799000,
      available: true
  },

  // ================= Laptop 8 =================
  {
      id: 22, laptopId: 8, name: "ASUS ProArt Center", address: "PIK Avenue", latitude: -6.104, longitude: 106.741, rating: 4.9, reviews: 370, phone: "021-830001", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=ASUS+ProArt+Center", specialPrice: 32799000,
      available: true
  },
  {
      id: 23, laptopId: 8, name: "ASUS Exclusive", address: "Kota Kasablanka", latitude: -6.224, longitude: 106.842, rating: 4.8, reviews: 440, phone: "021-830002", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=ASUS+Exclusive", specialPrice: 32999000,
      available: true
  },


  // ================= Laptop 9 =================
  {
      id: 25, laptopId: 9, name: "MSI Store", address: "Mangga Dua", latitude: -6.139, longitude: 106.825, rating: 4.8, reviews: 410, phone: "021-840001", open: "09:00 - 21:00", mapsUrl: "https://maps.google.com/?q=MSI+Store", specialPrice: 28299000,
      available: true
  },
  {
      id: 26, laptopId: 9, name: "MSI Official", address: "Neo Soho", latitude: -6.177, longitude: 106.791, rating: 4.8, reviews: 320, phone: "021-840002", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=MSI+Official", specialPrice: 28399000,
      available: true
  },
  {
      id: 27, laptopId: 9, name: "Enter Komputer", address: "Mangga Dua", latitude: -6.138, longitude: 106.826, rating: 4.9, reviews: 1200, phone: "021-840003", open: "09:00 - 21:00", mapsUrl: "https://maps.google.com/?q=Enter+Komputer", specialPrice: 28199000,
      available: true
  },

  // ================= Laptop 11 =================
  {
      id: 31, laptopId: 11, name: "Lenovo Store Solo", address: "Solo Square", latitude: -7.566, longitude: 110.815, rating: 4.7, reviews: 280, phone: "0271-860001", open: "09:00 - 21:00", mapsUrl: "https://maps.google.com/?q=Lenovo+Store+Solo", specialPrice: 6399000,
      available: true
  },
  {
      id: 32, laptopId: 11, name: "Solo Laptop", address: "Jl. Slamet Riyadi", latitude: -7.568, longitude: 110.821, rating: 4.6, reviews: 160, phone: "0271-860002", open: "09:00 - 20:00", mapsUrl: "https://maps.google.com/?q=Solo+Laptop", specialPrice: 6499000,
      available: true
  },
  {
      id: 33, laptopId: 11, name: "Electronic City Solo", address: "The Park Mall", latitude: -7.585, longitude: 110.808, rating: 4.7, reviews: 220, phone: "0271-860003", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=Electronic+City+Solo", specialPrice: 6459900,
      available: true
  },

  // ================= Laptop 12 =================
  {
      id: 34, laptopId: 12, name: "Acer Predator Store", address: "Pakuwon Mall", latitude: -7.289, longitude: 112.673, rating: 4.9, reviews: 640, phone: "031-870001", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=Acer+Predator+Store", specialPrice: 29799000,
      available: true
  },
  {
      id: 35, laptopId: 12, name: "Acer Official", address: "Galaxy Mall", latitude: -7.276, longitude: 112.783, rating: 4.8, reviews: 500, phone: "031-870002", open: "10:00 - 22:00", mapsUrl: "https://maps.google.com/?q=Acer+Official", specialPrice: 29899000,
      available: true
  },
  {
      id: 36, laptopId: 12, name: "Sentra Laptop Surabaya", address: "Jl. Raya Darmo", latitude: -7.283, longitude: 112.739, rating: 4.8, reviews: 450, phone: "031-870003", open: "09:00 - 21:00", mapsUrl: "https://maps.google.com/?q=Sentra+Laptop+Surabaya", specialPrice: 29999000,
      available: true
  },
];