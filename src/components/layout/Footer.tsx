import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Instagram, Facebook, Clock, X, AtSign } from 'lucide-react';

export const Footer: React.FC = () => {
    const [showToast, setShowToast] = useState(false);

    const handleComingSoonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };
    return (
        <footer className="bg-dark text-secondary pt-16 pb-8 border-t-4 border-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-heading text-2xl font-bold text-accent mb-1">
                                Saini Pustak Bhandar
                            </h3>
                            <p className="text-xs text-secondary/70 tracking-widest font-medium uppercase">
                                Established 1996
                            </p>
                        </div>
                        <p className="text-sm text-secondary/80 leading-relaxed">
                            Your trusted learning partner for decades. We provide school books, competitive exam preparation materials, stationery, and premium office supplies with honest service and community focus.
                        </p>
                        <div className="flex space-x-4 pt-2 relative">
                            <a 
                                href="https://www.instagram.com/sainipustakbhandarchh?igsh=MWpsaHphNmk4ZHJzdA%3D%3D&utm_source=qr" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-secondary/80 hover:text-accent transition-colors"
                                title="Follow us on Instagram"
                            >
                                <Instagram size={20} />
                            </a>
                            <a 
                                href="https://www.threads.com/@sainipustakbhandarchh?igshid=NTc4MTIwNjQ2YQ==" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-secondary/80 hover:text-accent transition-colors"
                                title="Follow us on Threads"
                            >
                                <AtSign size={20} />
                            </a>
                            <a href="#" onClick={handleComingSoonClick} className="text-secondary/80 hover:text-accent transition-colors" title="Facebook (Coming Soon)">
                                <Facebook size={20} />
                            </a>

                            {/* Themed Toast Popup */}
                            <div className={`absolute bottom-full left-0 mb-4 w-64 bg-secondary rounded-xl shadow-xl p-4 border border-primary/20 transform transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-heading font-bold text-primary text-sm mb-1">Coming Soon!</h4>
                                        <p className="text-xs text-dark/70 font-body">Our social media pages are currently under construction. Check back soon!</p>
                                    </div>
                                    <button onClick={() => setShowToast(false)} className="text-dark hover:text-primary transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-secondary transform rotate-45 border-b border-r border-primary/20"></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading text-lg font-semibold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-secondary/80">
                            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                            <li><Link to="/category/school-books" className="hover:text-accent transition-colors">School Books</Link></li>
                            <li><Link to="/category/competitive-exams" className="hover:text-accent transition-colors">Competitive Exams</Link></li>
                            <li><Link to="/services" className="hover:text-accent transition-colors">Services & Printing</Link></li>
                            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-heading text-lg font-semibold text-white mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-secondary/80">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-3 text-accent shrink-0 mt-0.5" />
                                <span>Chhachhrauli,<br />Yamunanagar,<br />Haryana</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-3 text-accent shrink-0" />
                                <a href="tel:+917419150418" className="hover:text-accent transition-colors">+91 7419150418</a>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-3 text-accent shrink-0" />
                                <a href="mailto:Sainipustakbhandarchh@gmail.com" className="hover:text-accent transition-colors">Sainipustakbhandarchh@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Store Hours */}
                    <div>
                        <h4 className="font-heading text-lg font-semibold text-white mb-6">Store Hours</h4>
                        <ul className="space-y-3 text-sm text-secondary/80">
                            <li className="flex items-center justify-between border-b border-white/10 pb-2">
                                <span className="flex items-center"><Clock size={16} className="mr-2 text-primary" /> Mon - Sun</span>
                                <span>9:00 AM - 8:00 PM</span>
                            </li>
                            <li className="flex items-center justify-between pt-1">
                                <span className="flex items-center"><Clock size={16} className="mr-2 text-primary" /> Everyday</span>
                                <span className="text-accent">Open all 7 days</span>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <a
                                href="https://wa.me/917419150418"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors shadow-md"
                            >
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-secondary/50">
                    <p>&copy; {new Date().getFullYear()} Saini Pustak Bhandar. All rights reserved.</p>
                    <div className="space-x-4 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
