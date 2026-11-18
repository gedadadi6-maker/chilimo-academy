import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Printer, 
  QrCode, 
  Barcode, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Phone, 
  Bus, 
  AlertCircle, 
  Camera, 
  RefreshCw, 
  Download, 
  Sparkles, 
  FileText, 
  Clock, 
  Search,
  Check,
  CreditCard,
  Upload,
  VideoOff
} from 'lucide-react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { SmartDigitalIdCard, GateScanLog } from '../types';
import { 
  getStoredIdCards, 
  getStoredGateScanLogs, 
  recordGateScan, 
  appendSecurityAuditLog,
  CHILIMO_INFO,
  getStoredBills
} from '../data/mockData';

interface SmartDigitalIdCardModalProps {
  onClose: () => void;
  defaultHolderId?: string;
  allowGateScanner?: boolean;
}

export const SmartDigitalIdCardModal: React.FC<SmartDigitalIdCardModalProps> = ({
  onClose,
  defaultHolderId = "151",
  allowGateScanner = true
}) => {
  const [cards, setCards] = useState<SmartDigitalIdCard[]>(getStoredIdCards());
  const [selectedHolderId, setSelectedHolderId] = useState<string>(defaultHolderId);
  const [activeTab, setActiveTab] = useState<'card_view' | 'gate_scanner' | 'scan_logs'>('card_view');
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Scanner Terminal State
  const [scanInput, setScanInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<{
    card: SmartDigitalIdCard;
    clearedPayment: boolean;
    timestamp: string;
    gateMessage: string;
  } | null>(null);
  const [gateLogs, setGateLogs] = useState<GateScanLog[]>(getStoredGateScanLogs());
  const [selectedGate, setSelectedGate] = useState<string>("Main Campus Gate A (Burayu)");
  const [toast, setToast] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastDecodedRef = useRef<{ value: string; time: number }>({ value: '', time: 0 });

  const currentCard = cards.find(c => c.holderId === selectedHolderId) || cards[0];

  const stopLiveCamera = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopLiveCamera();
  }, []);

  useEffect(() => {
    if (activeTab !== 'gate_scanner') {
      stopLiveCamera();
    }
  }, [activeTab]);

  // Generate QR code data URL whenever currentCard changes
  useEffect(() => {
    if (currentCard) {
      QRCode.toDataURL(currentCard.qrPayload, {
        width: 256,
        margin: 1,
        color: {
          dark: '#0f1e36',
          light: '#ffffff'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error("QR Code Generation Error:", err));
    }
  }, [currentCard]);

  // Handle Scanning an ID (supports direct ID, barcode, name, or decoded QR payload)
  const handleScanId = (idOrBarcode: string) => {
    setIsScanning(true);
    setTimeout(() => {
      const trimmed = idOrBarcode.trim();
      const matched = cards.find(c => 
        c.holderId.toLowerCase() === trimmed.toLowerCase() || 
        c.barcodeNumber.toLowerCase() === trimmed.toLowerCase() ||
        c.qrPayload.toLowerCase() === trimmed.toLowerCase() ||
        trimmed.toLowerCase().includes(c.holderId.toLowerCase()) ||
        c.fullName.toLowerCase().includes(trimmed.toLowerCase())
      );

      if (matched) {
        const bills = getStoredBills().filter(b => b.studentId === matched.holderId);
        const hasUnpaid = bills.some(b => b.status === 'unpaid');
        const clearanceStatus = hasUnpaid ? 'fee_due' : 'cleared';

        recordGateScan({
          cardHolderId: matched.holderId,
          cardHolderName: matched.fullName,
          role: matched.role,
          gradeOrDept: matched.gradeOrDept,
          scanType: 'gate_entry',
          gateLocation: selectedGate,
          status: 'granted',
          notes: hasUnpaid ? 'Seensa Eeyyamame - Kaffaltiin Eeggachaa Jira' : 'Seensa Eeyyamame - Qulqulluu (Verified)',
          paymentClearance: clearanceStatus
        });

        appendSecurityAuditLog({
          actorId: matched.holderId,
          actorName: matched.fullName,
          actorRole: matched.role,
          category: 'gate_security',
          action: 'QR_GATE_CHECKIN',
          details: `${selectedGate} · Clearance: ${clearanceStatus}`
        });

        setScannedResult({
          card: matched,
          clearedPayment: !hasUnpaid,
          timestamp: new Date().toLocaleTimeString(),
          gateMessage: `Eeyyama Seensaa Mirkanaa'e: ${matched.fullName} (${matched.role})`
        });

        setGateLogs(getStoredGateScanLogs());
        setToast(`QR Iskaan Ta'e: ${matched.fullName} - Seensa Eeyyamame!`);
      } else {
        setScannedResult(null);
        setToast(`Waraqaan Eenyummaa hin argamne: "${idOrBarcode}". Irra deebi'aa yaalaa.`);
      }
      setIsScanning(false);
      setTimeout(() => setToast(null), 4000);
    }, 250);
  };

  const startLiveCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Browser does not support camera access here. Use manual ID input or QR image upload below.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      streamRef.current = stream;
      setCameraActive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });

      const scanFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const decoded = jsQR(imgData.data, imgData.width, imgData.height, {
              inversionAttempts: 'dontInvert'
            });
            if (decoded?.data) {
              const now = Date.now();
              if (
                decoded.data !== lastDecodedRef.current.value ||
                now - lastDecodedRef.current.time > 3000
              ) {
                lastDecodedRef.current = { value: decoded.data, time: now };
                setScanInput(decoded.data);
                handleScanId(decoded.data);
              }
            }
          }
        }
        if (streamRef.current) {
          rafRef.current = requestAnimationFrame(scanFrame);
        }
      };
      rafRef.current = requestAnimationFrame(scanFrame);
    } catch (err: any) {
      setCameraError(err?.message || 'Camera permission denied or unavailable on this device.');
      stopLiveCamera();
    }
  };

  const handleDecodeQrImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCameraError('');
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(data.data, data.width, data.height);
        if (code?.data) {
          setScanInput(code.data);
          handleScanId(code.data);
        } else {
          setCameraError('No readable QR code found inside the selected image.');
        }
      };
      if (typeof reader.result === 'string') img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const filteredCards = cards.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.holderId.includes(searchTerm) ||
    c.gradeOrDept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 max-h-[94vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-[#0f1e36] text-white px-4 py-3 rounded-2xl shadow-xl border border-amber-400 flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-2xl shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0f1e36]">
                  Kaardii Eenyummaa Smart Digital (QR & Barcode ID Card)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  PVC Print Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Chilimo Academy Smart Student & Faculty Digital ID Card • Burayu Campus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Kaardii Maxxansi (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-4 border-b border-slate-100 pb-3">
          {[
            { id: 'card_view', label: "Kaardii Eenyummaa (Digital ID Card)", icon: CreditCard },
            { id: 'gate_scanner', label: "Iskanera Balbala Seensaa (Gate QR Scanner)", icon: Camera },
            { id: 'scan_logs', label: `Galmee Seensaa Guyyaa (${gateLogs.length})`, icon: Clock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#0f1e36] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ID CARD DISPLAY (FRONT & BACK) */}
        {activeTab === 'card_view' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
            
            {/* Left Column: ID Card Selection Roster */}
            <div className="lg:col-span-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Barataa ykn Barsiisaa barbaadaa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredCards.map(c => {
                  const isSelected = c.holderId === currentCard.holderId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedHolderId(c.holderId)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#0f1e36] text-white border-[#0f1e36] shadow-md'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={c.photoUrl} 
                          alt={c.fullName} 
                          className="w-10 h-10 rounded-xl object-cover border border-amber-400"
                        />
                        <div>
                          <h4 className="font-bold text-xs">{c.fullName}</h4>
                          <span className={`text-[10px] block ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                            ID: {c.holderId} • {c.gradeOrDept}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {c.cardType}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action: Quick Test Scan this Card */}
              <button
                onClick={() => {
                  setActiveTab('gate_scanner');
                  handleScanId(currentCard.holderId);
                }}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition"
              >
                <Camera className="w-4 h-4" />
                <span>Kaardii Kanaan Balbalarra Iskaan Godhi</span>
              </button>
            </div>

            {/* Right Column: High-Fidelity PVC Card Mockup (Front & Back) */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-50 p-6 rounded-3xl border border-slate-200">
              
              {/* Card Toggle Control */}
              <div className="flex items-center gap-2 mb-4 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                <button
                  onClick={() => setCardSide('front')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    cardSide === 'front'
                      ? 'bg-[#0f1e36] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fuuldura Kaardii (Front)
                </button>
                <button
                  onClick={() => setCardSide('back')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    cardSide === 'back'
                      ? 'bg-[#0f1e36] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Duuba Kaardii (Back & QR)
                </button>
              </div>

              {/* PVC PHYSICAL CARD CONTAINER (STANDARD 85.6mm x 53.98mm ID PROPORTIONS) */}
              <div className="w-[360px] sm:w-[420px] h-[260px] sm:h-[270px] rounded-2xl shadow-2xl overflow-hidden relative border-2 border-amber-400 transition-all transform hover:scale-[1.01] duration-300">
                
                {/* ================= FRONT SIDE ================= */}
                {cardSide === 'front' ? (
                  <div className="w-full h-full bg-gradient-to-br from-[#0f1e36] via-[#14284b] to-[#0a1526] text-white p-4 flex flex-col justify-between relative">
                    
                    {/* Watermark Crest Emblem in Background */}
                    <img 
                      src="/assets/aistudio/Chilimo_Academy_Crest_Emblem__1__1e3fdd6e.png" 
                      alt="Watermark" 
                      className="absolute right-3 bottom-3 w-40 h-40 opacity-10 pointer-events-none object-contain"
                    />

                    {/* Top Header of Card */}
                    <div className="flex items-center justify-between pb-2 border-b border-amber-500/40 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src="/assets/aistudio/Chilimo_Academy_Crest_Emblem__1__1e3fdd6e.png" 
                          alt="Chilimo Logo" 
                          className="w-9 h-9 object-contain"
                        />
                        <div>
                          <h3 className="font-serif font-black text-xs sm:text-sm tracking-wide text-amber-300 uppercase leading-none">
                            {CHILIMO_INFO.name}
                          </h3>
                          <span className="text-[8px] sm:text-[9px] text-slate-300 font-sans tracking-widest block uppercase">
                            Burayu • Oromia • Ethiopia
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[8px] text-amber-400 font-bold block uppercase tracking-wider">
                          Official ID Card
                        </span>
                        <span className="text-[10px] font-mono font-bold text-white">
                          {currentCard.academicYear.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Photo & Credentials */}
                    <div className="flex items-center gap-4 py-2 relative z-10">
                      <div className="relative shrink-0">
                        <img 
                          src={currentCard.photoUrl} 
                          alt={currentCard.fullName} 
                          className="w-20 h-24 sm:w-22 sm:h-26 rounded-xl object-cover border-2 border-amber-400 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-amber-400 font-semibold block">
                            Maqaa Guutuu / Full Name
                          </span>
                          <h4 className="font-black text-sm sm:text-base text-white leading-tight">
                            {currentCard.fullName}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-x-2 text-[10px]">
                          <div>
                            <span className="text-slate-400 text-[8px] block">ID Number:</span>
                            <strong className="font-mono text-amber-300 font-bold">{currentCard.holderId}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[8px] block">Role / Gahee:</span>
                            <strong className="text-white font-bold">{currentCard.role.split(' ')[0]}</strong>
                          </div>
                          <div className="col-span-2 mt-0.5">
                            <span className="text-slate-400 text-[8px] block">Kutaa / Department:</span>
                            <strong className="text-white font-bold">{currentCard.gradeOrDept}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Bar: Barcode, Holographic Strip & Expiry */}
                    <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between text-[9px] relative z-10">
                      <div className="flex items-center gap-2">
                        {/* Simulated Barcode */}
                        <div className="bg-white p-1 rounded font-mono text-[9px] tracking-widest text-slate-900 font-black flex items-center gap-1">
                          <Barcode className="w-5 h-4" />
                          <span>{currentCard.barcodeNumber}</span>
                        </div>
                      </div>

                      <div className="text-right text-[8px] text-slate-300 font-mono">
                        <div>Dhumu: <span className="text-amber-300 font-bold">{currentCard.expiryDate}</span></div>
                        <div className="text-emerald-400 font-bold">STATUS: VALID</div>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* ================= BACK SIDE ================= */
                  <div className="w-full h-full bg-white text-slate-900 p-4 flex flex-col justify-between relative">
                    
                    {/* Top Security Banner */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#0f1e36]">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>CHILIMO ACADEMY SECURITY VALIDATION</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">{currentCard.nationalOrRegionalId}</span>
                    </div>

                    {/* Middle: QR Code & Detailed Health/Bus Info */}
                    <div className="grid grid-cols-12 gap-3 items-center py-1">
                      
                      {/* Left: QR Code */}
                      <div className="col-span-4 flex flex-col items-center">
                        {qrDataUrl ? (
                          <img 
                            src={qrDataUrl} 
                            alt="Student QR Code" 
                            className="w-24 h-24 border border-slate-200 rounded-lg p-0.5 shadow-xs"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-slate-100 flex items-center justify-center rounded-lg text-slate-400">
                            Loading...
                          </div>
                        )}
                        <span className="text-[8px] font-mono text-slate-500 mt-1">Scan for Gate SIS</span>
                      </div>

                      {/* Right: Key Details */}
                      <div className="col-span-8 space-y-1 text-[10px]">
                        <div className="flex justify-between border-b border-slate-100 pb-0.5">
                          <span className="text-slate-500">Dhiiga / Blood Group:</span>
                          <strong className="text-rose-700 font-black">{currentCard.bloodType}</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-0.5">
                          <span className="text-slate-500">Bilbila Hatattamaa:</span>
                          <strong className="text-slate-800 font-mono font-bold">{currentCard.emergencyPhone}</strong>
                        </div>
                        {currentCard.parentGuardianName && (
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-500">Maatii / Guardian:</span>
                            <strong className="text-slate-800 font-bold">{currentCard.parentGuardianName}</strong>
                          </div>
                        )}
                        {currentCard.busRouteTitle && (
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-500">Konkolaataa / Bus:</span>
                            <strong className="text-amber-800 font-bold">{currentCard.busRouteTitle.split('(')[0]}</strong>
                          </div>
                        )}
                        <div className="text-[8px] text-slate-400 leading-tight pt-1">
                          Kaardiin kun kan Chilimo Academy Burayu ti. Yoo argitan bilbila 0912305111 irratti bilbilaa.
                        </div>
                      </div>
                    </div>

                    {/* Bottom Authorization Stamp */}
                    <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center text-[9px]">
                      <div className="flex items-center gap-1 text-slate-500">
                        <span>Authorized Signatory:</span>
                        <strong className="text-slate-800 font-serif">Director Geda Dadi</strong>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[8px]">
                        VERIFIED & ACTIVE
                      </span>
                    </div>

                  </div>
                )}

              </div>

              {/* Card Meta & Print Guidance */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  💳 Format: <strong>CR80 PVC Standard (85.6 × 53.98 mm)</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  🔍 Barcode: <strong>{currentCard.barcodeNumber}</strong>
                </span>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: GATE SECURITY SCANNER TERMINAL */}
        {activeTab === 'gate_scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
            
            {/* Left: Scanner Terminal Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm text-white">
                      Iskanera Kaameraa QR Balbalaa (Live Camera QR Scanner)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {!cameraActive ? (
                      <button
                        type="button"
                        onClick={startLiveCamera}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Kaameraa Bani</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopLiveCamera}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <VideoOff className="w-3.5 h-3.5" />
                        <span>Kaameraa Cufi</span>
                      </button>
                    )}
                    <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>QR Photo</span>
                      <input type="file" accept="image/*" onChange={handleDecodeQrImageFile} className="hidden" />
                    </label>
                  </div>
                </div>

                {cameraError && (
                  <div className="mt-3 p-2.5 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-200 text-[11px]">
                    {cameraError}
                  </div>
                )}

                {/* Live Camera Feed / Viewfinder */}
                <div className="my-4 relative bg-black rounded-xl h-56 border-2 border-dashed border-amber-500/50 flex flex-col items-center justify-center overflow-hidden">
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  {!cameraActive && (
                    <>
                      <div className="w-32 h-32 border-2 border-amber-400 rounded-lg relative flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400"></div>
                        <QrCode className="w-16 h-16 text-amber-400/40" />
                      </div>
                      <span className="text-[11px] text-amber-300 font-mono mt-3">
                        {isScanning
                          ? 'Qorachaa jira (Scanning & Verifying...)'
                          : 'Kaameraa Bani tuqaa QR kaardii dubbisuuf ykn ID galchaa'}
                      </span>
                    </>
                  )}
                  {cameraActive && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-40 h-40 border-2 border-amber-400 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                    </div>
                  )}
                </div>

                {/* Gate Location Selector */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Bakka Balbala Seensaa (Terminal Gate Location)
                    </label>
                    <select
                      value={selectedGate}
                      onChange={(e) => setSelectedGate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    >
                      <option value="Main Campus Gate A (Burayu)">Main Campus Gate A (Burayu)</option>
                      <option value="Staff & Faculty Access Gate">Staff & Faculty Access Gate</option>
                      <option value="Bus Stop 01 - Gefersa Boarding">Bus Stop 01 - Gefersa Boarding</option>
                      <option value="Bus Stop 02 - Burayu Keta">Bus Stop 02 - Burayu Keta</option>
                      <option value="School Library Check-in">School Library Check-in</option>
                    </select>
                  </div>

                  {/* Manual ID / Barcode Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Lakk. ID ykn Barcode Galchaa (Manual Input)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        placeholder="Fkn: 151 ykn CHA-2026-STU-151"
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleScanId(scanInput || "151")}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition"
                      >
                        Iskaan
                      </button>
                    </div>
                  </div>

                  {/* Quick One-Click Presets */}
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">
                      Quick Simulator Buttons (Tokko Tuquun Iskaan Godhaa):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cards.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleScanId(c.holderId)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[10px] font-mono border border-slate-700 transition"
                        >
                          {c.fullName.split(' ')[0]} ({c.holderId})
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right: Live Gate Verification Screen Result */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              {scannedResult ? (
                <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-emerald-900">
                          SEENSA EEYYAMAMEERA (ACCESS GRANTED)
                        </h4>
                        <span className="text-xs text-slate-500 font-mono">
                          {scannedResult.timestamp} • {selectedGate}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-600 text-white font-black text-xs rounded-lg uppercase">
                      ✓ VALID
                    </span>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <img 
                      src={scannedResult.card.photoUrl} 
                      alt={scannedResult.card.fullName} 
                      className="w-20 h-24 rounded-xl object-cover border-2 border-emerald-500 shadow-md"
                    />
                    <div className="space-y-1">
                      <h3 className="font-black text-lg text-slate-900 leading-tight">
                        {scannedResult.card.fullName}
                      </h3>
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <div>ID: <strong className="font-mono text-slate-900">{scannedResult.card.holderId}</strong></div>
                        <div>Gahee: <strong className="text-slate-900">{scannedResult.card.role}</strong></div>
                        <div>Kutaa: <strong className="text-slate-900">{scannedResult.card.gradeOrDept}</strong></div>
                        <div>Bilbila Maatii: <strong className="font-mono text-slate-900">{scannedResult.card.emergencyPhone}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Badges for Tuition & Bus */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div className={`p-2.5 rounded-xl border ${
                      scannedResult.clearedPayment 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                      <span className="text-[10px] font-bold block uppercase">Haala Kaffaltii (Tuition Clearance)</span>
                      <strong className="text-xs font-black">
                        {scannedResult.clearedPayment ? '✓ Kaffalamee Xumurame' : '⚠️ Kaffaltiin Eeggachaa Jira'}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl border bg-sky-50 border-sky-200 text-sky-800">
                      <span className="text-[10px] font-bold block uppercase">Konkolaataa (Bus Service)</span>
                      <strong className="text-xs font-black">
                        {scannedResult.card.busRouteTitle ? scannedResult.card.busRouteTitle.split('(')[0] : 'Bus Not Assigned'}
                      </strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-600 font-mono">
                    System Gate Event: Access log recorded into Chilimo Academy SIS database automatically.
                  </div>

                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center h-full">
                  <QrCode className="w-16 h-16 text-slate-300 mb-3" />
                  <h4 className="font-bold text-sm text-slate-700">Ragaan Iskaanii Asitti Mul'ata</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Bitaarraa kaardii kamiyyuu filachuun ykn lakk. ID galchuun "Iskaan" tuqaa.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: GATE SCAN LOGS HISTORY */}
        {activeTab === 'scan_logs' && (
          <div className="pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0f1e36]">
                  Galmee Seensaa fi Bahiinsa Balbalaa (Gate Access Logbook)
                </h3>
                <p className="text-xs text-slate-500">
                  Guyyaa har'aa fi dhiheenya barattootaa fi barsiisota balbala qaxxaamuran
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 text-slate-800 rounded-lg">
                Total Logs: {gateLogs.length}
              </span>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-xs max-h-[460px] overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Sa'aatii</th>
                    <th className="py-3 px-4">ID & Maqaa</th>
                    <th className="py-3 px-4">Gahee & Kutaa</th>
                    <th className="py-3 px-4">Balbala / Gate</th>
                    <th className="py-3 px-4">Kaffaltii</th>
                    <th className="py-3 px-4 text-right">Haala</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {gateLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{log.cardHolderId}</span>
                        <strong className="text-slate-800">{log.cardHolderName}</strong>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span>{log.role}</span>
                        <span className="text-[10px] text-slate-400 block">{log.gradeOrDept}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{log.gateLocation}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          log.paymentClearance === 'cleared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {log.paymentClearance === 'cleared' ? 'Cleared' : 'Pending Fee'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                          <Check className="w-3.5 h-3.5" />
                          <span>GRANTED</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
