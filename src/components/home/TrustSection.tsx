import React from 'react';
import { Award, ShieldCheck, Users, Clock } from 'lucide-react';

export const TrustSection: React.FC = () => {
    return (
        <section className="bg-primary text-white py-20 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2674&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-accent uppercase tracking-widest font-semibold text-sm mb-2 block">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                        A Legacy of Trust & Knowledge
                    </h2>
                    <p className="max-w-2xl mx-auto text-secondary/80 font-body text-lg">
                        Since 1996, Saini Pustak Bhandar has been the cornerstone of educational resources in our community. We pride ourselves on honesty, quality, and long-term relationships.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
                    {[
                        {
                            icon: Clock,
                            title: 'Est. 1996',
                            desc: 'Nearly 30 years of serving the local community with dedication.',
                        },
                        {
                            icon: ShieldCheck,
                            title: 'Trusted Quality',
                            desc: 'Genuine books and premium stationery directly from publishers.',
                        },
                        {
                            icon: Users,
                            title: '10k+ Students',
                            desc: 'Empowering generations of learners from primary to competitive levels.',
                        },
                        {
                            icon: Award,
                            title: 'School Partners',
                            desc: 'The preferred supplier for numerous schools and government teachers.',
                        },
                    ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm text-center transform hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="inline-flex p-3 rounded-full bg-accent/20 text-accent mb-4">
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-heading font-bold mb-2 text-white">
                                    {item.title}
                                </h3>
                                <p className="text-secondary/70 text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
