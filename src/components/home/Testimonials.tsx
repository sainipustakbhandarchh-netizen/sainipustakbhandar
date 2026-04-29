import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: "Rajesh Kumar",
        role: "Parent of Class 10 Student",
        content: "Saini Pustak Bhandar has been our go-to bookstore for years. They always have the exact school book sets we need, and the quality of their stationery is excellent.",
        rating: 5,
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "Government Teacher",
        content: "We partnered with them for bulk supplies for our school. Their service is incredibly reliable, professional, and they offer great discounts for bulk orders.",
        rating: 5,
    },
    {
        id: 3,
        name: "Amit Patel",
        role: "UPSC Aspirant",
        content: "Found all the latest editions of my competitive exam books here. The staff is very knowledgeable and helped me find the right study materials quickly.",
        rating: 5,
    }
];

export const Testimonials: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold text-dark sm:text-4xl text-center">
                        What Our Customers Say
                    </h2>
                    <div className="mt-2 h-1 w-20 bg-accent mx-auto rounded"></div>
                    <p className="mt-4 text-gray-500 font-body max-w-2xl mx-auto">
                        Real reviews from our community of students, parents, and educators.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-secondary/30 rounded-2xl p-8 border border-primary/10 relative hover:shadow-lg transition-shadow duration-300"
                        >
                            <Quote className="absolute top-6 right-6 text-primary/10" size={48} />

                            <div className="flex text-accent mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={18} fill="currentColor" />
                                ))}
                            </div>

                            <p className="text-gray-700 italic mb-6 relative z-10 leading-relaxed">
                                "{review.content}"
                            </p>

                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg mr-4">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-heading font-bold text-dark">{review.name}</h4>
                                    <p className="text-xs text-gray-500">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                        href="https://www.google.ca/search?utm_medium=noren&utm_source=gbp&utm_campaign=2026&q=Saini+Pustak+Bhandar&ludocid=8531319118791711880&lsig=AB86z5UcB-yJvm1JYMQyDj4PU5Bj&sei=3lPxaZDULtuh0PEPvZeMoA0#ebo=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:text-dark transition-colors border-b-2 border-primary pb-1"
                    >
                        Read more reviews on Google
                        <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    </a>
                    <a
                        href="https://g.page/r/CYgcFKWJVWV2EBM/review"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:text-dark transition-colors border-b-2 border-primary pb-1"
                    >
                        Leave a review
                        <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};
