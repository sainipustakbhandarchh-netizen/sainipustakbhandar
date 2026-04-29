import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit2 } from 'lucide-react';

export const FreeBooksManager = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [bookClass, setBookClass] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [license, setLicense] = useState('');
    const [category, setCategory] = useState('');
    const [readLink, setReadLink] = useState('');
    const [downloadLink, setDownloadLink] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string>('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const { data } = await supabase.from('free_books').select('*').order('created_at', { ascending: false });
        if (data) setBooks(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const payload = { 
            title, 
            class: bookClass, 
            subject, 
            description, 
            license, 
            category,
            read_link: readLink,
            download_link: downloadLink
        };

        if (editingId) {
            const { error } = await supabase.from('free_books').update(payload).eq('id', editingId);
            if (!error) {
                resetForm();
                fetchBooks();
            } else {
                alert('Error: ' + error.message);
            }
        } else {
            const { error } = await supabase.from('free_books').insert([payload]);
            if (!error) {
                resetForm();
                fetchBooks();
            } else {
                alert('Error: ' + error.message);
            }
        }
        setLoading(false);
    };

    const resetForm = () => {
        setTitle('');
        setBookClass('');
        setSubject('');
        setDescription('');
        setLicense('');
        setCategory('');
        setReadLink('');
        setDownloadLink('');
        setEditingId(null);
    };

    const handleEdit = (book: any) => {
        setEditingId(book.id);
        setTitle(book.title || '');
        setBookClass(book.class || '');
        setSubject(book.subject || '');
        setDescription(book.description || '');
        setLicense(book.license || '');
        setCategory(book.category || '');
        setReadLink(book.read_link || '');
        setDownloadLink(book.download_link || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const initiateDelete = (id: string) => {
        setDeletingId(id);
        setDeleteError('');
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        
        const { error } = await supabase.from('free_books').delete().eq('id', deletingId);
        
        if (error) {
            setDeleteError('Error deleting book: ' + error.message);
        } else {
            setDeletingId(null);
            fetchBooks();
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-heading font-bold text-dark">
                        {editingId ? 'Edit Free Book/Resource' : 'Add New Free Book/Resource'}
                    </h3>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-dark">Cancel Edit</button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                            <input 
                                type="text" 
                                required 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="e.g., NCERT Class 6 Science"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                            <input 
                                type="text" 
                                value={category} 
                                onChange={e => setCategory(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="e.g., Government & Official Free PDFs"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Class</label>
                            <input 
                                type="text" 
                                required 
                                value={bookClass} 
                                onChange={e => setBookClass(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="e.g., Class 6"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Subject</label>
                            <input 
                                type="text" 
                                required 
                                value={subject} 
                                onChange={e => setSubject(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="e.g., Science"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                            <textarea 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="Brief description of the resource"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">License</label>
                            <input 
                                type="text" 
                                value={license} 
                                onChange={e => setLicense(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="e.g., Official NCERT PDF"
                            />
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Read Online Link</label>
                                <input 
                                    type="url" 
                                    value={readLink} 
                                    onChange={e => setReadLink(e.target.value)} 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Download Link</label>
                                <input 
                                    type="url" 
                                    value={downloadLink} 
                                    onChange={e => setDownloadLink(e.target.value)} 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors">
                        {loading ? 'Saving...' : (editingId ? 'Update Resource' : 'Save Resource')}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500 text-sm">Resource Details</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-sm">Category / Class / Subject</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-sm">Links</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {books.map(book => (
                            <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-dark">{book.title}</div>
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{book.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-dark">{book.category}</div>
                                    <div className="text-xs text-gray-500">{book.class} • {book.subject}</div>
                                    <div className="text-xs text-gray-400 mt-1">{book.license}</div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {book.read_link && <a href={book.read_link} target="_blank" rel="noreferrer" className="text-primary hover:underline block">Read</a>}
                                    {book.download_link && <a href={book.download_link} target="_blank" rel="noreferrer" className="text-accent hover:underline block mt-1">Download</a>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(book)} className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg mr-1">
                                        <Edit2 size={18}/>
                                    </button>
                                    <button type="button" onClick={() => initiateDelete(book.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {books.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No free books found. Create one above!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-100 animate-fade-in-up">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <Trash2 className="text-red-600" size={24} />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-center text-dark mb-2">Delete Resource</h3>
                        <p className="text-center text-gray-600 mb-6">
                            Are you sure you want to delete this resource? This action cannot be undone.
                        </p>
                        
                        {deleteError && (
                            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center font-medium">
                                {deleteError}
                            </div>
                        )}
                        
                        <div className="flex gap-3 justify-center">
                            <button 
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors w-full"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button"
                                onClick={confirmDelete}
                                className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors w-full"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
