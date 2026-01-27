import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Zap, Shield, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Bot size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">AI Nexus</span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
                    <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-medium"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform text-sm"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border border-indigo-500/30">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm text-indigo-200">New: GPT-4o & Gemini 1.5 Pro Available</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        Unlock the Power of <br />
                        <span className="text-gradient-primary">Next-Gen AI Intelligence</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Experience the future of conversation with our unified AI platform.
                        Access the world's most powerful models in one beautiful interface.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-primary h-12 px-8 text-lg"
                        >
                            Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                        <button className="btn btn-secondary h-12 px-8 text-lg">
                            View Demo
                        </button>
                    </div>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-6 mt-32">
                    {[
                        { icon: <Bot className="text-indigo-400" />, title: "Multi-Model Support", desc: "Switch seamlessly between Gemini, GPT-4, and Claude." },
                        { icon: <Zap className="text-yellow-400" />, title: "Instant Response", desc: "Powered by edge computing for near-zero latency interactions." },
                        { icon: <Shield className="text-green-400" />, title: "Enterprise Security", desc: "Your data is encrypted and protected by SOC2 standards." },
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-8 text-left hover:bg-white/5 transition-all"
                        >
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
