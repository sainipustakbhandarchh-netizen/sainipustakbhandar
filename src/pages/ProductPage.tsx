import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ChevronRight, X, ArrowLeft, Download, Heart, ShoppingCart, Plus, Minus, Truck, ShieldCheck, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

export const ProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState<any>(null);
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addToCart, isInCart } = useCart();

    const inCart = product ? isInCart(product.id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const { data: productData } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (productData) {
                setProduct(productData);
                const { data: categoryData } = await supabase
                    .from('categories')
                    .select('name')
                    .eq('id', productData.category_id)
                    .single();
                
                if (categoryData) {
                    setCategory(categoryData);
                }
            }
            setLoading(false);
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    if (!product) return <div className="p-20 text-center">Product not found</div>;

    const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

    const categoryName = category ? category.name : 'Unknown Category';
    const whatsappMessage = `Hello Saini Pustak Bhandar! I want to order "${product.name}" from the ${categoryName} category. My location is ____.`;
    const whatsappUrl = `https://wa.me/917419150418?text=${encodeURIComponent(whatsappMessage)}`;

    const inWishlist = product ? isInWishlist(product.id) : false;

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist && product) {
            removeFromWishlist(product.id);
        } else if (product) {
            addToWishlist({ 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                originalPrice: product.original_price, 
                image: product.images && product.images.length > 0 ? product.images[0] : '', 
                category: categoryName, 
                inStock: product.in_stock !== false 
            });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-16 font-body">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-primary hover:underline mb-6 font-medium"
                >
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-1/2 p-6 flex flex-col items-center">
                        <div 
                            className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer group flex items-center justify-center"
                            onClick={() => setIsViewerOpen(true)}
                        >
                            {product.images && product.images.length > 0 ? (
                                <img 
                                    src={product.images[currentImageIndex]} 
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="text-gray-400">No Image Available</div>
                            )}
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                                    {discount}% OFF
                                </div>
                            )}
                            
                            {/* Wishlist Button */}
                            <button 
                                onClick={toggleWishlist}
                                className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors z-10 group/btn"
                                aria-label="Toggle wishlist"
                            >
                                <Heart 
                                    size={24} 
                                    className={`transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500 group-hover/btn:text-red-500'}`} 
                                />
                            </button>
                        </div>
                        
                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 mt-6 overflow-x-auto pb-2 w-full justify-center">
                                {product.images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-20 h-20 shrink-0 border-2 rounded-md overflow-hidden transition-colors ${currentImageIndex === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="md:w-1/2 p-8 md:border-l border-gray-100 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-primary font-medium uppercase tracking-wider">{categoryName}</span>
                            {product.in_stock === false && (
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Out of Stock</span>
                            )}
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-dark mb-4">{product.name}</h1>
                        
                        <div className="flex items-end gap-4 mb-4 pb-4">
                            <span className="text-4xl font-bold text-dark">₹{product.price}</span>
                            {product.original_price && (
                                <span className="text-xl text-gray-400 line-through mb-1">₹{product.original_price}</span>
                            )}
                        </div>


                        


                        {/* File Download Section (For Free Books & Learning) */}
                        {product.file_url && (
                            <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-dark">Attached Document</h4>
                                    <p className="text-sm text-gray-500">Download the associated file</p>
                                </div>
                                <a 
                                    href={product.file_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-primary hover:bg-gray-50 font-medium transition-colors shadow-sm"
                                >
                                    <Download size={18} /> Download
                                </a>
                            </div>
                        )}
                        {/* Highlighter Bullets */}
                        {product.highlighter_bullets && product.highlighter_bullets.length > 0 && (
                            <div className="mb-6">
                                <ul className="space-y-2">
                                    {product.highlighter_bullets.map((bullet: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2 text-dark font-medium text-lg">
                                            <div className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0"></div>
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {product.attributes && Object.keys(product.attributes).length > 0 && (
                            <div className="mb-8">
                                <ul className="space-y-3">
                                    {Object.entries(product.attributes).map(([key, value]) => (
                                        <li key={key} className="flex items-center gap-2 text-gray-600 text-lg">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                            <span>{key}: {String(value)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Check Delivery Section */}
                        <div className="mb-8 space-y-3">
                            <h3 className="font-heading font-semibold text-dark text-lg">Check Delivery:</h3>
                            <div className="flex gap-2 max-w-sm">
                                <input 
                                    type="text" 
                                    placeholder="Enter Pincode" 
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white shadow-sm"
                                />
                                <button 
                                    onClick={() => {
                                        if (pincode.length >= 6) {
                                            setDeliveryStatus("Yes, deliverable within 5-7 business days");
                                        } else {
                                            setDeliveryStatus("Please enter a valid pincode");
                                        }
                                    }}
                                    className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-dark hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                                >
                                    Check
                                </button>
                            </div>
                            {deliveryStatus && (
                                <p className={`text-sm font-medium ${deliveryStatus.includes('Yes') ? 'text-green-600' : 'text-red-500'}`}>
                                    {deliveryStatus}
                                </p>
                            )}
                        </div>

                        <div className="mt-auto space-y-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center space-x-4">
                                <span className="font-heading font-semibold">Quantity:</span>
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                    <button 
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="p-2 hover:bg-white text-gray-600 transition-colors"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-dark text-lg">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(prev => prev + 1)}
                                        className="p-2 hover:bg-white text-gray-600 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        addToCart({
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            image: product.images && product.images.length > 0 ? product.images[0] : '',
                                            category: categoryName
                                        }, quantity);
                                    }}
                                    disabled={product.in_stock === false}
                                    className={`flex items-center justify-center py-4 rounded-xl font-bold transition-all gap-2 text-lg border-2 ${
                                        inCart 
                                            ? 'bg-green-600 border-green-600 text-white' 
                                            : product.in_stock !== false 
                                                ? 'border-primary text-primary hover:bg-primary/5 shadow-sm' 
                                                : 'border-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {inCart ? (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            In Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={24} />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-center py-4 rounded-xl font-bold transition-all gap-2 text-lg shadow-lg ${
                                        product.in_stock !== false 
                                            ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20' 
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    <ShoppingBag size={24} />
                                    {product.in_stock !== false ? 'Order Now' : 'Inquire'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Info Sections */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-gray-200">
                    {/* Left Column: Description & Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-heading font-bold text-dark mb-6">Description</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                {product.description}
                            </p>
                        </section>

                        {product.extra_sections && product.extra_sections.map((section: any, idx: number) => (
                            <section key={idx}>
                                <h2 className="text-2xl font-heading font-bold text-dark mb-6">{section.heading}</h2>
                                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                    {section.content}
                                </p>
                            </section>
                        ))}
                    </div>

                    {/* Right Column: Policies */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4 text-primary">
                                <div className="p-3 bg-primary/5 rounded-xl">
                                    <Truck size={28} />
                                </div>
                                <h3 className="font-heading font-bold text-xl text-dark">Shipping Details</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Standard delivery within 3-7 business days across India. Free shipping on orders above ₹999. Tracking details will be shared via SMS/Email once dispatched.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4 text-red-500">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <ShieldCheck size={28} />
                                </div>
                                <h3 className="font-heading font-bold text-xl text-dark">Returns Policy</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                7-day easy return policy for damaged or incorrect items. Please ensure the item is in original condition. Contact us at +91 7419150418 for support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Image Viewer Modal */}
            {isViewerOpen && product.images && product.images.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-sm">
                    <button 
                        className="absolute top-6 right-6 text-white hover:text-gray-300 z-50 p-2"
                        onClick={() => setIsViewerOpen(false)}
                    >
                        <X size={32} />
                    </button>
                    
                    {product.images.length > 1 && (
                        <button 
                            className="absolute left-6 text-white hover:text-gray-300 z-50 p-2"
                            onClick={() => setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                        >
                            <ChevronLeft size={48} />
                        </button>
                    )}

                    <img 
                        src={product.images[currentImageIndex]} 
                        alt={product.name}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                    />

                    {product.images.length > 1 && (
                        <button 
                            className="absolute right-6 text-white hover:text-gray-300 z-50 p-2"
                            onClick={() => setCurrentImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                        >
                            <ChevronRight size={48} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
