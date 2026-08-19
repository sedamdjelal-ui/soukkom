export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-teal-700">سوقكم</a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="hover:text-teal-700">الرئيسية</a>
            <a href="/products" className="hover:text-teal-700">المنتجات</a>
            <a href="/register" className="text-teal-700 font-medium">سجل كتاجر</a>
          </nav>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2 text-center">سجل كتاجر</h1>
        <p className="text-gray-600 text-center mb-8">
          انضم إلى سوقكم وابدأ بيع منتجاتك بسهولة
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1">الاسم الكامل</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
              placeholder="أدخل اسمك"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">رقم الهاتف</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
              placeholder="05XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">اسم المتجر</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
              placeholder="اسم متجرك"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 transition mt-4"
          >
            إنشاء حساب
          </button>
        </form>
      </main>
    </div>
  );
}