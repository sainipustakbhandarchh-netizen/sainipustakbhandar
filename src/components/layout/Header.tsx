import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, MapPin, ChevronDown, Heart, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [shopCategories, setShopCategories] = useState<any[]>([]);
    const { wishlistItems } = useWishlist();
    const { cartCount } = useCart();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
            if (data) {
                setShopCategories(data.filter(cat => !cat.slug.includes('free-book')));
            }
        };
        fetchCategories();
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { 
            name: 'Shop', 
            dropdown: shopCategories.length > 0 
                ? [
                    { name: 'All Products', path: '/category/all' },
                    ...shopCategories.map(cat => ({ name: cat.name, path: `/category/${cat.slug}` }))
                  ]
                : [
                    { name: 'All Products', path: '/category/all' },
                    { name: 'School Books', path: '/category/school-books' },
                    { name: 'Competitive Exams', path: '/category/competitive-exams' },
                    { name: 'Stationery', path: '/category/stationery' },
                ]
        },
        { name: 'Free Books & Learning', path: '/free-books' },
        { name: 'Services', path: '/services' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-secondary border-b border-primary/10 shadow-sm">
            {/* Top Bar - Contact Info */}
            <div className="hidden md:flex bg-primary text-secondary py-2 px-4 justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                        <Phone size={14} className="mr-2" /> +91 7419150418
                    </span>
                    <span className="flex items-center">
                        <MapPin size={14} className="mr-2" /> Visit our store in Chhachhrauli
                    </span>
                </div>
                <div>
                    <span className="font-semibold text-accent">Trusted Learning Partner Since 1996</span>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center pr-2">
                        <Link to="/" className="flex flex-col">
                            <span className="font-heading text-xl sm:text-2xl font-bold text-primary leading-none">
                                Saini Pustak Bhandar
                            </span>
                            <span className="text-[10px] sm:text-xs text-dark/70 font-medium tracking-wider mt-0.5 sm:mt-1">
                                EST. 1996
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden xl:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            link.dropdown ? (
                                <div key={link.name} className="relative group">
                                    <button className="flex items-center text-dark hover:text-primary font-medium transition-colors py-2">
                                        {link.name}
                                        <ChevronDown size={16} className="ml-1 group-hover:rotate-180 transition-transform duration-200" />
                                    </button>
                                    <div className="absolute left-0 mt-0 w-56 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-primary/10 transform translate-y-2 group-hover:translate-y-0">
                                        {link.dropdown.map(sublink => (
                                            <Link
                                                key={sublink.name}
                                                to={sublink.path}
                                                className="block px-4 py-3 text-sm font-medium text-dark hover:bg-primary hover:text-secondary transition-colors"
                                            >
                                                {sublink.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path!}
                                    className="text-dark hover:text-primary font-medium transition-colors py-2"
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                    </nav>

                    {/* Icons and Mobile Menu */}
                    <div className="flex items-center space-x-1 sm:space-x-2 xl:space-x-4">
                        <Link to="/wishlist" className="relative text-dark hover:text-primary transition-colors p-1.5 sm:p-2" aria-label="Wishlist">
                            <Heart size={22} className="sm:w-6 sm:h-6" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="relative text-dark hover:text-primary transition-colors p-1.5 sm:p-2" aria-label="Cart">
                            <ShoppingBag size={22} className="sm:w-6 sm:h-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile/Tablet Menu Button */}
                        <div className="flex items-center xl:hidden">
                            <button
                                onClick={toggleMenu}
                                className="text-dark hover:text-primary focus:outline-none p-1.5 sm:p-2"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X size={24} className="sm:w-7 sm:h-7" /> : <Menu size={24} className="sm:w-7 sm:h-7" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Nav */}
            {isMenuOpen && (
                <div className="xl:hidden absolute top-full left-0 w-full bg-secondary shadow-lg border-b border-primary/10 max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {navLinks.map((link) => (
                            link.dropdown ? (
                                <div key={link.name} className="py-1">
                                    <div className="px-3 py-2 text-base font-semibold text-dark flex items-center justify-between">
                                        {link.name}
                                    </div>
                                    <div className="mt-1 space-y-1 bg-white/50 rounded-lg py-2">
                                        {link.dropdown.map(sublink => (
                                            <Link
                                                key={sublink.name}
                                                to={sublink.path}
                                                className="block pl-6 pr-3 py-2 text-base font-medium text-dark/80 hover:text-primary hover:bg-white rounded-md transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {sublink.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path!}
                                    className="block px-3 py-3 text-base font-medium text-dark hover:text-primary hover:bg-white rounded-md transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                        <div className="mt-4 pt-4 border-t border-primary/10 flex flex-col space-y-3 px-3">
                            <a
                                href="https://wa.me/917419150418"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full bg-primary text-secondary px-4 py-2 rounded-lg font-semibold"
                            >
                                Order on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
