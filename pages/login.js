import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
 
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/menu');
    }
  };
 
const handlePasswordReset = async () => {
    if (!email) {
        setError('Please enter your email first.');
        return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail (email, { redirectTo: `https://businessmaster.ca/resetpassword`,
    });
    if (error) {
        setError(error.message);
    }else{
        alert('Password reset email sent. Check your inbox!');
    }
    }

  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
<h2 className="text-2xl font-bold mb-4">Login</h2>
<form className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md" onSubmit={handleLogin}>
<input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-md mb-4"
          required
        />
<input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-md mb-4"
          required
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
<button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md" type="submit">
          Login
</button>
</form>
//         {*/ <button
//className="mt-4 text-blue-600 hover:underline"
//onClick={handlePasswordReset}>
//    Forgot Password?
//</button> */}
</div>
  );
}
