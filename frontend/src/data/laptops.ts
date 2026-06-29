export interface Laptop {
  id: number;
  category: string;
  name: string;
  image: string;
  price: string;
  priceValue: number; // Untuk filter budget
  cpu: string;
  ram: string;
  storage: string;
}

export const laptops: Laptop[] = [
  {
    id: 1,
    category: "Pelajar",
    name: "ASUS Zenbook 14 OLED",
    image:
      "https://id.store.asus.com/media/catalog/product/z/e/zenbook_14_oled_ux3405ma_product_photo_3b_ponder_blue_10_indo_no_numpad_2400_3.png?width=382&height=382&store=id_ID&image-type=image",
    price: "Rp 17.499.000",
    priceValue: 17499000,
    cpu: "Intel Core Ultra 7",
    ram: "16GB RAM",
    storage: "512GB SSD",
  },
  {
    id: 2,
    category: "Gaming",
    name: "ROG Zephyrus G14",
    image:
      "https://dlcdnwebimgs.asus.com/gain/7583764C-92E3-413D-A5AD-4CB7D9713802/w1000/h732",
    price: "Rp 24.999.000",
    priceValue: 24999000,
    cpu: "Ryzen 9",
    ram: "16GB RAM",
    storage: "1TB SSD",
  },
  {
    id: 3,
    category: "Programmer",
    name: "Lenovo Yoga Slim 7i",
    image:
      "https://p4-ofp.static.pub/fes/cms/2023/02/08/xv4xloul3hr7nwvfsr994262rcduuo471350.png",
    price: "Rp 16.999.000",
    priceValue: 16999000,
    cpu: "Intel Ultra 7",
    ram: "16GB RAM",
    storage: "512GB SSD",
  },
  {
    id: 4,
    category: "Multimedia",
    name: "HP Victus 15",
    image:
      "https://www.hp.com/content/dam/sites/omen/worldwide/laptops/2022-victus-15-intel/Hero%20Image%201.png",
    price: "Rp 11.999.000",
    priceValue: 11999000,
    cpu: "Intel i5",
    ram: "8GB RAM",
    storage: "512GB SSD",
  },
  {
    id: 5,
    category: "Pelajar",
    name: "Acer Aspire 5 Slim",
    image:
      "https://gayatekno.id/wp-content/uploads/2020/12/Aspire-5-Slim-A514-54-3.png",
    price: "Rp 8.999.000",
    priceValue: 8999000,
    cpu: "Intel i5-1235U",
    ram: "8GB RAM",
    storage: "512GB SSD",
  },
  {
    id: 6,
    category: "Gaming",
    name: "Lenovo Legion 5 Pro",
    image:
      "https://p2-ofp.static.pub//fes/cms/2025/07/07/x1xdznwzwyhbo8ur5rusuzs8srh7ds718781.png",
    price: "Rp 21.499.000",
    priceValue: 21499000,
    cpu: "Ryzen 7 7745HX",
    ram: "16GB RAM",
    storage: "1TB SSD",
  },
  {
    id: 7,
    category: "Programmer",
    name: "MacBook Air M2",
    image:
      "https://www.apple.com/v/macbook-air/z/images/overview/hero/hero_static__c9sislzzicq6_large.png",
    price: "Rp 19.999.000",
    priceValue: 19999000,
    cpu: "Apple M2",
    ram: "8GB RAM",
    storage: "256GB SSD",
  },
  {
    id: 8,
    category: "Multimedia",
    name: "ASUS ProArt Studiobook",
    image:
      "https://dlcdnwebimgs.asus.com/gain/38ae3690-62d3-4559-97f1-18cd649fca8a/",
    price: "Rp 32.999.000",
    priceValue: 32999000,
    cpu: "Intel Core i9",
    ram: "32GB RAM",
    storage: "1TB SSD",
  },
  {
    id: 9,
    category: "Content Creator",
    name: "MSI Creator Z16",
    image:
      "https://storage-asset.msi.com/global/picture/product/product_168974322849bf7421533ef12b1b7cee3e84d780df.webp",
    price: "Rp 28.499.000",
    priceValue: 28499000,
    cpu: "Intel Core i7-13700H",
    ram: "32GB RAM",
    storage: "1TB SSD",
  },
  {
    id: 10,
    category: "Content Creator",
    name: "Dell XPS 15",
    image:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=520&qlt=100,1&resMode=sharp2&size=520,320&chrss=full",
    price: "Rp 25.999.000",
    priceValue: 25999000,
    cpu: "Intel Core i7-13700H",
    ram: "16GB RAM",
    storage: "512GB SSD",
  },
  {
    id: 11,
    category: "Pelajar",
    name: "Lenovo IdeaPad Slim 3",
    image:
      "https://p1-ofp.static.pub//fes/cms/2025/02/06/d5tffvpbofpyvc6is7qfx2j9h7948b861562.png",
    price: "Rp 6.499.000",
    priceValue: 6499000,
    cpu: "Intel i3-1215U",
    ram: "8GB RAM",
    storage: "256GB SSD",
  },
  {
    id: 12,
    category: "Gaming",
    name: "Acer Predator Helios 16",
    image:
      "https://crdms.images.consumerreports.org/f_auto,w_600/prod/products/cr/models/410250-15-to-16-inch-laptops-acer-predator-helios-neo-16-phn16-71-73rr-10035929.png",
    price: "Rp 29.999.000",
    priceValue: 29999000,
    cpu: "Intel Core i9-13900HX",
    ram: "32GB RAM",
    storage: "1TB SSD",
  },
];

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