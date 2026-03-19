import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type SignupProps = {
  onSwitchToLogin: () => void;
};

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, name);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">🌟 Join Kids Learning AI</h1>
          <p className="text-gray-600 text-lg">Start your learning adventure!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-lg">
              Account created successfully! You can now log in.
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold py-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-lg">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-600 font-bold hover:text-green-700"
            >
              Login here!
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
