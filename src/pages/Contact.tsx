import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-accent uppercase tracking-widest font-semibold text-sm mb-2 block">
                        Get In Touch
                    </span>
                    <h1 className="text-4xl font-heading font-extrabold text-dark sm:text-5xl mb-4">
                        Contact & Location
                    </h1>
                    <div className="h-1 w-24 bg-accent mx-auto rounded mb-6"></div>
                    <p className="text-lg text-gray-600 font-body">
                        Visit our store, call us, or send a WhatsApp message. We are always ready to assist you with your educational needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                    {/* Contact Information Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-secondary/50 rounded-2xl p-6 border border-primary/10 flex items-start">
                            <div className="bg-primary/10 p-3 rounded-full text-primary mr-4 shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-lg mb-1">Visit Us</h3>
                                <p className="text-gray-600 font-body text-sm">Chhachhrauli,<br />Yamunanagar,<br />Haryana</p>
                            </div>
                        </div>

                        <div className="bg-secondary/50 rounded-2xl p-6 border border-primary/10 flex items-start">
                            <div className="bg-primary/10 p-3 rounded-full text-primary mr-4 shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-lg mb-1">Call / WhatsApp</h3>
                                <p className="text-gray-600 font-body text-sm mb-2">Our team is available to chat.</p>
                                <a href="tel:+917419150418" className="text-primary font-bold hover:text-dark transition-colors">+91 7419150418</a>
                            </div>
                        </div>

                        <div className="bg-secondary/50 rounded-2xl p-6 border border-primary/10 flex items-start">
                            <div className="bg-primary/10 p-3 rounded-full text-primary mr-4 shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-lg mb-1">Email Us</h3>
                                <p className="text-gray-600 font-body text-sm mb-2">For bulk orders & schools.</p>
                                <a href="mailto:Sainipustakbhandarchh@gmail.com" className="text-primary font-bold hover:text-dark transition-colors">Sainipustakbhandarchh@gmail.com</a>
                            </div>
                        </div>

                        <div className="bg-secondary/50 rounded-2xl p-6 border border-primary/10 flex items-start">
                            <div className="bg-primary/10 p-3 rounded-full text-primary mr-4 shrink-0">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-lg mb-1">Opening Hours</h3>
                                <ul className="text-gray-600 font-body text-sm space-y-1">
                                    <li className="flex justify-between w-full"><span>Mon - Sun:</span> <span>9:00 AM - 8:00 PM</span></li>
                                    <li className="flex justify-between w-full"><span>Everyday:</span> <span className="text-accent font-medium">Open all 7 days</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form & Map */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-heading font-bold text-dark mb-6">Send us a Message</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input type="tel" id="phone" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" placeholder="+91 XXXXX XXXXX" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <select id="subject" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow bg-white">
                                        <option>General Inquiry</option>
                                        <option>Book Availability</option>
                                        <option>Bulk Order / School Tie-up</option>
                                        <option>Feedback</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="button" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Google Map Placeholder */}
                        <div className="bg-gray-100 rounded-2xl h-80 overflow-hidden border border-gray-200 relative group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2948&auto=format&fit=crop" alt="Map Location" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-secondary/80 flex flex-col items-center justify-center p-6 text-center z-10 backdrop-blur-[2px]">
                                <MapPin size={48} className="text-primary mb-4" />
                                <h3 className="font-heading font-bold text-xl mb-2">Find Us on Google Maps</h3>
                                <p className="text-sm text-gray-600 mb-4 max-w-md">In a real production environment, an interactive Google Map iframe will be embedded here pointing to the exact shop location.</p>
                                <div className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Interactive Map Placeholder</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
