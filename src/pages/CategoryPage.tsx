import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/ui/ProductCard';
import { Filter, X } from 'lucide-react';

export const CategoryPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [products, setProducts] = useState<any[]>([]);
    const [category, setCategory] = useState<any>(null);
    const [allCategories, setAllCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all'); // For All Products page
    const [attributeFilters, setAttributeFilters] = useState<Record<string, string>>({});
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            setLoading(true);
            
            // Fetch all categories for mapping and filtering
            const { data: allCategoriesData } = await supabase.from('categories').select('*');
            if (allCategoriesData) setAllCategories(allCategoriesData);

            if (categoryId === 'all') {
                setCategory({ name: 'All Products', slug: 'all' });
                
                // Fetch all products
                const { data: productsData } = await supabase
                    .from('products')
                    .select('id, name, price, original_price, images, category_id, in_stock, attributes')
                    .order('created_at', { ascending: false });

                if (productsData) {
                    setProducts(productsData);
                }
            } else {
                // Fetch category by slug
                const categoryData = allCategoriesData?.find(c => c.slug === categoryId);

                if (categoryData) {
                    setCategory(categoryData);
                    
                    // Fetch products for this category
                    const { data: productsData } = await supabase
                        .from('products')
                        .select('id, name, price, original_price, images, category_id, in_stock, attributes')
                        .eq('category_id', categoryData.id)
                        .order('created_at', { ascending: false });

                    if (productsData) {
                        setProducts(productsData);
                    }
                } else {
                    setCategory(null);
                }
            }
            setLoading(false);
        };

        if (categoryId) {
            fetchCategoryAndProducts();
            // Reset filters on category change
            setStockFilter('all');
            setCategoryFilter('all');
            setAttributeFilters({});
            setIsMobileFiltersOpen(false);
        }
    }, [categoryId]);

    // Extract unique attributes from products for filters
    const availableAttributes = useMemo(() => {
        const attrs: Record<string, Set<string>> = {};
        
        products.forEach(p => {
            if (p.attributes) {
                Object.entries(p.attributes).forEach(([key, value]) => {
                    if (value && typeof value === 'string') {
                        if (!attrs[key]) attrs[key] = new Set();
                        attrs[key].add(value);
                    }
                });
            }
        });

        const sortedAttrs: Record<string, string[]> = {};
        Object.keys(attrs).forEach(key => {
            sortedAttrs[key] = Array.from(attrs[key]).sort();
        });

        return sortedAttrs;
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            // Stock Filter
            if (stockFilter === 'in_stock' && p.in_stock === false) return false;
            if (stockFilter === 'out_of_stock' && p.in_stock !== false) return false;

            // Category Filter (only applicable on 'All Products' page)
            if (categoryId === 'all' && categoryFilter !== 'all' && p.category_id !== categoryFilter) return false;

            // Attribute Filters
            for (const [key, value] of Object.entries(attributeFilters)) {
                if (value !== 'all') {
                    if (!p.attributes || p.attributes[key] !== value) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [products, stockFilter, categoryFilter, attributeFilters, categoryId]);

    const handleAttributeFilterChange = (key: string, value: string) => {
        setAttributeFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    if (!category) {
        return (
            <div className="bg-gray-50 min-h-screen pb-20 pt-16 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
                    <p className="text-gray-500">The category you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20 relative">
            {/* Category Header */}
            <div className="bg-white border-b border-gray-200 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-heading font-extrabold text-dark sm:text-5xl mb-4 capitalize">
                        {category.name}
                    </h1>
                    <div className="h-1 w-20 bg-accent mx-auto rounded mb-6"></div>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 font-body">
                        {categoryId === 'all' 
                            ? 'Browse our complete catalog of books, stationery, and learning materials.'
                            : `Browse our latest collection of ${category.name}`
                        }
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20 flex flex-col lg:flex-row gap-8">
                
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <span className="font-bold text-dark flex items-center gap-2"><Filter size={20} className="text-primary" /> Filters</span>
                    <button 
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                        className="text-primary font-semibold text-sm bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors"
                    >
                        {isMobileFiltersOpen ? 'Close' : 'Show'}
                    </button>
                </div>

                {/* Left Sidebar Filters */}
                <div className={`lg:w-1/4 shrink-0 flex flex-col gap-6 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-heading font-bold text-lg text-dark flex items-center gap-2">
                                <Filter size={20} className="text-primary"/> Filters
                            </h3>
                            {/* Clear All button */}
                            {(stockFilter !== 'all' || categoryFilter !== 'all' || Object.values(attributeFilters).some(v => v !== 'all')) && (
                                <button 
                                    onClick={() => { setStockFilter('all'); setCategoryFilter('all'); setAttributeFilters({}); }}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium bg-red-50 px-2 py-1 rounded"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Availability Filter */}
                        <div className="mb-6 pb-6 border-b border-gray-100">
                            <h4 className="font-semibold text-dark mb-3 text-sm uppercase tracking-wider">Availability</h4>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name="stock" 
                                        checked={stockFilter === 'all'} 
                                        onChange={() => setStockFilter('all')}
                                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">All Items</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name="stock" 
                                        checked={stockFilter === 'in_stock'} 
                                        onChange={() => setStockFilter('in_stock')}
                                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">In Stock</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name="stock" 
                                        checked={stockFilter === 'out_of_stock'} 
                                        onChange={() => setStockFilter('out_of_stock')}
                                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">Out of Stock</span>
                                </label>
                            </div>
                        </div>

                        {/* Category Filter (For All Products Page) */}
                        {categoryId === 'all' && allCategories.length > 0 && (
                            <div className="mb-6 pb-6 border-b border-gray-100">
                                <h4 className="font-semibold text-dark mb-3 text-sm uppercase tracking-wider">Category</h4>
                                <select 
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="all">All Categories</option>
                                    {allCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Dynamic Attribute Filters */}
                        {Object.entries(availableAttributes).map(([attrKey, values]) => (
                            <div key={attrKey} className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                                <h4 className="font-semibold text-dark mb-3 text-sm uppercase tracking-wider">{attrKey}</h4>
                                <select 
                                    value={attributeFilters[attrKey] || 'all'}
                                    onChange={(e) => handleAttributeFilterChange(attrKey, e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="all">All {attrKey}s</option>
                                    {values.map(val => (
                                        <option key={val} value={val}>{val}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        
                        {Object.keys(availableAttributes).length === 0 && categoryId !== 'all' && (
                            <div className="text-sm text-gray-500 italic text-center p-4 bg-gray-50 rounded-lg">
                                No additional filters available for this category.
                            </div>
                        )}

                    </div>
                </div>

                {/* Right Side: Products Grid */}
                <div className="lg:w-3/4 flex-grow">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-gray-600 font-medium">
                            Showing <span className="font-bold text-dark">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                        </p>
                    </div>
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => {
                                const catName = categoryId === 'all' 
                                    ? (allCategories.find(c => c.id === product.category_id)?.name || 'Product')
                                    : category.name;
                                return (
                                <ProductCard 
                                    key={product.id} 
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    originalPrice={product.original_price}
                                    image={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x400?text=No+Image'}
                                    category={catName}
                                    inStock={product.in_stock !== false}
                                />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Filter size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-dark mb-2">No Products Found</h3>
                            <p className="text-gray-500 mb-6 max-w-md">We couldn't find any products matching your current filters. Try adjusting your selections or clearing the filters.</p>
                            <button
                                onClick={() => { setStockFilter('all'); setCategoryFilter('all'); setAttributeFilters({}); }}
                                className="inline-flex items-center justify-center px-6 py-2.5 border border-primary text-sm font-semibold rounded-lg text-primary hover:bg-primary/5 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
