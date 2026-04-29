import React, { useState, useEffect } from 'react';
import { BookOpen, Download, ExternalLink, MessageCircle, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const FreeBooks: React.FC = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            const { data } = await supabase.from('free_books').select('*').order('created_at', { ascending: false });
            if (data) {
                setBooks(data);
            }
            setLoading(false);
        };
        fetchBooks();
    }, []);
    return (
        <div className="bg-gray-50 min-h-screen pb-20 relative">
            {/* SEO Meta (conceptual via title tag injection, could use React Helmet if installed) */}

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-heading font-extrabold text-dark sm:text-5xl mb-4 capitalize">
                        Free Books & Learning
                    </h1>
                    <div className="h-1 w-20 bg-accent mx-auto rounded mb-6"></div>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600 font-body">
                        Access legally free educational books, open resources, and daily learning insights. We share only public domain and officially free materials to support students, parents, and teachers.
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT COLUMN -> Free resources */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Filters */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center text-primary font-bold">
                                <Filter size={20} className="mr-2" />
                                <span>Filter Resources</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                                    <option>Class</option>
                                </select>
                                <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                                    <option>Board</option>
                                </select>
                                <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                                    <option>Subject</option>
                                </select>
                                <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                                    <option>Language</option>
                                </select>
                            </div>
                        </div>

                        {/* Resource Categories & Cards */}
                        <div className="space-y-6">
                            {loading ? (
                                <div className="text-center py-12 text-gray-500">Loading resources...</div>
                            ) : books.length > 0 ? (
                                books.map((book) => (
                                    <div key={book.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-md uppercase tracking-wide">
                                                    {book.category}
                                                </span>
                                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                    {book.class}
                                                </span>
                                                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                                                    {book.subject}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-heading font-bold text-dark mb-2">{book.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{book.description}</p>
                                            <div className="flex items-center text-xs font-medium text-gray-500">
                                                <span className="flex items-center bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                                                    License: {book.license}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col justify-end gap-3 sm:w-48">
                                            {book.read_link && (
                                                <a href={book.read_link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm shadow-sm group">
                                                    <BookOpen size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                                                    Read Online
                                                </a>
                                            )}
                                            {book.download_link && (
                                                <a href={book.download_link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center bg-white border-2 border-primary text-primary hover:bg-primary/5 px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm">
                                                    <Download size={16} className="mr-2" />
                                                    Download
                                                </a>
                                            )}
                                            {!book.read_link && !book.download_link && (
                                                <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-500 px-4 py-2.5 rounded-lg font-semibold text-sm">
                                                    Unavailable
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500">No resources found.</div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN -> Sidebar */}
                    <div className="lg:col-span-4 h-full relative">
                        <div className="flex flex-col gap-6 h-full">

                            {/* Book of the Week */}
                            <div className="bg-white p-6 rounded-xl border-t-4 border-t-accent border-x border-b border-gray-200 shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-heading font-bold text-lg text-dark">⭐ Book of the Week</h3>
                                </div>
                                <h4 className="font-heading font-bold text-xl text-primary mb-2">Panchatantra</h4>
                                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                                    Ancient Indian collection of wisdom stories that teach practical life skills, decision making, emotional intelligence, and ethical thinking through engaging animal-based narratives.
                                </p>
                                <button className="w-full flex items-center justify-center bg-accent hover:bg-accent/90 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors">
                                    <ExternalLink size={18} className="mr-2" />
                                    Read / Download
                                </button>
                            </div>

                            {/* Today's Learning */}
                            <div className="bg-primary p-6 rounded-xl text-white shadow-md">
                                <h3 className="font-heading font-bold text-lg mb-4 flex items-center">
                                    💡 Today’s Learning
                                </h3>
                                <p className="text-xs text-white/80 uppercase tracking-widest mb-3 font-semibold">Key Lessons from Panchatantra:</p>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start">
                                        <span className="mr-2 mt-0.5">•</span>
                                        Smart thinking is more powerful than physical strength.
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 mt-0.5">•</span>
                                        Decisions should be made with awareness, not emotion.
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 mt-0.5">•</span>
                                        Good friendships and networks create long-term success.
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 mt-0.5">•</span>
                                        Knowledge and strategy help overcome difficult situations.
                                    </li>
                                </ul>
                            </div>

                            {/* About the Author / Origin */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-heading font-bold text-lg text-dark mb-3">About the Origin</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Panchatantra was written in ancient India to teach princes leadership, problem-solving, and real-world wisdom. These stories focus on practical intelligence, communication, and human behavior, making them timeless learning tools.
                                </p>
                            </div>

                            {/* CTA Conversion Box */}
                            <div className="sticky top-32 mt-auto bg-secondary p-6 rounded-xl border border-primary/20 shadow-sm text-center">
                                <h3 className="font-heading font-bold text-lg text-primary mb-2">Need Guidance?</h3>
                                <p className="text-sm text-gray-700 mb-5">
                                    Need help choosing the right books for your child or exam preparation? Message us for personalized recommendations.
                                </p>
                                <a
                                    href="https://wa.me/917419150418?text=Hello,%20I%20saw%20your%20Free%20Books%20%26%20Learning%20section.%20I%20need%20help%20selecting%20the%20right%20books."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-lg font-semibold transition-colors shadow-md"
                                >
                                    <MessageCircle size={20} className="mr-2" />
                                    WhatsApp +91 7419150418
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="p-2 bg-gray-200 rounded-full shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                    </div>
                    <p className="text-xs text-gray-500 flex-1 leading-relaxed">
                        <strong>Disclaimer:</strong> We share only public domain, open-licensed, or officially free educational resources. If you are a copyright owner and want any content removed or corrected, please contact us and we will act promptly.
                    </p>
                </div>
            </div>


        </div>
    );
};
