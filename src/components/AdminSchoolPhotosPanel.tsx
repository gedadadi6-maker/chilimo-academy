import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  Star,
  Image as ImageIcon,
  Edit3,
  Save,
  X,
  Eye,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { Language, SchoolPhotoItem, SchoolPhotoPlacement, UserAccount } from '../types';
import {
  getStoredSchoolPhotos,
  saveAllSchoolPhotos,
  getSchoolLogoUrl,
  saveSchoolLogoUrl,
  compressImageToDataUrl
} from '../data/mockData';

interface AdminSchoolPhotosPanelProps {
  currentLang: Language;
  currentAdmin: UserAccount;
  onNotify: (msg: string) => void;
}

const PLACEMENT_OPTIONS: Array<{ value: SchoolPhotoPlacement; labelOm: string; labelEn: string }> = [
  { value: 'campus_gallery', labelOm: 'Galmee Suuraa Kaampaasii (Campus Gallery)', labelEn: 'Campus Photo Gallery' },
  { value: 'hero_banner', labelOm: 'Suuraa Fuula Duraa (Home Hero Banner)', labelEn: 'Homepage Hero Background' },
  { value: 'about_section', labelOm: 'Suuraa Waa\'ee Mana Barumsaa (About Section)', labelEn: 'About Us Highlight Photo' },
  { value: 'kg_activities', labelOm: 'Kiliilii Daa\'immanii (KG 1–3 Activities)', labelEn: 'Kindergarten (KG 1–3)' },
  { value: 'science_lab', labelOm: 'Laaboraatoorii Saayinsii & ICT', labelEn: 'Science & ICT Lab' },
  { value: 'sports_events', labelOm: 'Ispoortii & Ayyaana Mana Barumsaa', labelEn: 'Sports & School Events' },
  { value: 'bus_fleet', labelOm: 'Baskoolii / Geejjiba Barattootaa', labelEn: 'School Bus Fleet' }
];

