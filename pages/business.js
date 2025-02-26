import { useState } from 'react';
export default function Business() {
  const [form, setForm] = useState({ price: '', units: '', cogs: '' });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'business', ...form }),
    });
    alert('Business data saved!');
  };
  return (
<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
<h2 className="text-xl font-bold mb-4">Enter Business Details</h2>
<form onSubmit={handleSubmit} className="space-y-4">
<input className="w-full p-3 border rounded-md" name="price" placeholder="Product Price" onChange={handleChange} />
<input className="w-full p-3 border rounded-md" name="units" placeholder="Units to Sell" onChange={handleChange} />
<input className="w-full p-3 border rounded-md" name="cogs" placeholder="Cost of Goods Sold (COGS)" onChange={handleChange} />
<button className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md" type="submit">Save & Continue</button>
</form>
</div>
  );
}
 