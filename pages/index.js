import Link from 'next/link';
export default function Home() {
  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
<h1 className="text-3xl font-bold">Welcome to Financial Tracker</h1>
<p className="mt-2 text-lg">
  Manage your personal and business finances
  </p>
  <div className="mt-6 space-x-4">
    <Link href="/login">
<button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-lg">
  Login
  </button>
  </Link>
  <Link href="/signup">
<button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-lg">
  Sign up
  </button>
</Link>
</div>
</div>
  );
}