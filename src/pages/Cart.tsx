import React from 'react';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Cart: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    const handleWhatsAppOrder = () => {
        const message = encodeURIComponent(
            `Hello Saini Pustak Bhandar! I'd like to order the following items:\n\n` +
            cartItems.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`).join('\n') +
            `\n\n*Total Amount: ₹${cartTotal}*`
        );
        window.open(`https://wa.me/917419150418?text=${message}`, '_blank');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
            <h1 className="text-3xl font-heading font-bold text-dark mb-8 flex items-center">
                <ShoppingBag className="mr-3 text-primary" />
                Your Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-primary/10">
                    <div className="bg-primary/5 p-6 rounded-full mb-6">
                        <ShoppingCart size={64} className="text-primary/20" />
                    </div>
                    <h2 className="text-2xl font-semibold text-dark mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-md text-center">
                        Looks like you haven't added anything to your cart yet. Browse our collection to find something you like!
                    </p>
                    <Link 
                        to="/category/all" 
                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center"
                    >
                        Start Shopping <ArrowRight size={20} className="ml-2" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-2xl shadow-sm border border-primary/5 hover:border-primary/20 transition-all">
                                <div className="w-24 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden mb-4 sm:mb-0">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="sm:ml-6 flex-grow text-center sm:text-left">
                                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                                        {item.category}
                                    </div>
                                    <h3 className="text-lg font-bold text-dark mb-1">{item.name}</h3>
                                    <p className="text-primary font-bold text-xl">₹{item.price}</p>
                                </div>
                                
                                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-white text-gray-600 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-10 text-center font-bold text-dark">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-white text-gray-600 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-primary/10 sticky top-24">
                            <h2 className="text-xl font-bold text-dark mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-lg font-bold text-dark">Total</span>
                                    <span className="text-2xl font-bold text-primary">₹{cartTotal}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleWhatsAppOrder}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 mb-4"
                            >
                                <span>Place Order via WhatsApp</span>
                            </button>
                            
                            <Link 
                                to="/category/all" 
                                className="w-full flex items-center justify-center py-2 text-gray-500 font-medium hover:text-primary transition-colors text-sm"
                            >
                                Continue Shopping
                            </Link>

                            <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
                                <p className="text-xs text-dark/70 leading-relaxed italic">
                                    * Click the button above to send your cart details to us on WhatsApp. We'll confirm your order and provide payment details there.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
