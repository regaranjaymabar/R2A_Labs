export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/20 bg-white/10 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">

        <div className="grid lg:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold">
              AmbaLabs
            </h2>

            <p className="mt-5 text-zinc-600 leading-relaxed">
              Platform rekomendasi laptop modern yang membantu
              pengguna menemukan perangkat terbaik berdasarkan
              kebutuhan, performa, dan anggaran.
            </p>

            <div className="flex gap-4 mt-8">
              <a href="#" className="glass-social">
                FB
              </a>

              <a href="#" className="glass-social">
                IG
              </a>

              <a href="#" className="glass-social">
                X
              </a>

              <a href="#" className="glass-social">
                IN
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-lg mb-5">
              Products
            </h3>

            <ul className="space-y-3 text-zinc-600">
              <li><a href="#">Gaming Laptop</a></li>
              <li><a href="#">Ultrabook</a></li>
              <li><a href="#">Business Laptop</a></li>
              <li><a href="#">Creator Laptop</a></li>
              <li><a href="#">Student Laptop</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-5">
              Company
            </h3>

            <ul className="space-y-3 text-zinc-600">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Partners</a></li>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">Press Kit</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-5">
              Support
            </h3>

            <ul className="space-y-3 text-zinc-600">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-zinc-500">
            © 2026 RekomLaptop Inc. All rights reserved.
          </p>

          <div className="flex gap-6 text-zinc-500">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies</a>
          </div>

        </div>

      </div>
    </footer>
  );
}