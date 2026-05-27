import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5EDE4] flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-6xl font-serif text-brand-brown mb-6">
          Jankesowa Pasieka
        </h1>
        <p className="text-2xl text-gray-700 mb-10">
          Strona w budowie / test deploymentu
        </p>
        <div className="space-x-4">
          <Link 
            href="/produkty" 
            className="inline-block bg-amber-800 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-amber-900"
          >
            Przejdź do produktów
          </Link>
          <Link 
            href="/o-nas" 
            className="inline-block border border-amber-800 text-amber-800 px-8 py-4 rounded-xl text-lg font-medium hover:bg-amber-50"
          >
            O nas
          </Link>
        </div>
        <p className="mt-12 text-sm text-gray-500">
          Deployment z {new Date().toLocaleDateString('pl-PL')}
        </p>
      </div>
    </div>
  );
}