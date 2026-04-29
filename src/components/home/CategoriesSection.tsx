import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, GraduationCap, PenTool, Briefcase, Printer, FolderOpen, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Default mappings for known categories to retain their icon and color
const categoryStylingMap: Record<string, { icon: any, color: string }> = {
    'school-books': { icon: Book, color: 'bg-blue-50 text-blue-600' },
    'competitive-exams': { icon: GraduationCap, color: 'bg-primary/10 text-primary' },
    'stationery': { icon: PenTool, color: 'bg-green-50 text-green-600' },
    'office-products': { icon: Briefcase, color: 'bg-amber-50 text-amber-600' },
    'printing-photocopy': { icon: Printer, color: 'bg-purple-50 text-purple-600' }
};

const defaultStyling = { icon: FolderOpen, color: 'bg-gray-50 text-gray-600' };

export const CategoriesSection: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
            if (data) {
                // Filter out free books as it's separate
                const filteredData = data.filter(cat => !cat.slug.includes('free-book'));
                setCategories(filteredData);
            }
        };
        fetchCategories();
    }, []);

    return (
        <section id="categories" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-bold text-dark sm:text-4xl text-center">
                        Shop by Category
                    </h2>
                    <div className="mt-2 h-1 w-20 bg-accent mx-auto rounded"></div>
                    <p className="mt-4 text-gray-500 font-body max-w-2xl mx-auto">
                        Find everything you need for your educational journey, all in one trusted place.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {categories.map((category) => {
                        const style = categoryStylingMap[category.slug] || defaultStyling;
                        const Icon = style.icon;
                        return (
                            <Link
                                key={category.id}
                                to={`/category/${category.slug}`}
                                className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 text-center w-full sm:w-64"
                            >
                                <div className={`p-4 rounded-full ${style.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={32} />
                                </div>
                                <h3 className="font-heading font-bold text-dark mb-2 text-lg group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {category.description || 'Explore our collection of items for this category.'}
                                </p>
                            </Link>
                        )
                    })}
                    {/* All Products Card */}
                    <Link
                        to="/category/all"
                        className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 text-center w-full sm:w-64"
                    >
                        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                            <ShoppingBag size={32} />
                        </div>
                        <h3 className="font-heading font-bold text-dark mb-2 text-lg group-hover:text-primary transition-colors">
                            All Products
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                            Browse our complete collection of products.
                        </p>
                    </Link>
                </div>
            </div>
        </section>
    );
};
