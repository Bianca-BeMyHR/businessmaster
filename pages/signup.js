import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
 
export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
 
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

   if(password.length <6) {
    setError ("Password must be at least 6 characters long.");
    return;
   }
   
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Sign up successful! Redirecting to login...");
      setTimeout(() => {
        router.push('/login');
      },3000);  //Redirects after 3 seconds
    }
  };
 
  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
<h2 className="text-2xl font-bold mb-4">Sign Up</h2>
<form className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md" onSubmit={handleSignUp}>
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
        {message && <p className="text-green-500 mb-4">{message}</p>}
<button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md" type="submit">
          Sign Up
</button>
</form>
</div>
  );
}
