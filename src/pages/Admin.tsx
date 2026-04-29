import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, LogOut, LayoutDashboard, PlusCircle, Folders } from 'lucide-react';
import { CategoryManager } from '../components/admin/CategoryManager';
import { ProductManager } from '../components/admin/ProductManager';
import { FreeBooksManager } from '../components/admin/FreeBooksManager';
import { BookOpen } from 'lucide-react';

export const Admin: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    
    const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'free_books'>('products');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsCheckingAuth(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) setError(error.message);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (isCheckingAuth) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-body">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-center mb-2 text-dark">Admin Access</h1>
                    <p className="text-gray-500 text-center mb-8">Please sign in to manage your store.</p>
                    
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3.5 rounded-lg transition-colors mt-2 disabled:opacity-70"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-body flex flex-col md:flex-row">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen flex flex-col shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-lg font-heading font-bold text-dark flex items-center gap-2">
                        <span className="text-primary"><LayoutDashboard size={24} /></span>
                        Admin Panel
                    </h1>
                </div>
                
                <nav className="flex-grow p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <PlusCircle size={18} />
                        Product Manager
                    </button>
                    <button 
                        onClick={() => setActiveTab('categories')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Folders size={18} />
                        Category Manager
                    </button>
                    <button 
                        onClick={() => setActiveTab('free_books')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'free_books' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <BookOpen size={18} />
                        Free Books & Learning
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100 mt-auto">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow p-4 md:p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {activeTab === 'categories' && <CategoryManager />}
                    {activeTab === 'products' && <ProductManager />}
                    {activeTab === 'free_books' && <FreeBooksManager />}
                </div>
            </main>
        </div>
    );
};
