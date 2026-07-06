import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, FileDown, Scissors, QrCode, Image as ImageIcon, Search, ArrowRight, 
  Zap, Shield, Smartphone, ScanLine, FileEdit, Lock, Unlock, 
  RotateCw, RefreshCw, Globe, Crop, Brain, Languages, Workflow,
  FileCheck, FileSearch, PenTool, Hash, LayoutGrid, Layers, Maximize, Menu, X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const categories = [
  'All',
  'Organize PDF',
  'Convert PDF',
  'Edit PDF',
  'Image Tools'
];

const allTools = [
  // Organize PDF
  { id: 'merge-pdf', name: 'Merge PDF', path: '/tools/merge-pdf', icon: Layers, desc: 'Combine PDFs in the order you want with the easiest PDF merger available.', category: 'Organize PDF', color: 'bg-red-500' },
  { id: 'split-pdf', name: 'Split PDF', path: '/tools/split-pdf', icon: Scissors, desc: 'Separate one page or a whole set for easy conversion into independent PDF files.', category: 'Organize PDF', color: 'bg-orange-500' },
  { id: 'rotate-pdf', name: 'Rotate PDF', path: '/tools/rotate-pdf', icon: RotateCw, desc: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!', category: 'Organize PDF', color: 'bg-orange-600' },

  // Optimize PDF

  // Convert PDF
  { id: 'pdf-to-word', name: 'PDF to Word', path: '/tools/pdf-to-word', icon: FileText, desc: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.', category: 'Convert PDF', color: 'bg-blue-600' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', path: '/tools/pdf-to-excel', icon: FileText, desc: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.', category: 'Convert PDF', color: 'bg-emerald-600' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', path: '/tools/jpg-to-pdf', icon: ImageIcon, desc: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', category: 'Convert PDF', color: 'bg-sky-400' },
  { id: 'scan-to-pdf', name: 'Scan to PDF', path: '/tools/scan-to-pdf', icon: Maximize, desc: 'Capture document scans from your mobile device and send them instantly to your browser.', category: 'Convert PDF', color: 'bg-indigo-600' },
  { id: 'pdf-to-html', name: 'New! PDF to HTML', path: '/tools/pdf-to-html', icon: Globe, desc: 'Easily turn PDFs into HTML files. Perfect for web display.', category: 'Convert PDF', color: 'bg-slate-700' },

  // Edit PDF
  { id: 'watermark', name: 'Watermark', path: '/tools/watermark', icon: PenTool, desc: 'Stamp an image or text over your PDF in seconds. Choose typography, transparency.', category: 'Edit PDF', color: 'bg-pink-400' },
  { id: 'page-numbers', name: 'Page numbers', path: '/tools/page-numbers', icon: Hash, desc: 'Add page numbers into PDFs with ease. Choose your positions, dimensions.', category: 'Edit PDF', color: 'bg-pink-600' },



  // Image Tools
  { id: 'compress-image', name: 'Compress Image', path: '/tools/compress-image', icon: ImageIcon, desc: 'Compress JPG, PNG, SVG or GIF with the best quality and compression.', category: 'Image Tools', color: 'bg-yellow-500' },
  { id: 'convert-image', name: 'Convert Image', path: '/tools/convert-image', icon: ImageIcon, desc: 'Convert pictures in bulk to JPG, PNG, SVG, WEBP, or GIF.', category: 'Image Tools', color: 'bg-yellow-600' },
  { id: 'crop-image', name: 'Crop Image', path: '/tools/crop-image', icon: Crop, desc: 'Crop images online to get the exact pixels you want.', category: 'Image Tools', color: 'bg-yellow-400' },
  { id: 'resize-image', name: 'Resize Image', path: '/tools/resize-image', icon: Maximize, desc: 'Resize JPG, PNG, SVG or GIF by defining new height and width pixels.', category: 'Image Tools', color: 'bg-orange-500' },
];

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Process your files instantly with our optimized engine.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Files are auto-deleted after processing. No registration required.' },
  { icon: Smartphone, title: 'Mobile Friendly', desc: 'Works seamlessly across all your devices, anywhere.' },
];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredTools = allTools.filter(tool => {
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="text-xl font-bold tracking-tight">Pdfyako</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#pdf-tools" className="hover:text-indigo-500 transition-colors">PDF Tools</a>
            <Link to="/tools/qr" className="hover:text-indigo-500 transition-colors">QR Tools</Link>
            <Link to="/tools/barcode" className="hover:text-indigo-500 transition-colors">Barcode</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                <a 
                  href="#pdf-tools" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-indigo-500 transition-colors block py-2"
                >
                  PDF Tools
                </a>
                <Link 
                  to="/tools/qr" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-indigo-500 transition-colors block py-2"
                >
                  QR Tools
                </Link>
                <Link 
                  to="/tools/barcode" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-indigo-500 transition-colors block py-2"
                >
                  Barcode
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 dark:from-indigo-900/20 dark:via-slate-900 dark:to-slate-900"></div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            The Ultimate <br className="hidden md:block" />
            <span className="text-gradient">Document Toolkit</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Process PDFs, generate QR codes, and create barcodes instantly. 
            Free, secure, and no registration required.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative group mb-12">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search for a tool..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="pdf-tools">
          
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <Link to={tool.path} key={tool.id} className="glass-card rounded-2xl p-6 group cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 ${tool.color}`}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-500 transition-colors flex items-center gap-2">
                    {tool.name.includes('New!') && (
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-red-500 text-white px-2 py-0.5 rounded-full">New</span>
                    )}
                    {tool.name.replace('New! ', '')}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-grow">{tool.desc}</p>
                  <div className="flex items-center text-sm font-medium text-indigo-500 mt-auto">
                    Try it now <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                No tools found matching your search.
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 mt-16 bg-slate-100 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold">Why choose Pdfyako?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold mb-2">Are my files secure?</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Yes. All uploads use HTTPS encryption and are automatically deleted from our servers immediately after processing.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold mb-2">Is it really free?</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Yes, Pdfyako is completely free to use with no hidden fees or registration walls.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} Pdfyako. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
