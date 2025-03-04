import Link from 'next/link';

export default function Menu() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
      <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
      <div className="space-y-4">
        <Link href="/signdocument">
          <button className="w-64 p-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-md">
            Development
          </button>
        </Link>
        <Link href="/consulting">
          <button className="w-64 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md">
            Consulting
          </button>
        </Link>
      </div>
    </div>
  );
}