import React, { useState } from 'react';
import { X, Plus, Package, Camera, ShieldCheck, Sparkles } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (payload: {
    name: string;
    category: string;
    price: number;
    stock: number;
    condition?: string;
    image?: string;
    description?: string;
  }) => void;
  language?: string;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  language,
}) => {
  const isSwahili = language === 'Swahili';
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [condition, setCondition] = useState('Brand New');
  const [price, setPrice] = useState('100000');
  const [stock, setStock] = useState('20');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    onAddProduct({
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock) || 1,
      condition,
      image: image.trim() || undefined,
      description: description.trim() || undefined,
    });
    setName('');
    setImage('');
    setDescription('');
    setCondition('Brand New');
    setPrice('100000');
    setStock('20');
    onClose();
  };

  const conditionOptions = isSwahili
    ? [
        { value: 'Brand New', label: 'Mpya Kabisa', hint: 'Kifurushi asili hakijafunguliwa' },
        { value: 'Like New', label: 'Kama Mpya', hint: 'Hali nzuri kabisa, haijatumiwa karibu kabisa' },
        { value: 'Refurbished', label: 'Iliyoboreshwa', hint: 'Imekaguliwa na kuthibitishwa kitaalamu' },
        { value: 'Used - Good', label: 'Iliyotumika - Nzuri', hint: 'Inafanya kazi vizuri na alama ndogo za kawaida' },
        { value: 'Collector Edition', label: 'Toleo Maalum', hint: 'Kipengee cha nadra au toleo maalum' },
      ]
    : [
        { value: 'Brand New', label: 'Brand New', hint: 'Unopened original packaging, never used' },
        { value: 'Like New', label: 'Like New', hint: 'Flawless condition, virtually untouched' },
        { value: 'Refurbished', label: 'Refurbished', hint: 'Professionally tested and certified' },
        { value: 'Used - Good', label: 'Used - Good', hint: 'Fully functional, normal minor signs of use' },
        { value: 'Collector Edition', label: 'Collector Edition', hint: 'Rare or special edition item' },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#0e1d15] w-full max-w-lg rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Ongeza Bidhaa kwenye Soko la Dunia' : 'Add Product to Global Shopping'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isSwahili
                  ? 'Weka maelezo ya bidhaa, kiasi cha akiba, na hali ya ubora'
                  : 'Set item details, inventory quantity, and quality condition'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/80 mb-1">
                {isSwahili ? 'Jina la Bidhaa *' : 'Product Name *'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isSwahili ? 'Mf. Smart Watch Pro' : 'E.g. Smart Watch Pro'}
                required
                className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/80 mb-1">
                {isSwahili ? 'Kitengo' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl"
              >
                <option value="Electronics">{isSwahili ? 'Vifaa vya Umeme' : 'Electronics'}</option>
                <option value="Fashion">{isSwahili ? 'Mitindo' : 'Fashion'}</option>
                <option value="Home">{isSwahili ? 'Nyumbani' : 'Home'}</option>
                <option value="Books">{isSwahili ? 'Vitabu' : 'Books'}</option>
                <option value="Beauty">{isSwahili ? 'Urembo' : 'Beauty'}</option>
                <option value="Sports">{isSwahili ? 'Michezo' : 'Sports'}</option>
                <option value="Digital">{isSwahili ? 'Kidijitali' : 'Digital'}</option>
              </select>
            </div>
          </div>

          {/* Condition / Quality Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/80">
                {isSwahili ? 'Hali / Ubora wa Bidhaa *' : 'Item Condition / Quality *'}
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {isSwahili ? 'Iliyochaguliwa' : 'Selected'}: {condition}
              </span>
            </div>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl font-medium"
            >
              {conditionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — {opt.hint}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              {isSwahili
                ? 'Wanunuzi wataona beji hii ya uthibitisho wa ubora kwenye kadi ya bidhaa yako.'
                : 'Buyers will see this quality verification badge on your product card.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/80 mb-1">
                {isSwahili ? 'Bei (TZS) *' : 'Price (TZS) *'}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100000"
                required
                min={1}
                className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/80 mb-1">
                {isSwahili ? 'Idadi ya Akiba (Vipande) *' : 'Stock Quantity (Units) *'}
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="20"
                min={1}
                required
                className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl font-semibold"
              />
            </div>
          </div>

          {/* Product Image - URL or Local Upload */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/80 mb-1">
              {isSwahili ? 'Picha ya Bidhaa' : 'Product Image'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder={isSwahili ? 'Weka kiungo cha picha au pakia...' : 'Enter image URL or upload file...'}
                className="flex-1 h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl"
              />
              <label className="px-3 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-emerald-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                <Camera className="w-4 h-4" />
                <span>{isSwahili ? 'Pakia' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </label>
            </div>
            {Boolean(image) && (
              <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-slate-100/60 dark:bg-emerald-950/40 border border-emerald-950/10 dark:border-emerald-500/20">
                <img
                  src={image || undefined}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-lg border border-emerald-900/10"
                />
                <span className="text-[11px] text-slate-500 dark:text-emerald-300">
                  {isSwahili ? 'Picha imewekwa' : 'Image preview attached'}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/80 mb-1">
              {isSwahili ? 'Maelezo na Sifa za Bidhaa' : 'Description & Specifications'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={
                isSwahili
                  ? 'Eleza hali ya bidhaa, waranti, yaliyomo kwenye boksi au sifa za kiufundi...'
                  : 'Describe condition details, warranty, box contents, or technical specs...'
              }
              className="w-full p-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {isSwahili
              ? `Chapisha Bidhaa (${condition} · ${stock} Zinapatikana)`
              : `Publish Product (${condition} · ${stock} Available)`}
          </button>
        </form>
      </div>
    </div>
  );
};
