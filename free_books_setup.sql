-- Run this in your Supabase SQL Editor to create the free_books table

CREATE TABLE IF NOT EXISTS public.free_books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    class TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    license TEXT,
    category TEXT,
    read_link TEXT,
    download_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.free_books ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to free_books" 
ON public.free_books FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to insert free_books" 
ON public.free_books FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update free_books" 
ON public.free_books FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete free_books" 
ON public.free_books FOR DELETE 
USING (auth.role() = 'authenticated');
