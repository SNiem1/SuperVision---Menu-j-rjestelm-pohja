import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { OrderItem } from '../types';
import { encodeOrderToUrl } from '../lib/orderTransfer';
import { QrCode, X, RefreshCw } from 'lucide-react';
import Modal from './Modal';

interface OrderTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  language: 'fi' | 'en';
}

export default function OrderTransferModal({
  isOpen,
  onClose,
  orderItems,
  language,
}: OrderTransferModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Generate QR code when order items change or modal opens
  useEffect(() => {
    if (orderItems.length > 0) {
      const url = encodeOrderToUrl(orderItems);
      QRCode.toDataURL(url, {
        width: 340,
        margin: 2,
        color: {
          dark: '#1e3a5f',
          light: '#ffffff',
        },
      })
        .then((dataUrl) => setQrDataUrl(dataUrl))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [orderItems]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="order-transfer-modal-title"
      overlayClassName="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      className="bg-brand-cream border border-brand-gold/40 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative text-[#171b18] animate-zoom-in duration-200"
    >
      {/* Header */}
      <div className="bg-brand-blue text-white p-5 flex items-center justify-between border-b border-brand-gold/30">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-brand-gold/20 text-brand-gold rounded-full border border-brand-gold/30">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 id="order-transfer-modal-title" className="font-serif font-black text-base sm:text-lg uppercase tracking-wider text-brand-gold leading-tight">
              {language === 'fi' ? 'QR-koodi' : 'QR Code'}
            </h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={language === 'fi' ? 'Sulje' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body - ONLY QR CODE */}
      <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center">
        {orderItems.length === 0 ? (
          <div className="py-10 space-y-2.5">
            <p className="text-sm font-bold text-[#171b18]/70">
              {language === 'fi' ? 'Ostoskorisi on tyhjä.' : 'Your cart is empty.'}
            </p>
            <p className="text-xs text-[#171b18]/80">
              {language === 'fi'
                ? 'Lisää tuotteita tilauskoriin näytäksesi QR-koodin.'
                : 'Add items to cart to show QR code.'}
            </p>
          </div>
        ) : (
          <div className="p-4 bg-white border border-brand-gold/30 rounded-3xl shadow-md inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Order QR Code"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain mx-auto rounded-2xl"
              />
            ) : (
              <div className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-brand-blue animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

