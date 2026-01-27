import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login for now
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-purple-900/40 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 w-full max-w-md relative z-10"
            >
                <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
                <p className="text-center text-gray-400 mb-8">Sign in to continue to AI Nexus</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="w-full btn btn-primary mt-4">
                        Sign In with Email
                    </button>
                </form>

                <div className="mt-6 flex items-center gap-4">
                    <div className="h-[1px] bg-white/10 flex-1" />
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="h-[1px] bg-white/10 flex-1" />
                </div>

                <button className="w-full mt-6 btn btn-secondary flex gap-2">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-5 h-5" />
                    Continue with Google
                </button>
            </motion.div>
        </div>
    );
};

export default Login;
