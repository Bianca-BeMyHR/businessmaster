import Link from 'next/link';
import { useState } from 'react';
 
export default function Menu() {
  const [personalDropdown, setPersonalDropdown] = useState(false);
 
  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
<h2 className="text-2xl font-bold mb-6">Select a Category</h2>
<div className="space-y-4">
<div className="relative">
<button
            onClick={() => setPersonalDropdown(!personalDropdown)}
            className="w-64 p-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-md"
>
            Personal
</button>
          {personalDropdown && (
<div className="absolute w-64 mt-2 bg-white border rounded-lg shadow-md">
<Link href="/personal/goals">
<p className="p-4 hover:bg-gray-100 cursor-pointer">Goals</p>
</Link>
<Link href="/personal/expenses">
<p className="p-4 hover:bg-gray-100 cursor-pointer">Expenses</p>
</Link>
</div>
          )}
</div>
<Link href="/business">
<button className="w-64 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md">Business Sales & Costs</button>
</Link>
</div>
</div>
  );
}