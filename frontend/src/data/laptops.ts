export interface Laptop {
  id: number;
  category: string;
  name: string;
  image: string;
  brand: string;
  price: string;
  priceValue: number;
  cpu: string;
  ram: string;
  storage: string;
  images: string[]; 
  gpu: string;
  display: string;
  refreshRate: string;
  battery: string;
  weight: string;
  os: string;
  color: string;
  shortDescription: string;
  description: string;
  rating: number;
  reviews: number;
  ports: string[];
  features: string[];
  pros: string[];
  cons: string[];
  performance: {
    office: number;
    programming: number;
    gaming: number;
    editing: number;
    rendering: number;
    ai: number;
  };
}

export const laptops: Laptop[] = [
    {
  id: 1,
  brand: "ASUS",
  category: "Pelajar",
  name: "ASUS Zenbook 14 OLED",
  image:
    "https://id.store.asus.com/media/catalog/product/z/e/zenbook_14_oled_ux3405ma_product_photo_3b_ponder_blue_10_indo_no_numpad_2400_3.png?width=382&height=382&store=id_ID&image-type=image",
  images: [
    "https://id.store.asus.com/media/catalog/product/z/e/zenbook_14_oled_ux3405ma_product_photo_3b_ponder_blue_10_indo_no_numpad_2400_3.png?width=382&height=382&store=id_ID&image-type=image",
    "https://dlcdnwebimgs.asus.com/gain/827c5809-1d54-487a-aad4-9b5c0aee3fb8/w800"
    
  ],
  price: "Rp 17.499.000",
  priceValue: 17499000,
  cpu: "Intel Core Ultra 7 155H",
  gpu: "Intel Arc Graphics",
  ram: "16GB LPDDR5X",
  storage: "512GB PCIe Gen4 SSD",
  display: "14 inch OLED 3K",
  refreshRate: "120Hz",
  battery: "75Wh",
  weight: "1.20 Kg",
  os: "Windows 11 Home",
  color: "Ponder Blue",
  shortDescription:
    "Laptop premium tipis untuk produktivitas, programming, dan content creation.",
  description:
    "ASUS Zenbook 14 OLED hadir dengan Intel Core Ultra terbaru, layar OLED 3K 120Hz, baterai tahan lama, dan bobot hanya 1.2 kg sehingga cocok untuk mahasiswa maupun profesional.",
  rating: 4.9,
  reviews: 324,

  ports: [
    "2x Thunderbolt 4",
    "USB-A 3.2",
    "HDMI 2.1",
    "Audio Jack"
  ],

  features: [
    "OLED HDR Display",
    "Intel AI Boost",
    "Dolby Atmos",
    "WiFi 6E",
    "Windows Hello",
    "MIL-STD 810H"
  ],

  pros: [
    "Layar OLED sangat tajam",
    "Ringan",
    "Baterai awet",
    "Speaker jernih"
  ],

  cons: [
    "RAM tidak bisa di-upgrade",
    "GPU hanya Intel Arc"
  ],

  performance: {
    office: 98,
    programming: 96,
    gaming: 72,
    editing: 90,
    rendering: 84,
    ai: 92
  },
},
  {
    id: 2,
    brand: "ASUS",
    category: "Gaming",
    name: "ROG Zephyrus G14",
    image:
      "https://dlcdnwebimgs.asus.com/gain/7583764C-92E3-413D-A5AD-4CB7D9713802/w1000/h732",
    images: [
      "https://dlcdnwebimgs.asus.com/gain/7583764C-92E3-413D-A5AD-4CB7D9713802/w1000/h732"
    ],
    price: "Rp 24.999.000",
    priceValue: 24999000,
    cpu: "AMD Ryzen 9 7940HS",
    gpu: "NVIDIA GeForce RTX 4060 8GB",
    ram: "16GB DDR5",
    storage: "1TB PCIe Gen4 SSD",
    display: "14 inch QHD+ ROG Nebula Display",
    refreshRate: "165Hz",
    battery: "76Wh",
    weight: "1.65 Kg",
    os: "Windows 11 Home",
    color: "Eclipse Gray",
    shortDescription:
      "Laptop gaming ultraportable berkinerja tinggi dengan desain premium dan stylish.",
    description:
      "ASUS ROG Zephyrus G14 mendefinisikan ulang laptop gaming portabel dengan memadukan prosesor AMD Ryzen 9 bertenaga tinggi dan grafis NVIDIA RTX 40-series ke dalam bodi 14 inci yang sangat ringkas dan ringan.",
    rating: 4.8,
    reviews: 152,
    ports: [
      "1x Type-C USB4",
      "1x USB 3.2 Gen 2 Type-C",
      "2x USB 3.2 Gen 2 Type-A",
      "1x HDMI 2.1",
      "1x Audio Jack"
    ],
    features: [
      "ROG Nebula Display",
      "AniMe Matrix LED",
      "ROG Intelligent Cooling",
      "Dolby Atmos Speaker",
      "WiFi 6E"
    ],
    pros: [
      "Performa gaming luar biasa",
      "Sangat ringan dan ringkas",
      "Layar jernih dan akurat",
      "Daya tahan baterai bagus"
    ],
    cons: [
      "Suhu bodi agak panas saat full load",
      "Suara kipas cukup bising pada mode Turbo"
    ],
    performance: {
      office: 96,
      programming: 94,
      gaming: 92,
      editing: 93,
      rendering: 91,
      ai: 88
    }
  },
  {
    id: 3,
    brand: "Lenovo",
    category: "Programmer",
    name: "Lenovo Yoga Slim 7i",
    image:
      "https://p4-ofp.static.pub/fes/cms/2023/02/08/xv4xloul3hr7nwvfsr994262rcduuo471350.png",
    images: [
      "https://p4-ofp.static.pub/fes/cms/2023/02/08/xv4xloul3hr7nwvfsr994262rcduuo471350.png",
      "https://p4-ofp.static.pub/fes/cms/2023/02/08/xv4xloul3hr7nwvfsr994262rcduuo471350.png",
      "https://p4-ofp.static.pub/fes/cms/2023/02/08/xv4xloul3hr7nwvfsr994262rcduuo471350.png"
    ],
    price: "Rp 16.999.000",
    priceValue: 16999000,
    cpu: "Intel Core Ultra 7 155H",
    gpu: "Intel Arc Graphics",
    ram: "16GB LPDDR5X",
    storage: "512GB PCIe Gen4 SSD",
    display: "14 inch PureSight OLED WUXGA",
    refreshRate: "90Hz",
    battery: "65Wh",
    weight: "1.39 Kg",
    os: "Windows 11 Home",
    color: "Storm Grey",
    shortDescription:
      "Laptop premium tipis yang cerdas dan bertenaga untuk komputasi profesional.",
    description:
      "Lenovo Yoga Slim 7i ditenagai oleh prosesor Intel Core Ultra terbaru yang memiliki NPU AI terdedikasi. Dibungkus dalam sasis aluminium premium yang kokoh serta layar OLED yang nyaman untuk bekerja berjam-jam.",
    rating: 4.7,
    reviews: 88,
    ports: [
      "2x Thunderbolt 4",
      "1x USB 3.2 Gen 1 Type-A",
      "1x HDMI 2.1",
      "1x Audio Jack"
    ],
    features: [
      "Lenovo AI Core Chip",
      "PureSight OLED Display",
      "Dolby Vision & Atmos",
      "IR Camera (Windows Hello)"
    ],
    pros: [
      "Keyboard khas Lenovo sangat nyaman",
      "Kinerja AI optimal berkat chip Intel Ultra",
      "Sasis kokoh dan mewah",
      "Layar OLED warna presisi"
    ],
    cons: [
      "RAM tidak bisa di-upgrade",
      "Ketersediaan port USB-A terbatas"
    ],
    performance: {
      office: 97,
      programming: 95,
      gaming: 70,
      editing: 88,
      rendering: 82,
      ai: 91
    }
  },
  {
    id: 4,
    brand: "HP",
    category: "Multimedia",
    name: "HP Victus 15",
    image:
      "https://www.hp.com/content/dam/sites/omen/worldwide/laptops/2022-victus-15-intel/Hero%20Image%201.png",
    images: [
      "https://www.hp.com/content/dam/sites/omen/worldwide/laptops/2022-victus-15-intel/Hero%20Image%201.png",
      "https://www.hp.com/content/dam/sites/omen/worldwide/laptops/2022-victus-15-intel/Hero%20Image%201.png",
      "https://www.hp.com/content/dam/sites/omen/worldwide/laptops/2022-victus-15-intel/Hero%20Image%201.png"
    ],
    price: "Rp 11.999.000",
    priceValue: 11999000,
    cpu: "Intel Core i5-13420H",
    gpu: "NVIDIA GeForce RTX 3050 4GB",
    ram: "8GB DDR5",
    storage: "512GB PCIe NVMe SSD",
    display: "15.6 inch FHD IPS",
    refreshRate: "144Hz",
    battery: "70Wh",
    weight: "2.29 Kg",
    os: "Windows 11 Home",
    color: "Mica Silver",
    shortDescription:
      "Laptop gaming entry-level dengan performa solid untuk gaming dan editing kasual.",
    description:
      "HP Victus 15 dirancang untuk gamer kasual dan pembuat konten pemula yang mencari keseimbangan antara harga dan performa. Dilengkapi layar besar 15.6 inci dengan refresh rate 144Hz yang mulus.",
    rating: 4.5,
    reviews: 210,
    ports: [
      "1x USB Type-C",
      "2x USB Type-A",
      "1x HDMI 2.1",
      "1x RJ-45 (Ethernet)",
      "1x Audio Jack"
    ],
    features: [
      "OMEN Gaming Hub",
      "Dual Speaker Bang & Olufsen",
      "Backlit Keyboard",
      "WiFi 6"
    ],
    pros: [
      "Harga sangat terjangkau",
      "Desain minimalis dan bersih",
      "Layar sudah 144Hz",
      "Sistem pendingin bekerja cukup baik"
    ],
    cons: [
      "RAM bawaan hanya 8GB",
      "Bodi plastik agak tebal"
    ],
    performance: {
      office: 90,
      programming: 88,
      gaming: 78,
      editing: 80,
      rendering: 76,
      ai: 72
    }
  },
  {
    id: 5,
    brand: "Acer",
    category: "Pelajar",
    name: "Acer Aspire 5 Slim",
    image:
      "https://gayatekno.id/wp-content/uploads/2020/12/Aspire-5-Slim-A514-54-3.png",
    images: [
      "https://gayatekno.id/wp-content/uploads/2020/12/Aspire-5-Slim-A514-54-3.png",
      "https://gayatekno.id/wp-content/uploads/2020/12/Aspire-5-Slim-A514-54-3.png",
      "https://gayatekno.id/wp-content/uploads/2020/12/Aspire-5-Slim-A514-54-3.png"
    ],
    price: "Rp 8.999.000",
    priceValue: 8999000,
    cpu: "Intel Core i5-1235U",
    gpu: "Intel Iris Xe Graphics",
    ram: "8GB DDR4",
    storage: "512GB PCIe Gen4 SSD",
    display: "14 inch FHD IPS",
    refreshRate: "60Hz",
    battery: "50Wh",
    weight: "1.45 Kg",
    os: "Windows 11 Home",
    color: "Steel Gray",
    shortDescription:
      "Laptop harian tipis dan ekonomis, sangat ideal untuk pelajar dan tugas harian.",
    description:
      "Acer Aspire 5 Slim menawarkan mobilitas tinggi dengan bodi tipis dan performa andal dari prosesor Intel Core i5 generasi ke-12, menjadikannya pilihan utama bagi pelajar dan mahasiswa untuk produktivitas harian.",
    rating: 4.4,
    reviews: 415,
    ports: [
      "1x USB Type-C",
      "3x USB Type-A",
      "1x HDMI 2.1",
      "1x RJ-45 (LAN)",
      "1x Audio Jack"
    ],
    features: [
      "Acer PurifiedVoice",
      "BluelightShield",
      "Elevated Hinge Design",
      "WiFi 6"
    ],
    pros: [
      "Value for money sangat tinggi",
      "RAM dan Storage masih bisa di-upgrade",
      "Desain tipis dan ringan",
      "Port konektivitas lengkap"
    ],
    cons: [
      "Akurasi warna layar standar",
      "Material bodi dominan plastik"
    ],
    performance: {
      office: 92,
      programming: 85,
      gaming: 50,
      editing: 70,
      rendering: 62,
      ai: 65
    }
  },
  {
    id: 6,
    brand: "Lenovo",
    category: "Gaming",
    name: "Lenovo Legion 5 Pro",
    image:
      "https://p2-ofp.static.pub//fes/cms/2025/07/07/x1xdznwzwyhbo8ur5rusuzs8srh7ds718781.png",
    images: [
      "https://p2-ofp.static.pub//fes/cms/2025/07/07/x1xdznwzwyhbo8ur5rusuzs8srh7ds718781.png",
      "https://p2-ofp.static.pub//fes/cms/2025/07/07/x1xdznwzwyhbo8ur5rusuzs8srh7ds718781.png",
      "https://p2-ofp.static.pub//fes/cms/2025/07/07/x1xdznwzwyhbo8ur5rusuzs8srh7ds718781.png"
    ],
    price: "Rp 21.499.000",
    priceValue: 21499000,
    cpu: "AMD Ryzen 7 7745HX",
    gpu: "NVIDIA GeForce RTX 4060 8GB",
    ram: "16GB DDR5",
    storage: "1TB PCIe Gen4 SSD",
    display: "16 inch WQXGA IPS 16:10",
    refreshRate: "165Hz",
    battery: "80Wh",
    weight: "2.50 Kg",
    os: "Windows 11 Home",
    color: "Onyx Grey",
    shortDescription:
      "Laptop gaming kelas berat dengan layar lega 16:10 untuk turnamen profesional.",
    description:
      "Lenovo Legion 5 Pro mengombinasikan kekuatan ekstrem prosesor AMD Ryzen 7 seri HX dan GPU RTX 4060, dipasangkan dengan sistem pendingin termal Legion Coldfront 5.0 demi performa gaming tanpa hambatan.",
    rating: 4.9,
    reviews: 189,
    ports: [
      "2x USB-C 3.2 Gen 2",
      "4x USB-A 3.2 Gen 1",
      "1x HDMI 2.1",
      "1x RJ-45 (LAN)",
      "1x Audio Jack"
    ],
    features: [
      "Legion Coldfront 5.0 Cooling",
      "Lenovo AI Engine+",
      "Nahimic Audio 3D",
      "NVIDIA G-SYNC Support"
    ],
    pros: [
      "Performa gaming kelas kompetitif",
      "Layar rasio 16:10 sangat lega",
      "Sistem pendingin salah satu yang terbaik",
      "Build quality sangat kokoh"
    ],
    cons: [
      "Adaptor charger berukuran besar",
      "Konsumsi daya baterai cukup boros"
    ],
    performance: {
      office: 96,
      programming: 95,
      gaming: 94,
      editing: 94,
      rendering: 93,
      ai: 89
    }
  },
  {
    id: 7,
    brand: "Apple",
    category: "Programmer",
    name: "MacBook Air M2",
    image:
      "https://www.apple.com/v/macbook-air/z/images/overview/hero/hero_static__c9sislzzicq6_large.png",
    images: [
      "https://www.apple.com/v/macbook-air/z/images/overview/hero/hero_static__c9sislzzicq6_large.png",
      "https://www.apple.com/v/macbook-air/z/images/overview/hero/hero_static__c9sislzzicq6_large.png",
      "https://www.apple.com/v/macbook-air/z/images/overview/hero/hero_static__c9sislzzicq6_large.png"
    ],
    price: "Rp 19.999.000",
    priceValue: 19999000,
    cpu: "Apple M2",
    gpu: "Apple M2 8-Core GPU",
    ram: "8GB Unified Memory",
    storage: "256GB SSD",
    display: "13.6 inch Liquid Retina Display",
    refreshRate: "60Hz",
    battery: "52.6Wh",
    weight: "1.24 Kg",
    os: "macOS",
    color: "Midnight",
    shortDescription:
      "Laptop ultra-ramping tanpa kipas dengan efisiensi daya super awet seharian penuh.",
    description:
      "Didesain ulang sepenuhnya menggunakan silikon chip M2 generasi berikutnya, MacBook Air terbaru ini luar biasa tipis, hemat daya, dan memiliki kecepatan responsif tinggi yang dibalut bodi aluminium utuh.",
    rating: 4.9,
    reviews: 512,
    ports: [
      "2x Thunderbolt / USB 4",
      "1x MagSafe 3",
      "1x Audio Jack 3.5mm"
    ],
    features: [
      "Liquid Retina Display 500 nits",
      "Silent Fanless Design",
      "FaceTime HD 1080p Camera",
      "Touch ID Sensor"
    ],
    pros: [
      "Desain sangat tipis dan ringan",
      "Daya tahan baterai fantastis (hingga 18 jam)",
      "Tanpa suara karena fanless",
      "Layar sangat tajam dan terang"
    ],
    cons: [
      "Hanya mendukung 1 monitor eksternal",
      "SSD varian 256GB sedikit lebih lambat dari kapasitas atasnya"
    ],
    performance: {
      office: 98,
      programming: 94,
      gaming: 60,
      editing: 91,
      rendering: 82,
      ai: 85
    }
  },
  {
    id: 8,
    brand: "ASUS",
    category: "Multimedia",
    name: "ASUS ProArt Studiobook",
    image:
      "https://dlcdnwebimgs.asus.com/gain/38ae3690-62d3-4559-97f1-18cd649fca8a/",
    images: [
      "https://dlcdnwebimgs.asus.com/gain/38ae3690-62d3-4559-97f1-18cd649fca8a/",
      "https://dlcdnwebimgs.asus.com/gain/38ae3690-62d3-4559-97f1-18cd649fca8a/",
      "https://dlcdnwebimgs.asus.com/gain/38ae3690-62d3-4559-97f1-18cd649fca8a/"
    ],
    price: "Rp 32.999.000",
    priceValue: 32999000,
    cpu: "Intel Core i9",
    gpu: "NVIDIA GeForce RTX 4070 8GB",
    ram: "32GB DDR5",
    storage: "1TB PCIe Gen4 SSD",
    display: "16 inch OLED 3.2K 16:10",
    refreshRate: "120Hz",
    battery: "90Wh",
    weight: "2.40 Kg",
    os: "Windows 11 Pro",
    color: "Mineral Black",
    shortDescription:
      "Workstation portabel terbaik untuk kreator 3D, desainer grafis, dan video editor profesional.",
    description:
      "ASUS ProArt Studiobook menghadirkan performa tingkat studio berkat Intel Core i9 HX generasi ke-13, layar OLED akurasi tinggi bersertifikasi Pantone, serta fitur ASUS Dial fisik untuk kendali aplikasi kreatif presisi.",
    rating: 4.9,
    reviews: 64,
    ports: [
      "2x Thunderbolt 4",
      "2x USB 3.2 Gen 2 Type-A",
      "1x HDMI 2.1",
      "1x RJ-45",
      "1x Audio Jack"
    ],
    features: [
      "ASUS Dial Fisik",
      "Pantone Validated Display",
      "Delta E < 1 Akurasi Warna",
      "Sertifikasi ISV"
    ],
    pros: [
      "Akurasi warna layar kelas referensi",
      "ASUS Dial mempercepat alur kerja Adobe",
      "Performa CPU dan GPU ekstrem",
      "Konektivitas sangat lengkap"
    ],
    cons: [
      "Harga tergolong sangat mahal",
      "Bobotnya cukup berat"
    ],
    performance: {
      office: 99,
      programming: 98,
      gaming: 90,
      editing: 99,
      rendering: 98,
      ai: 95
    }
  },
  {
    id: 9,
    brand: "MSI",
    category: "Content Creator",
    name: "MSI Creator Z16",
    image:
      "https://storage-asset.msi.com/global/picture/product/product_168974322849bf7421533ef12b1b7cee3e84d780df.webp",
    images: [
      "https://storage-asset.msi.com/global/picture/product/product_168974322849bf7421533ef12b1b7cee3e84d780df.webp",
      "https://storage-asset.msi.com/global/picture/product/product_168974322849bf7421533ef12b1b7cee3e84d780df.webp",
      "https://storage-asset.msi.com/global/picture/product/product_168974322849bf7421533ef12b1b7cee3e84d780df.webp"
    ],
    price: "Rp 28.499.000",
    priceValue: 28499000,
    cpu: "Intel Core i7-13700H",
    gpu: "NVIDIA GeForce RTX 4060 8GB",
    ram: "32GB DDR5",
    storage: "1TB PCIe Gen4 SSD",
    display: "16 inch QHD+ IPS-Level MiniLED 16:10",
    refreshRate: "165Hz",
    battery: "90Wh",
    weight: "2.35 Kg",
    os: "Windows 11 Home",
    color: "Lunar Gray",
    shortDescription:
      "Laptop kreator premium dengan sasis CNC mewah bergaya rasio emas 16:10.",
    description:
      "MSI Creator Z16 memadukan keindahan estetika modern dengan performa tinggi. Dirancang menggunakan konsep Golden Ratio, layar MiniLED laptop ini memberikan kontras hitam mendalam dan ruang kerja maksimal bagi para kreator.",
    rating: 4.7,
    reviews: 75,
    ports: [
      "1x Thunderbolt 4",
      "1x USB 3.2 Gen 2 Type-C",
      "1x USB 3.2 Gen 2 Type-A",
      "1x Audio Jack"
    ],
    features: [
      "True Pixel Display Tech",
      "MiniLED Backlight Screen",
      "MSI Pen Support",
      "Vapor Chamber Cooling"
    ],
    pros: [
      "Konstruksi bodi aluminium mewah",
      "Layar MiniLED sangat terang",
      "RAM 32GB bawaan yang lega",
      "Multitasking responsif"
    ],
    cons: [
      "Daya tahan baterai standar",
      "Penempatan port kurang ergonomis"
    ],
    performance: {
      office: 97,
      programming: 94,
      gaming: 85,
      editing: 96,
      rendering: 92,
      ai: 87
    }
  },
  {
    id: 10,
    brand: "Dell",
    category: "Content Creator",
    name: "Dell XPS 15",
    image:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=520&qlt=100,1&resMode=sharp2&size=520,320&chrss=full",
    images: [
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=520&qlt=100,1&resMode=sharp2&size=520,320&chrss=full",
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=520&qlt=100,1&resMode=sharp2&size=520,320&chrss=full",
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=520&qlt=100,1&resMode=sharp2&size=520,320&chrss=full"
    ],
    price: "Rp 25.999.000",
    priceValue: 25999000,
    cpu: "Intel Core i7-13700H",
    gpu: "NVIDIA GeForce RTX 4050 6GB",
    ram: "16GB DDR5",
    storage: "512GB PCIe NVMe SSD",
    display: "15.6 inch FHD+ InfinityEdge",
    refreshRate: "60Hz",
    battery: "86Wh",
    weight: "1.92 Kg",
    os: "Windows 11 Home",
    color: "Platinum Silver",
    shortDescription:
      "Perpaduan kemewahan bodi premium dan performa andal dengan layar InfinityEdge ikonik.",
    description:
      "Dell XPS 15 (9530) merupakan mahakarya desain laptop Windows ultra-premium. Memadukan serat karbon pada deck keyboard, aluminium luar CNC, serta performa bertenaga untuk proyek kreatif mobile.",
    rating: 4.8,
    reviews: 112,
    ports: [
      "2x Thunderbolt 4",
      "1x USB 3.2 Gen 2 Type-C",
      "1x SD Card Reader",
      "1x Audio Jack"
    ],
    features: [
      "InfinityEdge Display",
      "Waves Nx 3D Audio",
      "Carbon Fiber Palm Rest",
      "Gorilla Glass Proteksi"
    ],
    pros: [
      "Desain bodi ultra-premium",
      "Bezel layar super tipis",
      "Kualitas audio speaker sangat baik",
      "Touchpad ekstra besar dan presisi"
    ],
    cons: [
      "Tidak ada port USB-A bawaan",
      "Kapasitas SSD relatif kecil untuk harganya"
    ],
    performance: {
      office: 96,
      programming: 93,
      gaming: 75,
      editing: 92,
      rendering: 86,
      ai: 85
    }
  },
  {
    id: 11,
    brand: "Lenovo",
    category: "Pelajar",
    name: "Lenovo IdeaPad Slim 3",
    image:
      "https://p1-ofp.static.pub//fes/cms/2025/02/06/d5tffvpbofpyvc6is7qfx2j9h7948b861562.png",
    images: [
      "https://p1-ofp.static.pub//fes/cms/2025/02/06/d5tffvpbofpyvc6is7qfx2j9h7948b861562.png",
      "https://p1-ofp.static.pub//fes/cms/2025/02/06/d5tffvpbofpyvc6is7qfx2j9h7948b861562.png",
      "https://p1-ofp.static.pub//fes/cms/2025/02/06/d5tffvpbofpyvc6is7qfx2j9h7948b861562.png"
    ],
    price: "Rp 6.499.000",
    priceValue: 6499000,
    cpu: "Intel i3-1215U",
    gpu: "Intel UHD Graphics",
    ram: "8GB LPDDR5",
    storage: "256GB PCIe Gen4 SSD",
    display: "14 inch FHD IPS",
    refreshRate: "60Hz",
    battery: "47Wh",
    weight: "1.43 Kg",
    os: "Windows 11 Home",
    color: "Arctic Grey",
    shortDescription:
      "Laptop andalan harian pelajar yang ekonomis, andal, ringan, dan fungsional.",
    description:
      "Lenovo IdeaPad Slim 3 dirancang cerdas untuk kebutuhan mobilitas harian tanpa mengorbankan fungsionalitas dasar. Sempurna bagi pelajar untuk mengetik dokumen, kelas daring, dan komputasi kasual.",
    rating: 4.3,
    reviews: 290,
    ports: [
      "1x USB-C 3.2 Gen 1",
      "2x USB-A 3.2 Gen 1",
      "1x HDMI 1.4",
      "1x SD Card Reader",
      "1x Audio Jack"
    ],
    features: [
      "Smart Noise Cancelling",
      "Privacy Shutter Webcam",
      "Lenovo Eye Care",
      "Dolby Audio"
    ],
    pros: [
      "Harga sangat bersahabat",
      "Bodi ringan, mudah dibawa",
      "Ada slider penutup webcam fisik",
      "Suhu pengoperasian adem"
    ],
    cons: [
      "RAM tersolder",
      "Storage 256GB relatif cepat penuh"
    ],
    performance: {
      office: 88,
      programming: 75,
      gaming: 40,
      editing: 60,
      rendering: 50,
      ai: 55
    }
  },
  {
    id: 12,
    brand: "Acer",
    category: "Gaming",
    name: "Acer Predator Helios 16",
    image:
      "https://crdms.images.consumerreports.org/f_auto,w_600/prod/products/cr/models/410250-15-to-16-inch-laptops-acer-predator-helios-neo-16-phn16-71-73rr-10035929.png",
    images: [
      "https://crdms.images.consumerreports.org/f_auto,w_600/prod/products/cr/models/410250-15-to-16-inch-laptops-acer-predator-helios-neo-16-phn16-71-73rr-10035929.png",
      "https://crdms.images.consumerreports.org/f_auto,w_600/prod/products/cr/models/410250-15-to-16-inch-laptops-acer-predator-helios-neo-16-phn16-71-73rr-10035929.png",
      "https://crdms.images.consumerreports.org/f_auto,w_600/prod/products/cr/models/410250-15-to-16-inch-laptops-acer-predator-helios-neo-16-phn16-71-73rr-10035929.png"
    ],
    price: "Rp 29.999.000",
    priceValue: 29999000,
    cpu: "Intel Core i9-13900HX",
    gpu: "NVIDIA GeForce RTX 4070 8GB",
    ram: "32GB DDR5",
    storage: "1TB PCIe Gen4 SSD",
    display: "16 inch WQXGA IPS LED",
    refreshRate: "240Hz",
    battery: "90Wh",
    weight: "2.60 Kg",
    os: "Windows 11 Home",
    color: "Abyssal Black",
    shortDescription:
      "Laptop gaming hardcore dengan performa ekstrem dan refresh rate super cepat 240Hz.",
    description:
      "Acer Predator Helios 16 mengusung pendinginan mutakhir kipas AeroBlade 3D Generasi ke-5 dan liquid metal thermal paste untuk memaksimalkan potensi penuh prosesor Intel i9 kelas desktop HX dan grafis RTX 4070.",
    rating: 4.8,
    reviews: 134,
    ports: [
      "2x Thunderbolt 4",
      "3x USB 3.2 Gen 2 Type-A",
      "1x HDMI 2.1",
      "1x RJ-45",
      "1x Audio Jack"
    ],
    features: [
      "5th Gen AeroBlade 3D Fan",
      "Liquid Metal Thermal Grease",
      "Per-Key RGB Backlit Keyboard",
      "NVIDIA Advanced Optimus"
    ],
    pros: [
      "Layar 240Hz sangat mulus",
      "Performa CPU i9 dan GPU RTX sangat kencang",
      "Kustomisasi melimpah via software",
      "Konstruksi tangguh"
    ],
    cons: [
      "Sangat berat termasuk chargernya",
      "Putaran kipas pada mode Turbo sangat bising"
    ],
    performance: {
      office: 98,
      programming: 97,
      gaming: 96,
      editing: 95,
      rendering: 96,
      ai: 94
    }
  }
]

