import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5EDE4] flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-serif text-amber-900 mb-6">
          Jankesowa Pasieka
        </h1>
        <p className="text-2xl text-gray-700 mb-10">
          Strona testowa — deployment udany
        </p>
        <div className="space-x-4">
          <Link 
            href="/produkty"
            className="inline-block bg-amber-800 hover:bg-amber-900 text-white px-10 py-4 rounded-2xl text-lg font-medium"
          >
            Przejdź do produktów
          </Link>
        </div>
        <p className="mt-12 text-sm text-gray-500">
          Test z {new Date().toLocaleString('pl-PL')}
        </p>
      </div>
    </div>
  );
}