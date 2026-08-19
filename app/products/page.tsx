export default function ProductsPage() {
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
    {
      id: 5,
      name: "حذاء رياضي",
      price: "6500 دج",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: "ساعة ذكية",
      price: "8900 دج",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-teal-700">سوقكم</a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="hover:text-teal-700">الرئيسية</a>
            <a href="/products" className="text-teal-700 font-medium">المنتجات</a>
            <a href="/register" className="hover:text-teal-700">سجل كتاجر</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">كل المنتجات</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      </main>
    </div>
  );
}