// Kategori dengan gambar (buat filter UI)
export const categories = [
  {
    id: "Semua",
    title: "Semua",
    subtitle: "Semua Laptop",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
  },
  {
    id: "Pelajar",
    title: "Pelajar",
    subtitle: "Belajar & Tugas",
    image:
      "https://media.istockphoto.com/id/1425235236/id/foto/tampak-samping-anak-sekolah-muda-afrika-amerika-yang-bekerja-di-depan-laptop.jpg?s=612x612&w=0&k=20&c=tE--tDCu5dB8IH7J9zcgPQ3w_rHWkgF30dd4aNyrhp4=",
  },
  {
    id: "Programmer",
    title: "Programmer",
    subtitle: "Coding & Development",
    image:
      "https://media.istockphoto.com/id/2156385097/id/foto/pasangan-hispanik-amerika-latin-pengembang-perangkat-lunak-menggunakan-komputer-mengerjakan.jpg?s=612x612&w=0&k=20&c=Aj29_r9V3EMQKt4-6icunbWJ4wUQgM6f1hKT_mGzzWk=",
  },
  {
    id: "Gaming",
    title: "Gaming",
    subtitle: "AAA & Esports",
    image:
      "https://media.istockphoto.com/id/909705214/id/foto/anak-laki-laki-saling-membantu-saat-bermain-game-esports-di-laptop-di-malam-hari.jpg?s=612x612&w=0&k=20&c=68aNuZHNwZu4JHfcXZTGpYIu3AZM15W1FP9dK2umyE4=",
  },
  {
    id: "Multimedia",
    title: "Multimedia",
    subtitle: "Editing & Design",
    image:
      "https://media.istockphoto.com/id/614225004/id/foto/tata-letak-desain-komputer-wanita.jpg?s=612x612&w=0&k=20&c=Sdqkqrh-5mC8Hf8EtclqdUthYT43HizouiZMa7r5zKI=",
  },
  {
    id: "Content Creator",
    title: "Content Creator",
    subtitle: "Video & Streaming",
    image:
      "https://media.istockphoto.com/id/1180897643/id/foto/konsep-pengoperasian-sederhana-blogger-dan-vlogger-tangan-menggunakan-laptop-pada-editor-video.jpg?s=612x612&w=0&k=20&c=Fu5OVSNR07gevDb8PLIjMGQNECnJ7ZioDCA8SX5GAZ4=",
  },
];

// Budget options
export const budgets = [
  { label: "Semua Budget", value: "" },
  { label: "< 5 Juta", value: "<5" },
  { label: "5 - 10 Juta", value: "5-10" },
  { label: "10 - 15 Juta", value: "10-15" },
  { label: "15 - 20 Juta", value: "15-20" },
  { label: "> 20 Juta", value: ">20" },
];