import React from 'react';
import { ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    inStock?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    originalPrice,
    image,
    category,
    inStock = true,
}) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addToCart, isInCart } = useCart();
    const inWishlist = isInWishlist(id);
    const inCart = isInCart(id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ id, name, price, image, category });
    };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(id);
        } else {
            addToWishlist({ id, name, price, originalPrice, image, category, inStock });
        }
    };

    const discount = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const whatsappMessage = `Hello Saini Pustak Bhandar! I want to order "${name}" from the ${category} category. My location is ____.`;
    const whatsappUrl = `https://wa.me/917419150418?text=${encodeURIComponent(
        whatsappMessage
    )}`;

    return (
        <div className="flex flex-col h-full group relative">
            {/* Image Container */}
            <div className="relative pt-[125%] overflow-hidden rounded-2xl bg-[#f9f9f9]">
                <Link to={`/product/${id}`} className="absolute inset-0">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </Link>

                {/* Status Badges */}
                {discount > 0 && inStock && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-dark text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        -{discount}%
                    </div>
                )}
                {!inStock && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-dark/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                            Out of Stock
                        </span>
                    </div>
                )}
                
                {/* Wishlist Button - Bottom Right like the reference */}
                <button 
                    onClick={toggleWishlist}
                    className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white transition-all z-10 group/wishlist active:scale-95"
                    aria-label="Toggle wishlist"
                >
                    <Heart 
                        size={18} 
                        strokeWidth={1.5}
                        className={`transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/wishlist:text-red-500'}`} 
                    />
                </button>

                {/* Hover Actions Overlay */}
                {inStock && (
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 backdrop-blur-md shadow-lg ${
                                    inCart 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-white/95 text-dark hover:bg-white'
                                }`}
                            >
                                {inCart ? <ShoppingCart size={14} /> : <ShoppingCart size={14} />}
                                {inCart ? 'Added' : 'Add to Cart'}
                            </button>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                                title="Order via WhatsApp"
                            >
                                <ShoppingBag size={18} />
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="mt-4 flex flex-col flex-grow px-1">
                <Link to={`/product/${id}`} className="group/title">
                    <h3 className="text-[15px] font-medium text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem] group-hover/title:text-primary transition-colors">
                        {name}
                    </h3>
                </Link>

                <div className="mt-1 flex items-center gap-2">
                    <span className="text-[16px] font-semibold text-[#e19a9a]">₹{price}</span>
                    {originalPrice && (
                        <span className="text-[13px] text-gray-300 line-through">
                            ₹{originalPrice}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
