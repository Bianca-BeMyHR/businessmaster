import { useState } from 'react';
export default function Personal() {
  const [form, setForm] = useState({ rent: '', utilities: '', food: '' });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'personal', ...form }),
    });
    alert('Personal expenses saved!');
  };
  return (
<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
<h2 className="text-xl font-bold mb-4">Enter Personal Expenses</h2>
<form onSubmit={handleSubmit} className="space-y-4">
<input className="w-full p-3 border rounded-md" name="rent" placeholder="Rent" onChange={handleChange} />
<input className="w-full p-3 border rounded-md" name="utilities" placeholder="Utilities" onChange={handleChange} />
<input className="w-full p-3 border rounded-md" name="food" placeholder="Food" onChange={handleChange} />
<button className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md" type="submit">Save & Continue</button>
</form>
</div>
  );
}