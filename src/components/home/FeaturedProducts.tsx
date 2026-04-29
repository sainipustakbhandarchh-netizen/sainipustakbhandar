import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ProductCard } from '../ui/ProductCard';
import { ShoppingBag } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories first to map category names
                const { data: catData } = await supabase.from('categories').select('*');
                if (catData) setCategories(catData);

                // Fetch featured products
                const { data: prodData, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_featured', true)
                    .limit(4);

                if (error) throw error;
                if (prodData) setProducts(prodData);
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (products.length === 0) {
        return null; // Don't show the section if no featured products
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-200 pb-6">
                    <div>
                        <span className="text-secondary/60 uppercase tracking-widest font-semibold text-sm mb-2 block">
                            Trending
                        </span>
                        <h2 className="text-3xl font-heading font-bold text-dark sm:text-4xl relative inline-block">
                            Featured Products
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
                        </h2>
                    </div>
                    <a
                        href="https://wa.me/917419150418"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-dark font-medium underline underline-offset-4 decoration-primary/30 mt-4 md:mt-0 transition-colors flex items-center gap-2"
                    >
                        Request Full Catalog <ShoppingBag size={18} />
                    </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => {
                        const cat = categories.find(c => c.id === product.category_id);
                        return (
                            <ProductCard 
                                key={product.id} 
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                originalPrice={product.original_price}
                                image={product.images?.[0] || 'https://via.placeholder.com/150'}
                                category={cat?.name || 'School Books'}
                                inStock={product.in_stock}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
