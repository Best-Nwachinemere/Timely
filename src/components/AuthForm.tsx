import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    if (result.error) setError(result.error.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto">
      <input
        className="w-full border rounded p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full border rounded p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-500">{error}</div>}
      <button className="w-full bg-primary text-white rounded p-2" type="submit">
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
      <button
        type="button"
        className="w-full text-xs underline"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? "Already have an account? Sign In" : "No account? Sign Up"}
      </button>
    </form>
  );
};

export default AuthForm;