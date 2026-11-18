import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  Laptop, 
  FlaskConical, 
  Trophy, 
  BookOpen, 
  Layers, 
  DollarSign,
  ShieldCheck,
  Building,
  Trash2,
  X
} from 'lucide-react';
import { SchoolAssetItem } from '../types';
import { 
  getStoredAssets, 
  saveAsset, 
  deleteAsset, 
  getSchoolLogoUrl 
} from '../data/mockData';

export const SchoolAssetInventoryView: React.FC = () => {
  const [assets, setAssets] = useState<SchoolAssetItem[]>(getStoredAssets());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SchoolAssetItem['category']>('computers');
  const [quantity, setQuantity] = useState<number>(1);
  const [condition, setCondition] = useState<SchoolAssetItem['condition']>('good');
  const [locationRoom, setLocationRoom] = useState('');
  const [assignedCustodian, setAssignedCustodian] = useState('');
  const [estimatedValueEtb, setEstimatedValueEtb] = useState<number>(5000);

  const filteredAssets = assets.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.locationRoom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.serialOrTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // KPI Calculations
  const totalValuation = assets.reduce((acc, curr) => acc + (curr.estimatedValueEtb || 0), 0);
  const totalUnits = assets.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const goodUnits = assets.filter(a => a.condition === 'good').reduce((acc, curr) => acc + curr.quantity, 0);
  const needsAttentionUnits = assets.filter(a => a.condition === 'needs_repair' || a.condition === 'damaged').reduce((acc, curr) => acc + curr.quantity, 0);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newAsset: SchoolAssetItem = {
      id: `AST-${Date.now().toString().slice(-4)}`,
      name,
      category,
      categoryLabel: category === 'computers' ? 'Kompiitara & ICT Lab' :
                     category === 'science_lab' ? 'Meeshaalee Laabraatoorii Saayinsii' :
                     category === 'sports' ? "Mi'a Ispoortii" : 'Kitaabota & Mana Kitaabaa',
      quantity,
      condition,
      locationRoom: locationRoom || 'Burayu Main Campus Store',
      assignedCustodian: assignedCustodian || 'General Facility Manager',
      purchaseDate: new Date().toISOString().split('T')[0],
      estimatedValueEtb,
      serialOrTag: `CHA-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
    };

    saveAsset(newAsset);
    setAssets(getStoredAssets());
    setShowAddModal(false);
    setName('');
    setLocationRoom('');
    setAssignedCustodian('');
    setToast("Qabeenyi haaraan milkaa'inaan galmaa'eera (Asset registered)!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id: string) => {
    deleteAsset(id);
    setAssets(getStoredAssets());
    setToast("Qabeenyi haqameera (Asset removed)!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0f1e36] text-white px-4 py-2.5 rounded-xl shadow-xl border border-amber-400 flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#0f1e36]">
              Galmee Qabeenya Mana Barumsaa (School Asset & Inventory Registry)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
              Audited 2026/27
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Kompiitaroota, meeshaalee laabraatoorii saayinsii, mi'a ispoortii, fi kitaabota mana barumsaa to'achuu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-amber-600" />
            <span>Gabaasa Qabeenyaa Maxxansi</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Qabeenya Haaraa Galmeessi</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span>Tilmaama Gatii Qabeenyaa</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black font-mono text-[#0f1e36]">
            {totalValuation.toLocaleString()} ETB
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Burayu Campus Capital Assets</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span>Baay'ina Qabeenyaa (Total Units)</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black font-mono text-slate-900">
            {totalUnits} Units
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Hundeeffama Kutaa 1-8 fi KG</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span>Haala Gaarii Irra Kan Jiru</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black font-mono text-emerald-700">
            {goodUnits} Units ({Math.round((goodUnits / (totalUnits || 1)) * 100)}%)
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Qulqullina Olaanaa</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span>Suphaa Kan Barbaadu</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black font-mono text-amber-700">
            {needsAttentionUnits} Units
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Maintenance Scheduled</div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-3">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'Hunda (All)', icon: Package },
            { id: 'computers', label: 'Kompiitara & ICT', icon: Laptop },
            { id: 'science_lab', label: 'Laabraatoorii', icon: FlaskConical },
            { id: 'sports', label: 'Ispoortii', icon: Trophy },
            { id: 'library', label: 'Kitaabota', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#0f1e36] text-white shadow-xs' 
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Barbaadi (Maqaa, Kutaa, Serial)..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

      </div>

      {/* Assets Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Tag / ID</th>
                <th className="py-3 px-4">Maqaa Qabeenyaa (Item Name)</th>
                <th className="py-3 px-4">Ramaddii (Category)</th>
                <th className="py-3 px-4 text-center">Baay'ina</th>
                <th className="py-3 px-4">Haala (Condition)</th>
                <th className="py-3 px-4">Bakka (Location)</th>
                <th className="py-3 px-4 text-right">Gatii (ETB)</th>
                <th className="py-3 px-4 text-right">Tarkaanfii</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Qabeenyi barbaaddan hin argamne.
                  </td>
                </tr>
              ) : (
                filteredAssets.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {item.serialOrTag}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400">Custodian: {item.assignedCustodian}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {item.categoryLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        item.condition === 'good' ? 'bg-emerald-100 text-emerald-800' :
                        item.condition === 'fair' ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.locationRoom}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#0f1e36]">
                      {item.estimatedValueEtb.toLocaleString()} ETB
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Balleessi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD ASSET */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddAsset} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                Qabeenya Haaraa Galmeessi (Register New School Asset)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Maqaa Qabeenyaa (Item Name)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="fkn: Dell OptiPlex Desktop PC, Microscope, Football..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ramaddii (Category)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="computers">Kompiitara & ICT</option>
                    <option value="science_lab">Laabraatoorii Saayinsii</option>
                    <option value="sports">Mi'a Ispoortii</option>
                    <option value="library">Kitaabota & Mana Kitaabaa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Baay'ina (Quantity)</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Haala Qabeenyaa (Condition)</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="good">Gaarii (Good Condition)</option>
                    <option value="fair">Giddu-galeessa (Fair)</option>
                    <option value="needs_repair">Suphaa Barbaada (Needs Repair)</option>
                    <option value="damaged">Miidhameera (Damaged)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tilmaama Gatii (ETB)</label>
                  <input
                    type="number"
                    value={estimatedValueEtb}
                    onChange={(e) => setEstimatedValueEtb(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bakka Argamaa (Location / Room)</label>
                <input
                  type="text"
                  value={locationRoom}
                  onChange={(e) => setLocationRoom(e.target.value)}
                  placeholder="fkn: Burayu ICT Lab 1, Science Lab Room B..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Iti-Gaafatamaa (Assigned Custodian)</label>
                <input
                  type="text"
                  value={assignedCustodian}
                  onChange={(e) => setAssignedCustodian(e.target.value)}
                  placeholder="fkn: Teacher Chala, Coach Tasfaaye, Lab Tech..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Dhiisi
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Qabeenya Galmeessi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRINTABLE AUDIT STATEMENT MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img src={getSchoolLogoUrl()} alt="Logo" className="w-16 h-16 object-contain" />
                <div>
                  <h3 className="font-serif text-lg font-black text-slate-900">
                    CHILIMO ACADEMY - BURAYU CAMPUS
                  </h3>
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Official Fixed Assets & School Inventory Audit Registry
                  </div>
                  <div className="text-[11px] text-slate-400">
                    TIN: 0048291055 • Academic Year 2026/2027
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-xs">
                <span>Total Asset Count: <strong>{totalUnits} Units</strong></span>
                <span>Total Valuation: <strong>{totalValuation.toLocaleString()} ETB</strong></span>
                <span>Date: <strong>{new Date().toISOString().split('T')[0]}</strong></span>
              </div>

              <table className="w-full text-xs text-left border border-slate-200">
                <thead className="bg-slate-100 text-[10px] uppercase">
                  <tr>
                    <th className="p-2 border">Tag</th>
                    <th className="p-2 border">Item Name</th>
                    <th className="p-2 border text-center">Qty</th>
                    <th className="p-2 border">Condition</th>
                    <th className="p-2 border text-right">Value (ETB)</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(a => (
                    <tr key={a.id} className="border-b">
                      <td className="p-2 border font-mono font-bold">{a.serialOrTag}</td>
                      <td className="p-2 border font-medium">{a.name}</td>
                      <td className="p-2 border text-center font-bold">{a.quantity}</td>
                      <td className="p-2 border uppercase text-[10px]">{a.condition}</td>
                      <td className="p-2 border text-right font-mono font-bold">{a.estimatedValueEtb.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-6 border-t border-slate-200 flex justify-between text-xs text-slate-500">
                <div>
                  <p className="font-bold text-slate-900">Facility & Inventory In-Charge</p>
                  <p>Certified & Tagged Physical Audit</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">Director Geda Dadi</p>
                  <p>[OFFICIAL CHILIMO SEAL AFFIXED]</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Maxxansi (Print)
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cufi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
