export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 text-center text-gray-600 text-sm">
        <p className="font-medium text-gray-800 mb-2">سوقكم</p>
        <p className="mb-1">منصة جزائرية للبيع والشراء</p>
        <p>© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
      </div>
    </footer>
  )
}