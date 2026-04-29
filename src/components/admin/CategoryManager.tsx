import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, X, Edit2 } from 'lucide-react';

export const CategoryManager = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [attributes, setAttributes] = useState<string[]>([]);
    const [newAttribute, setNewAttribute] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string>('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
        if (data) setCategories(data);
    };

    const handleAddAttribute = () => {
        if (newAttribute.trim() && !attributes.includes(newAttribute.trim())) {
            setAttributes([...attributes, newAttribute.trim()]);
            setNewAttribute('');
        }
    };

    const handleRemoveAttribute = (attrToRemove: string) => {
        setAttributes(attributes.filter(a => a !== attrToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        if (editingId) {
            const { error } = await supabase.from('categories').update({ name, slug, description, attributes_schema: attributes }).eq('id', editingId);
            if (!error) {
                resetForm();
                fetchCategories();
            } else {
                alert('Error: ' + error.message);
            }
        } else {
            const { error } = await supabase.from('categories').insert([
                { name, slug, description, attributes_schema: attributes }
            ]);
            if (!error) {
                resetForm();
                fetchCategories();
            } else {
                alert('Error: ' + error.message);
            }
        }
        setLoading(false);
    };

    const resetForm = () => {
        setName('');
        setSlug('');
        setDescription('');
        setAttributes([]);
        setEditingId(null);
    };

    const handleEdit = (cat: any) => {
        setEditingId(cat.id);
        setName(cat.name);
        setSlug(cat.slug);
        setDescription(cat.description || '');
        setAttributes(cat.attributes_schema || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const initiateDelete = (id: string) => {
        setDeletingId(id);
        setDeleteError('');
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        
        const { error } = await supabase.from('categories').delete().eq('id', deletingId);
        
        if (error) {
            // Error code 23503 indicates a foreign key constraint violation (e.g., products still use this category)
            if (error.code === '23503') {
                setDeleteError('Cannot delete this category because there are products associated with it. Please reassign or delete those products first.');
            } else {
                setDeleteError('Error deleting category: ' + error.message);
            }
        } else {
            setDeletingId(null);
            fetchCategories();
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-heading font-bold text-dark">
                        {editingId ? 'Edit Category' : 'Create New Category'}
                    </h3>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-dark">Cancel Edit</button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Category Name</label>
                            <input 
                                type="text" 
                                required 
                                value={name} 
                                onChange={e => { 
                                    setName(e.target.value); 
                                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')); 
                                }} 
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="e.g., School Books"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">URL Slug</label>
                            <input 
                                type="text" 
                                required 
                                value={slug} 
                                onChange={e => setSlug(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-gray-50" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Category Subtitle / Description</label>
                            <input 
                                type="text" 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="e.g., NCERT, CBSE & State Board textbooks for all classes."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Dynamic Attributes</label>
                        <p className="text-xs text-gray-500 mb-2">Define the specific fields products in this category will need (e.g., "Class", "Board", "Exam Type").</p>
                        <div className="flex gap-2 mb-3">
                            <input 
                                type="text" 
                                value={newAttribute} 
                                onChange={e => setNewAttribute(e.target.value)} 
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddAttribute())} 
                                placeholder="Add an attribute field and press Add" 
                                className="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                            />
                            <button type="button" onClick={handleAddAttribute} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center font-medium gap-1">
                                <Plus size={18}/> Add
                            </button>
                        </div>
                        {attributes.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px]">
                                {attributes.map(attr => (
                                    <span key={attr} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                                        {attr}
                                        <button type="button" onClick={() => handleRemoveAttribute(attr)} className="hover:text-red-500 transition-colors"><X size={14} /></button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors">
                        {loading ? 'Saving Category...' : (editingId ? 'Update Category' : 'Save Category')}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500 text-sm">Category Info</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-sm">URL Slug</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-sm">Dynamic Fields</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map(cat => (
                            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-dark">{cat.name}</div>
                                    {cat.description && <div className="text-xs text-gray-500 mt-1">{cat.description}</div>}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{cat.slug}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 flex-wrap">
                                        {(cat.attributes_schema || []).map((a: string) => (
                                            <span key={a} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium border border-gray-200">{a}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(cat)} className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg mr-1">
                                        <Edit2 size={18}/>
                                    </button>
                                    <button type="button" onClick={() => initiateDelete(cat.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No categories found. Create one above!</td>
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
                        <h3 className="text-xl font-heading font-bold text-center text-dark mb-2">Delete Category</h3>
                        <p className="text-center text-gray-600 mb-6">
                            Are you sure you want to delete this category? This action cannot be undone.
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