function compressImageFile(file: File, maxDimension = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const output = canvas.toDataURL('image/jpeg', quality);
        resolve(output);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const AdminSchoolPhotosPanel: React.FC<AdminSchoolPhotosPanelProps> = ({
  currentLang,
  currentAdmin,
  onNotify
}) => {
  const [photos, setPhotos] = useState<SchoolPhotoItem[]>(() => getStoredSchoolPhotos());
  const [logoUrl, setLogoUrl] = useState<string>(getSchoolLogoUrl);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [placement, setPlacement] = useState<SchoolPhotoPlacement>('campus_gallery');
  const [featured, setFeatured] = useState(true);
  const [previewDataUrls, setPreviewDataUrls] = useState<Array<{ name: string; dataUrl: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [filterPlacement, setFilterPlacement] = useState<'all' | SchoolPhotoPlacement>('all');
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<SchoolPhotoItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const validFiles = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      onNotify(currentLang === 'om' ? 'Maaloo faayilii suuraa qofa filadhaa (JPG, PNG, WebP).' : 'Please select valid image files only.');
      return;
    }

    setIsProcessing(true);
    try {
      const processed: Array<{ name: string; dataUrl: string }> = [];
      for (const file of validFiles.slice(0, 8)) {
        const compressed = await compressImageFile(file);
        processed.push({
          name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
          dataUrl: compressed
        });
      }
      setPreviewDataUrls(processed);
      if (!title.trim() && processed.length === 1) {
        setTitle(processed[0].name);
      }
    } catch {
      onNotify('Suuraa dubbisuun hin danda\'amne. Maaloo irra deebi\'aa yaalaa.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSavePhotos = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPhotoId) {
      const updated = photos.map(p =>
        p.id === editingPhotoId
          ? {
              ...p,
              title: title.trim() || p.title,
              caption: caption.trim(),
              placement,
              featured,
              imageDataUrl: previewDataUrls[0]?.dataUrl || p.imageDataUrl
            }
          : placement === 'hero_banner' && featured && p.placement === 'hero_banner'
          ? { ...p, featured: false }
          : p
      );
      setPhotos(updated);
      saveAllSchoolPhotos(updated);
      resetForm();
      onNotify('Suuraan mana barumsaa haalaan fooyya\'eera!');
      return;
    }

    if (previewDataUrls.length === 0) {
      onNotify('Maaloo jalqaba suuraa tokko ykn isaa ol filadhaa (Upload image first).');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    let baseList = photos;
    if (placement === 'hero_banner' && featured) {
      baseList = baseList.map(p => (p.placement === 'hero_banner' ? { ...p, featured: false } : p));
    }

    const newItems: SchoolPhotoItem[] = previewDataUrls.map((item, idx) => ({
      id: `PHO-${Date.now().toString().slice(-4)}-${idx + 1}`,
      title:
        previewDataUrls.length === 1
          ? title.trim() || item.name || 'Chilimo Academy Photo'
          : title.trim()
          ? `${title.trim()} (${idx + 1})`
          : item.name || `Chilimo Academy Photo ${idx + 1}`,
      caption: caption.trim() || 'Chilimo Academy Campus, Burayu — Oromia',
      placement,
      imageDataUrl: item.dataUrl,
      uploadedBy: currentAdmin.name,
      uploadedAt: today,
      featured: placement === 'hero_banner' ? idx === 0 && featured : featured
    }));

    const updated = [...newItems, ...baseList];
    setPhotos(updated);
    saveAllSchoolPhotos(updated);
    resetForm();
    onNotify(`Suuraan mana barumsaa (${newItems.length}) milkaa'inaan olkaa'ameera!`);
  };

  const resetForm = () => {
    setEditingPhotoId(null);
    setTitle('');
    setCaption('');
    setPlacement('campus_gallery');
    setFeatured(true);
    setPreviewDataUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditClick = (photo: SchoolPhotoItem) => {
    setEditingPhotoId(photo.id);
    setTitle(photo.title);
    setCaption(photo.caption);
    setPlacement(photo.placement);
    setFeatured(photo.featured);
    setPreviewDataUrls([]);
  };

  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    saveAllSchoolPhotos(updated);
    if (editingPhotoId === id) resetForm();
    onNotify('Suuraan mana barumsaa haqameera.');
  };

  const handleToggleFeatured = (photo: SchoolPhotoItem) => {
    const updated = photos.map(p => {
      if (p.id === photo.id) {
        return { ...p, featured: !p.featured };
      }
      if (photo.placement === 'hero_banner' && !photo.featured && p.placement === 'hero_banner') {
        return { ...p, featured: false };
      }
      return p;
    });
    setPhotos(updated);
    saveAllSchoolPhotos(updated);
    onNotify('Haalli mul\'ina suuraa jijjiirameera!');
  };

  const filteredPhotos =
    filterPlacement === 'all' ? photos : photos.filter(p => p.placement === filterPlacement);

  const getPlacementLabel = (val: SchoolPhotoPlacement) => {
    const found = PLACEMENT_OPTIONS.find(o => o.value === val);
    return currentLang === 'om' ? found?.labelOm || val : found?.labelEn || val;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageToDataUrl(file, 512, 0.9);
      saveSchoolLogoUrl(compressed);
      setLogoUrl(compressed);
      onNotify('Asxaan (School Logo) haaraan olkaa\'ameera!');
    } catch {
      onNotify('Suuraa asxaa dubbisuun hin danda\'amne.');
    }
  };

  const handleResetLogo = () => {
    saveSchoolLogoUrl(null);
    setLogoUrl(getSchoolLogoUrl());
    onNotify('Asxaan gara isa duraatti deebi\'eera.');
  };

  return (
    <div className="space-y-6">
      {/* Official School Logo / Crest Uploader */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={logoUrl}
            alt="School Crest"
            className="w-16 h-16 object-contain bg-slate-50 p-1.5 rounded-xl border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Asxaa (Official School Logo / Crest)</span>
            </div>
            <h4 className="font-serif text-base font-bold text-[#0f1e36]">
              Logo Mana Barumsaa Upload / Jijjiiri
            </h4>
            <p className="text-[11px] text-slate-500">
              Website, Nagahee QR, Waraqaa Ragaa fi Letterhead irratti kallattiin ni jijjiirama.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="px-4 py-2 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Logo Haaraa Upload</span>
          </button>
          <button
            type="button"
            onClick={handleResetLogo}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Upload & Metadata Form */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
              {editingPhotoId ? 'Suuraa Fooyyessi (Edit Photo)' : 'Suuraa Mana Barumsaa Upload Godhi'}
            </h3>
          </div>
          {editingPhotoId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Suuraa gamoo mana barumsaa, daree barnootaa, KG, laaboraatoorii ykn ayyaanaa upload gochuun website irratti baasaa.
        </p>

        <form onSubmit={handleSavePhotos} className="space-y-4">
          {/* Drag & Drop / File Picker */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFilesSelected(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-300 bg-slate-50 hover:border-[#0f1e36] hover:bg-slate-100/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={!editingPhotoId}
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />
            <Upload className="w-7 h-7 text-amber-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">
              {isProcessing
                ? 'Suuraa qopheessaa jira...'
                : editingPhotoId
                ? 'Suuraa haaromsuuf as cuqaasaa (Optional)'
                : 'Suuraa filachuuf as cuqaasaa ykn harkisaa kaa\'aa'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              JPG, PNG, WebP • Suuraa tokko ykn baay&apos;ee yeroo tokkotti upload gochuu dandeessu
            </div>
          </div>

          {/* Preview Strip */}
          {previewDataUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {previewDataUrls.map((item, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                  <img src={item.dataUrl} alt={item.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewDataUrls(prev => prev.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-1 right-1 bg-slate-900/80 text-white rounded p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bakka Mul&apos;atu (Section / Category) *
            </label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as SchoolPhotoPlacement)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
            >
              {PLACEMENT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {currentLang === 'om' ? opt.labelOm : opt.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mata-Duree Suuraa (Photo Title)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Fkn: Gamoo Mana Barumsaa Haaraa ykn Kutaa KG 2"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ibsa Gabaabaa (Caption / Description)
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Ibsa waa'ee suuraa kanaa..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-amber-600"
            />
            <span>Fuula duraa / website irratti ifatti agarsiisi (Show publicly)</span>
          </label>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>
              {editingPhotoId
                ? 'Jijjiirama Olkaa\'i (Save Changes)'
                : 'Suuraa Upload & Olkaa\'i (Upload School Photo)'}
            </span>
          </button>
        </form>
      </div>

      {/* Right: Uploaded School Photos Grid */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#0f1e36]" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Suuraawwan Mana Barumsaa Galmaa&apos;an ({filteredPhotos.length})
            </h4>
          </div>

          <select
            value={filterPlacement}
            onChange={(e) => setFilterPlacement(e.target.value as 'all' | SchoolPhotoPlacement)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
          >
            <option value="all">Hunda (All Sections)</option>
            {PLACEMENT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {currentLang === 'om' ? opt.labelOm : opt.labelEn}
              </option>
            ))}
          </select>
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-xs text-slate-500">
            Kutaa kana jalatti suuraan upload ta&apos;e hin jiru.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPhotos.map(photo => (
              <div
                key={photo.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col"
              >
                <div className="relative aspect-video bg-slate-100 group">
                  <img
                    src={photo.imageDataUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#0f1e36]/85 text-amber-300 text-[10px] font-bold">
                      {getPlacementLabel(photo.placement)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxPhoto(photo)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900 cursor-pointer"
                    title="View Full Image"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{photo.title}</h5>
                      {photo.featured && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{photo.caption}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 text-[10px]">
                    <span className="text-slate-400 font-mono">{photo.uploadedAt}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(photo)}
                        className={`px-2 py-1 rounded font-bold flex items-center gap-1 cursor-pointer ${
                          photo.featured
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Star className="w-3 h-3" />
                        <span>{photo.featured ? 'Public' : 'Hidden'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditClick(photo)}
                        className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded cursor-pointer"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3 bg-[#0f1e36] text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">{lightboxPhoto.title}</h4>
                <span className="text-[11px] text-amber-300">{getPlacementLabel(lightboxPhoto.placement)}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={lightboxPhoto.imageDataUrl}
                alt={lightboxPhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 text-xs text-slate-700 flex items-center justify-between">
              <span>{lightboxPhoto.caption}</span>
              <span className="text-slate-400 font-mono shrink-0 ml-4">{lightboxPhoto.uploadedAt}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
