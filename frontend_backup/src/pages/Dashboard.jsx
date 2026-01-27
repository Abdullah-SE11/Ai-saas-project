import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Settings, LogOut, Menu } from 'lucide-react';

const Dashboard = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Simulate API call
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm a demo AI. Connect me to the backend to get real responses!" }]);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0a0c]">
            {/* Sidebar */}
            <aside className="w-64 glass-panel border-r border-white/5 hidden md:flex flex-col p-4 m-4 rounded-2xl h-[calc(100vh-2rem)]">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg" />
                    <span className="font-bold text-lg">AI Nexus</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {['New Chat', 'History', 'Saved'].map((item) => (
                        <button key={item} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                            {item}
                        </button>
                    ))}
                </nav>

                <div className="pt-4 border-t border-white/10">
                    <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 rounded-xl text-gray-400">
                        <Settings size={18} /> Settings
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 rounded-xl text-red-400">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-full relative">
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 md:hidden">
                    <span className="font-bold">AI Nexus</span>
                    <Menu className="text-gray-400" />
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'glass-panel border-white/10 text-gray-200 rounded-bl-none'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="glass-panel p-4 rounded-2xl rounded-bl-none flex gap-2">
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 pb-6">
                    <div className="max-w-4xl mx-auto relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Message AI Nexus..."
                            className="w-full glass-panel bg-white/5 border-white/10 p-4 pr-12 rounded-full focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-gray-500"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-center text-xs text-gray-600 mt-3">
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
