import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X, FileText, CheckCircle, Trash2, Edit2, Filter, PlusCircle } from 'lucide-react';

export const ProductManager = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // List State
    const [products, setProducts] = useState<any[]>([]);
    const [filterCategoryId, setFilterCategoryId] = useState<string>('all');

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [inStock, setInStock] = useState(true);
    const [attributes, setAttributes] = useState<Record<string, string>>({});
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [existingDocumentUrl, setExistingDocumentUrl] = useState<string | null>(null);
    const [extraSections, setExtraSections] = useState<{heading: string, content: string}[]>([]);
    const [highlighterBullets, setHighlighterBullets] = useState<string[]>(['']);
    const [isFeatured, setIsFeatured] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string>('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProducts();
    }, [filterCategoryId]);

    const fetchProducts = async () => {
        let query = supabase.from('products').select('*').order('created_at', { ascending: false });
        if (filterCategoryId && filterCategoryId !== 'all') {
            query = query.eq('category_id', filterCategoryId);
        }
        const { data, error } = await query;
        if (data) setProducts(data);
    };

    useEffect(() => {
        supabase.from('categories').select('*').then(({data}) => {
            if(data) {
                setCategories(data);
                if(data.length > 0) setCategoryId(data[0].id);
            }
        });
    }, []);

    const selectedCategory = categories.find(c => c.id === categoryId);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages([...images, ...Array.from(e.target.files)]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const handleAttributeChange = (key: string, value: string) => {
        setAttributes(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (images.length === 0 && existingImages.length === 0) {
            alert("Please select at least one image.");
            return;
        }

        setLoading(true);
        
        try {
            // 1. Upload Images
            const imageUrls = [];
            for (const file of images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
                
                if (uploadError) throw new Error("Image Upload Error: " + uploadError.message + "\nDid you remember to create the 'product-images' public storage bucket?");
                
                const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
                imageUrls.push(publicUrl);
            }

            // 1.5 Upload Document (if any)
            let fileUrl = existingDocumentUrl;
            if (documentFile) {
                const fileExt = documentFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: docUploadError } = await supabase.storage.from('product-files').upload(fileName, documentFile);
                
                if (docUploadError) throw new Error("Document Upload Error: " + docUploadError.message + "\nDid you remember to create the 'product-files' public storage bucket?");
                
                const { data: { publicUrl } } = supabase.storage.from('product-files').getPublicUrl(fileName);
                fileUrl = publicUrl;
            }

            const productPayload = {
                name,
                description,
                price: parseFloat(price),
                original_price: originalPrice ? parseFloat(originalPrice) : null,
                category_id: categoryId,
                images: [...existingImages, ...imageUrls],
                in_stock: inStock,
                file_url: fileUrl,
                attributes,
                is_featured: isFeatured,
                highlighter_bullets: highlighterBullets.filter(b => b.trim() !== ''),
                extra_sections: extraSections.filter(s => s.heading.trim() !== '' && s.content.trim() !== '')
            };

            // 2. Insert or Update Product
            if (editingId) {
                const { error: dbError } = await supabase.from('products').update(productPayload).eq('id', editingId);
                if (dbError) throw dbError;
                setSuccessMessage('✨ Product updated successfully!');
            } else {
                const { error: dbError } = await supabase.from('products').insert([productPayload]);
                if (dbError) throw dbError;
                setSuccessMessage('✨ Product published successfully to the store!');
            }

            setTimeout(() => setSuccessMessage(''), 4000);
            resetForm();
            fetchProducts();
            
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName(''); setDescription(''); setPrice(''); setOriginalPrice('');
        setDocumentFile(null); setExistingDocumentUrl(null); setEditingId(null);
        setHighlighterBullets(['']); setExtraSections([]); setIsFeatured(false);
        if(fileInputRef.current) fileInputRef.current.value = '';
        if(docInputRef.current) docInputRef.current.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEdit = (product: any) => {
        setEditingId(product.id);
        setName(product.name);
        setDescription(product.description || '');
        setPrice(product.price.toString());
        setOriginalPrice(product.original_price ? product.original_price.toString() : '');
        setCategoryId(product.category_id);
        setInStock(product.in_stock);
        setAttributes(product.attributes || {});
        setExistingImages(product.images || []);
        setImages([]);
        setExistingDocumentUrl(product.file_url || null);
        setDocumentFile(null);
        setHighlighterBullets(product.highlighter_bullets && product.highlighter_bullets.length > 0 ? product.highlighter_bullets : ['']);
        setExtraSections(product.extra_sections || []);
        setIsFeatured(product.is_featured || false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const initiateDelete = (id: string) => {
        setDeletingId(id);
        setDeleteError('');
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        
        const { error } = await supabase.from('products').delete().eq('id', deletingId);
        
        if (error) {
            setDeleteError('Error deleting product: ' + error.message);
        } else {
            setDeletingId(null);
            fetchProducts();
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-heading font-bold text-dark">
                        {editingId ? 'Edit Product' : 'Publish New Product'}
                    </h3>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-dark font-medium">Cancel Edit</button>
                    )}
                </div>
            
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 shadow-sm transition-all duration-300">
                    <CheckCircle size={20} className="text-green-500 shrink-0" />
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}
            
            {categories.length === 0 ? (
                <div className="bg-orange-50 text-orange-600 p-4 rounded-lg">
                    Please create at least one category in the Category Manager before uploading products.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium mb-3 text-gray-700">Product Images</label>
                        <div className="flex flex-wrap gap-4 mb-2">
                            {existingImages.map((url, i) => (
                                <div key={`existing-${i}`} className="relative w-28 h-28 border border-gray-200 rounded-xl overflow-hidden group shadow-sm">
                                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"><X size={14}/></button>
                                </div>
                            ))}
                            {images.map((file, i) => (
                                <div key={`new-${i}`} className="relative w-28 h-28 border border-green-200 rounded-xl overflow-hidden group shadow-sm">
                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 bg-green-500 text-white text-[10px] text-center py-0.5">New</div>
                                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"><X size={14}/></button>
                                </div>
                            ))}
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                                <Upload size={24} className="mb-2" />
                                <span className="text-xs font-medium">Upload Image</span>
                            </button>
                        </div>
                        <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                    </div>

                    {/* Document Upload (Optional) */}
                    <div>
                        <label className="block text-sm font-medium mb-3 text-gray-700">Attach Document (Optional - for Free Books & Learning)</label>
                        <div className="flex items-center gap-4">
                            {documentFile ? (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100">
                                    <FileText size={18} />
                                    <span className="text-sm font-medium truncate max-w-[200px]">{documentFile.name}</span>
                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded ml-1">New</span>
                                    <button type="button" onClick={() => setDocumentFile(null)} className="ml-2 hover:text-red-500"><X size={16}/></button>
                                </div>
                            ) : existingDocumentUrl ? (
                                <div className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200">
                                    <FileText size={18} />
                                    <span className="text-sm font-medium">Existing Document</span>
                                    <button type="button" onClick={() => setExistingDocumentUrl(null)} className="ml-2 hover:text-red-500" title="Remove Document"><X size={16}/></button>
                                </div>
                            ) : null}
                            
                            {!documentFile && (
                                <button type="button" onClick={() => docInputRef.current?.click()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <Upload size={16} /> {existingDocumentUrl ? 'Replace File' : 'Choose File (PDF, Word)'}
                                </button>
                            )}
                            <input type="file" className="hidden" ref={docInputRef} onChange={(e) => { if(e.target.files && e.target.files[0]) setDocumentFile(e.target.files[0]); }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Product Name</label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                            <select required value={categoryId} onChange={e => {
                                setCategoryId(e.target.value);
                                setAttributes({}); // Reset attributes on category change
                            }} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all bg-white">
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Price (₹)</label>
                            <input type="number" required min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Original Price (Optional, shows discount)</label>
                            <input type="number" min="0" step="0.01" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                        <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <input 
                                type="checkbox" 
                                id="inStock"
                                checked={inStock}
                                onChange={(e) => setInStock(e.target.checked)}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <label htmlFor="inStock" className="font-medium text-gray-700 cursor-pointer">
                                Product is currently In Stock
                            </label>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-amber-50/50 border border-amber-100 rounded-lg">
                            <input 
                                type="checkbox" 
                                id="isFeatured"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <label htmlFor="isFeatured" className="font-medium text-amber-900 cursor-pointer flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                Feature on Homepage
                            </label>
                        </div>
                    </div>

                    {selectedCategory?.attributes_schema && selectedCategory.attributes_schema.length > 0 && (
                        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                            <h4 className="font-medium text-dark flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                Dynamic Fields for {selectedCategory.name}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedCategory.attributes_schema.map((attr: string) => (
                                    <div key={attr}>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">{attr}</label>
                                        <input 
                                            type="text" 
                                            value={attributes[attr] || ''} 
                                            onChange={e => handleAttributeChange(attr, e.target.value)} 
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all bg-white" 
                                            placeholder={`e.g., Value for ${attr}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Highlighter Bullets */}
                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4">
                        <h4 className="font-medium text-blue-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Highlighter Bullets (Shown at top of list)
                        </h4>
                        <div className="space-y-3">
                            {highlighterBullets.map((bullet, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={bullet} 
                                        onChange={e => {
                                            const newBullets = [...highlighterBullets];
                                            newBullets[idx] = e.target.value;
                                            setHighlighterBullets(newBullets);
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all bg-white" 
                                        placeholder="e.g., Premium Quality Paper"
                                    />
                                    {highlighterBullets.length > 1 && (
                                        <button type="button" onClick={() => setHighlighterBullets(highlighterBullets.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => setHighlighterBullets([...highlighterBullets, ''])} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                                <PlusCircle size={14} /> Add Another Bullet
                            </button>
                        </div>
                    </div>

                    {/* Extra Sections (Dynamic Headings) */}
                    <div className="p-6 bg-purple-50/50 border border-purple-100 rounded-xl space-y-4">
                        <h4 className="font-medium text-purple-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Extra Information Sections (Below Description)
                        </h4>
                        <div className="space-y-6">
                            {extraSections.map((section, idx) => (
                                <div key={idx} className="space-y-3 p-4 bg-white border border-purple-100 rounded-lg relative">
                                    <button type="button" onClick={() => setExtraSections(extraSections.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors">
                                        <X size={18} />
                                    </button>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Heading</label>
                                        <input 
                                            type="text" 
                                            value={section.heading} 
                                            onChange={e => {
                                                const newSections = [...extraSections];
                                                newSections[idx].heading = e.target.value;
                                                setExtraSections(newSections);
                                            }}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" 
                                            placeholder="e.g., The Handmade Story"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Content</label>
                                        <textarea 
                                            rows={3}
                                            value={section.content} 
                                            onChange={e => {
                                                const newSections = [...extraSections];
                                                newSections[idx].content = e.target.value;
                                                setExtraSections(newSections);
                                            }}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" 
                                            placeholder="Details for this section..."
                                        />
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={() => setExtraSections([...extraSections, {heading: '', content: ''}])} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                                <PlusCircle size={14} /> Add New Info Section
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-sm hover:shadow-md">
                        {loading ? 'Saving...' : (editingId ? 'Update Product' : 'Publish Product to Store')}
                    </button>
                </form>
            )}
            </div>

            {/* Product List Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-heading font-bold text-dark">Manage Products</h3>
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select 
                            value={filterCategoryId} 
                            onChange={(e) => setFilterCategoryId(e.target.value)}
                            className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none bg-white font-medium"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Product</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Price</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(product => {
                                const cat = categories.find(c => c.id === product.category_id);
                                return (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-white">
                                                <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-dark line-clamp-1">{product.name}</div>
                                                <div className="text-xs text-primary mt-0.5">{cat?.name || 'Unknown Category'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-dark">₹{product.price}</div>
                                        {product.original_price && <div className="text-xs text-gray-400 line-through">₹{product.original_price}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg mr-1" title="Edit Product">
                                            <Edit2 size={18}/>
                                        </button>
                                        <button type="button" onClick={() => initiateDelete(product.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg" title="Delete Product">
                                            <Trash2 size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            )})}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Filter size={32} className="text-gray-300 mb-3" />
                                            <p>No products found in this category.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-100 animate-fade-in-up">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <Trash2 className="text-red-600" size={24} />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-center text-dark mb-2">Delete Product</h3>
                        <p className="text-center text-gray-600 mb-6">
                            Are you sure you want to delete this product? This action cannot be undone.
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
