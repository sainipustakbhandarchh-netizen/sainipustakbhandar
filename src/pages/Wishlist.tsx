import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { ProductCard } from '../components/ui/ProductCard';
import { HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Wishlist: React.FC = () => {
    const { wishlistItems } = useWishlist();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
            <h1 className="text-3xl font-heading font-bold text-dark mb-8">My Wishlist</h1>
            
            {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-primary/10">
                    <HeartCrack size={64} className="text-gray-300 mb-4" />
                    <h2 className="text-xl font-medium text-dark mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
                    <Link 
                        to="/category/all" 
                        className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            originalPrice={product.originalPrice}
                            image={product.image}
                            category={product.category}
                            inStock={product.inStock}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
