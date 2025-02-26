import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
 
export default function Goals() {
  const router = useRouter();
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [desiredDate, setDesiredDate] = useState('');
  const [goalType, setGoalType] = useState('');
  const [totalMonths, setTotalMonths] = useState(null);
  const [monthlyAmount, setMonthlyAmount] = useState(null);
  const [message, setMessage] = useState(null);
  const [calculated, setCalculated] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);
 
  const handleGoalTypeSelection = (type) => {
    setGoalType(type);
  };
 
  const calculateGoalData = () => {
    if (startDate && desiredDate && amount && goalType) {
      const start = new Date(startDate);
      const end = new Date(desiredDate);
      const monthsDiff = Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
      setTotalMonths(monthsDiff);
      setMonthlyAmount((parseFloat(amount) / monthsDiff).toFixed(2));
      setCalculated(true);
    }
  };
 
  const handleSaveGoalAndExpenses = async () => {
    const { error: goalError } = await supabase.from('personal_goals').insert([
      { goal, amount: parseFloat(amount), start_date: startDate, desired_date: desiredDate, total_months: totalMonths, monthly_amount: parseFloat(monthlyAmount), goal_type: goalType }
    ]);
    if (goalError) {
      setMessage({ type: 'error', text: goalError.message });
      return;
    }
    const { error: expenseError } = await supabase.from('personal_expenses').insert([
      { category: `Goal: ${goal}`, amount: parseFloat(monthlyAmount), date: startDate }
    ]);
    if (expenseError) {
      setMessage({ type: 'error', text: expenseError.message });
    } else {
      setMessage({ type: 'success', text: 'Goal and expense saved successfully!' });
      setGoalSaved (true);
    }
  };
 
  const resetForm = () => {
    setGoal('');
    setAmount('');
    setStartDate('');
    setDesiredDate('');
    setTotalMonths(null);
    setMonthlyAmount(null);
    setGoalType('');
    setCalculated(false);
    setMessage(null);
    setGoalSaved(false);
  };
 
  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
<h2 className="text-2xl font-bold mb-4">Set Your Financial Goals</h2>
{!goalSaved ? (
    <>
<form className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md" onSubmit={(e) => e.preventDefault()}>
<input
          type="text"
          placeholder="Goal (e.g., Save for a car)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-3 border rounded-md mb-4"
          required
        />
<select
          className="w-full p-3 border rounded-md mb-4"
          value={goalType}
          onChange={(e) => handleGoalTypeSelection(e.target.value)}
          required
>
<option value="">Select Goal Type</option>
<option value="Short-term">Short-term (1-3 years)</option>
<option value="Mid-term">Mid-term (4-5 years)</option>
<option value="Long-term">Long-term (6-10+ years)</option>
</select>
<label className="block text-gray-700 mb-2">Start Date</label>
<input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-3 border rounded-md mb-4"
          required
        />
<label className="block text-gray-700 mb-2">Desired Date</label>
<input
          type="date"
          value={desiredDate}
          onChange={(e) => setDesiredDate(e.target.value)}
          className="w-full p-3 border rounded-md mb-4"
          required
        />
<input
          type="number"
          placeholder="Total Cost"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-md mb-4"
          required
        />
<button
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
          type="button"
          onClick={calculateGoalData}
>
          Calculate Monthly Amount
</button>
</form>
      {calculated && (
<div className="mt-4 w-full max-w-sm bg-white p-6 rounded-lg shadow-md text-center">
<p className="text-gray-700">Total Months: {totalMonths}</p>
<p className="text-gray-700">Monthly Savings Needed: ${monthlyAmount}</p>
<div className="flex space-x-4 mt-4">
<button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg" onClick={resetForm}>Reset</button>
<button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg" onClick={handleSaveGoalAndExpenses}>Save Goal & Add to Expenses</button>
<button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg" onClick={() => router.push('/menu')}>Cancel & Back to Menu</button>
</div>
</div>

          )}
          </>
      ) : (
<div className="text-center">
<p className="text-green-500 text-lg">Goal saved successfully! Do you want to add another goal?</p>
<div className="flex space-x-4 mt-4">
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg" onClick={resetForm}>Yes, Add Another</button>
<button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg" onClick={() => router.push('/menu')}>No, Back to Menu</button>
</div>
</div>

      )}
</div>

  );

}

 

