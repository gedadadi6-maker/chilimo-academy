import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { SchoolBill } from '../types';
import { CHILIMO_INFO, getSchoolLogoUrl } from '../data/mockData';

interface OfficialPaymentReceiptModalProps {
  bill: SchoolBill;
  onClose: () => void;
}

export const OfficialPaymentReceiptModal: React.FC<OfficialPaymentReceiptModalProps> = ({
  bill,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const refCode = bill.paymentRef || `CHA-RCP-${bill.id}-${bill.studentId}`;

  useEffect(() => {
    const payload = JSON.stringify({
      school: 'CHILIMO ACADEMY BURAYU',
      receiptRef: refCode,
      billId: bill.id,
      studentId: bill.studentId,
      studentName: bill.studentName,
      amountETB: bill.amount,
      gateway: bill.paymentGateway || bill.paidVia || 'Telebirr',
      verifiedAt: bill.adminApprovalDate || bill.paidDate || '2026-11-02',
      status: 'VERIFIED_PAID',
    });

    QRCode.toDataURL(payload, {
      width: 220,
      margin: 1,
      color: { dark: '#0b172a', light: '#ffffff' },
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [bill, refCode]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:static print:bg-white print:p-0">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative print:shadow-none print:border-0 print:max-w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer print:hidden"
          aria-label="Close receipt"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Official Crest Header */}
        <div className="text-center border-b border-slate-200 pb-4 mb-5">
          <img
            src={getSchoolLogoUrl()}
            alt="Chilimo Academy Crest"
            className="w-16 h-16 mx-auto object-contain mb-2"
          />
          <h3 className="font-serif text-xl font-bold text-[#0b172a]">
            {CHILIMO_INFO.name}
          </h3>
          <div className="text-xs font-semibold text-amber-800 mt-0.5">
            Nagahee Kaffaltii Seera Qabeessa • Official Verified Receipt
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1 tabular-nums">
            REF: {refCode} · {bill.paymentGateway || 'Telebirr'}
          </div>
        </div>

        {/* Verified Stamp + QR Verification Block */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ADMIN APPROVED &amp; VERIFIED</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed max-w-[230px]">
              Scan QR code to verify receipt authenticity against Chilimo Academy Finance Office records.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Tel: {CHILIMO_INFO.phone} · Burayu, Oromia
            </div>
          </div>

          <div className="w-24 h-24 rounded-lg bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Receipt Verification QR Code" className="w-full h-full object-contain" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-slate-300" />
            )}
          </div>
        </div>

        {/* Receipt Details */}
        <div className="space-y-2 text-xs mb-6">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Maqaa Barataa (Student):</span>
            <strong className="text-slate-900">{bill.studentName}</strong>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">ID Barataa / Kutaa:</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {bill.studentId} ({bill.grade})
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Gosa Kaffaltii (Item):</span>
            <span className="text-slate-900 font-semibold">{bill.billTitle}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Karaa Kaffaltii (Gateway):</span>
            <span className="font-bold text-emerald-800">
              {bill.paymentGateway || bill.paidVia || 'Telebirr (0912305111)'}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Guyyaa Mirkanaa’e (Date):</span>
            <span className="font-mono text-slate-700 tabular-nums">
              {bill.adminApprovalDate || bill.paidDate || new Date().toISOString().slice(0, 10)}
            </span>
          </div>
          <div className="flex justify-between py-2.5 text-sm font-bold bg-amber-50 px-3.5 rounded-lg mt-2 border border-amber-200 tabular-nums">
            <span className="text-slate-900">Hamma Kaffalame (Total Paid):</span>
            <span className="text-amber-900 font-mono text-base">
              {bill.amount.toLocaleString()} ETB
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Nagahee Maxxansi (Print / PDF)</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0b172a] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-800"
          >
            Cufi (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
