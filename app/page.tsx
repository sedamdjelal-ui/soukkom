export default function Home() {
  const products = [
    {
      id: 1,
      name: "ساعة يد أنيقة",
      price: "4500 دج",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "سماعة بلوتوث",
      price: "3200 دج",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "حقيبة جلدية",
      price: "7800 دج",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "نظارة شمسية",
      price: "2100 دج",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* الهيدر */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-teal-700">سوقكم</h1>
          <nav className="flex gap-6 text-sm">
            <a href="#" className="hover:text-teal-700">الرئيسية</a>
            <a href="/products" className="hover:text-teal-700">المنتجات</a>
            <a href="#" className="hover:text-teal-700">سجل كتاجر</a>
          </nav>
        </div>
      </header>

      {/* القسم الرئيسي */}
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          سوقكم... مكانك للبيع والشراء
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          منصة جزائرية بسيطة تجمع التجار والزبائن في مكان واحد. ابدأ البيع أو التسوق بسهولة.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="#products"
            className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition"
          >
            تصفح المنتجات
          </a>
          <a
            href="/register"
            className="border border-teal-700 text-teal-700 px-6 py-3 rounded-lg hover:bg-teal-50 transition"
          >
            سجل كتاجر
          </a>
        </div>
      </main>

      {/* قسم المنتجات */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold mb-8 text-center">منتجات مميزة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h4 className="font-medium mb-1">{product.name}</h4>
                <p className="text-teal-700 font-bold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
              </section>

      {/* الفوتر */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p className="mb-2">© 2026 سوقكم — جميع الحقوق محفوظة</p>
          <p>منصة جزائرية للبيع والشراء</p>
        </div>
            </footer>
    </div>
  );
}