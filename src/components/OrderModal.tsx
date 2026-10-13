import React, { useEffect, useState } from 'react';
import { OrderItem } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { ShoppingBag, Plus, Minus, Trash2, X, Utensils, ArrowLeft, Star, QrCode, Eye, ChefHat } from 'lucide-react';
import Modal from './Modal';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  waiterItems?: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
  language: 'fi' | 'en';
  onNavigateToReview?: (menuItemId: string) => void;
  onOpenTransferModal?: () => void;
  onShowToWaiter?: () => void;
  onEditCustomization?: (orderItem: OrderItem) => void;
}

export default function OrderModal({
  isOpen,
  onClose,
  orderItems,
  waiterItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  language,
  onNavigateToReview,
  onOpenTransferModal,
  onShowToWaiter,
  onEditCustomization,
}: OrderModalProps) {
  const [isWaiterMode, setIsWaiterMode] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsWaiterMode(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayWaiterList = waiterItems.length > 0 ? waiterItems : orderItems;
  const totalItemCount = (isWaiterMode ? displayWaiterList : orderItems).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = (isWaiterMode ? displayWaiterList : orderItems).reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="order-modal-title"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in"
      className={`bg-brand-cream border border-brand-gold/40 rounded-3xl shadow-2xl w-full max-w-lg max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden relative text-[#171b18] transition-all duration-300 ${
        isWaiterMode ? 'bg-white' : ''
      }`}
    >
      {/* ================= WAITER MODE VIEW ================= */}
      {isWaiterMode ? (
        <div className="flex flex-col flex-1 min-h-0 bg-white text-[#171b18]">
          {/* Minimal Header (Fixed top) */}
          <div className="p-4 sm:p-5 bg-brand-cream border-b-2 border-brand-gold/40 flex items-center justify-between shadow-2xs flex-shrink-0">
            <div>
              <h2 id="order-modal-title" className="font-serif font-black text-base sm:text-lg uppercase tracking-wider text-brand-blue leading-tight">
                {language === 'fi' ? 'Tilauksen sisältö' : 'Order Details'}
              </h2>
              <p className="text-xs font-sans font-bold text-brand-gold-text mt-0.5">
                {totalItemCount} {language === 'fi' ? 'annosta yhteensä' : 'items total'}
              </p>
            </div>

            <button
              onClick={() => setIsWaiterMode(false)}
              className="px-5 py-2.5 bg-brand-blue text-white hover:bg-brand-blue/90 rounded-full transition-all flex items-center space-x-2 text-xs font-bold shadow-2xs active:scale-95 cursor-pointer min-h-[44px]"
              title={language === 'fi' ? 'Palaa muokkaamaan' : 'Back to edit'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'fi' ? 'Takaisin' : 'Back'}</span>
            </button>
          </div>

          {/* Maximized Ticket List (Scrollable) */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-3 bg-white touch-pan-y">
            {displayWaiterList.map((item) => {
              const menuItemIndex = MENU_ITEMS.findIndex(m => m.id === item.menuItemId);
              const displayIndex = menuItemIndex >= 0 ? menuItemIndex + 1 : null;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border-2 border-brand-blue/20 bg-brand-cream/30 flex items-start space-x-3.5 shadow-2xs"
                >
                  {/* Prominent 1x Quantity Badge */}
                  <span className="bg-brand-blue text-brand-gold font-extrabold text-base sm:text-lg px-3 py-1.5 rounded-xl min-w-[44px] text-center shadow-2xs flex-shrink-0 mt-0.5">
                    {item.quantity}x
                  </span>

                  {/* Item Name & Drink Size / Option / Customizations */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif font-black text-base sm:text-lg text-[#171b18] leading-snug break-words">
                      {displayIndex ? `${displayIndex}. ` : ''}{item.name[language]}
                    </h3>
                    {item.selectedOptionLabel && (
                      <p className="text-xs sm:text-sm font-bold text-brand-blue mt-1 bg-brand-gold/30 inline-block px-2.5 py-0.5 rounded-full">
                        {item.selectedOptionLabel[language]}
                      </p>
                    )}

                    {/* Customization Details for Waiter Ticket */}
                    {item.customizationSummary && (
                      <div className="mt-2 space-y-1 bg-white/90 p-2.5 rounded-xl border border-brand-blue/20 text-xs">
                        {item.customizationSummary.removals.length > 0 && (
                          <div className="flex items-start space-x-1.5 text-rose-800 font-bold">
                            <span className="shrink-0">❌</span>
                            <span>{item.customizationSummary.removals.map((r) => r[language]).join(', ')}</span>
                          </div>
                        )}
                        {item.customizationSummary.swaps.length > 0 && (
                          <div className="flex items-start space-x-1.5 text-brand-blue font-bold">
                            <span className="shrink-0">🔄</span>
                            <span>
                              {item.customizationSummary.swaps
                                .map((s) => `${s.groupTitle[language]}: ${s.optionName[language]}`)
                                .join(' • ')}
                            </span>
                          </div>
                        )}
                        {item.customizationSummary.specialNotes && (
                          <div className="flex items-start space-x-1.5 text-amber-900 font-semibold italic">
                            <span className="shrink-0">📝</span>
                            <span>"{item.customizationSummary.specialNotes}"</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimal Footer (Fixed bottom) */}
          <div className="p-4 sm:p-5 bg-brand-cream border-t border-brand-gold/30 flex items-center justify-between gap-3 flex-shrink-0">
            <button
              onClick={() => setIsWaiterMode(false)}
              className="w-1/3 py-3 min-h-[44px] bg-white border border-brand-blue/30 text-brand-blue hover:bg-black/5 font-serif font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center justify-center"
            >
              {language === 'fi' ? 'Muokkaa' : 'Edit'}
            </button>
            <button
              onClick={onClose}
              className="w-2/3 py-3 min-h-[44px] bg-brand-blue text-white font-serif font-bold text-xs uppercase tracking-widest rounded-full hover:bg-brand-blue/90 transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center"
            >
              {language === 'fi' ? 'Valmis / Sulje' : 'Done / Close'}
            </button>
          </div>
        </div>
      ) : (
        /* ================= STANDARD EDITING VIEW ================= */
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="bg-brand-blue text-white p-5 md:p-6 flex justify-between items-start border-b border-brand-gold/30 relative flex-shrink-0">
            <div className="pr-8">
              <div className="flex items-center space-x-2.5">
                <Utensils className="w-5 h-5 text-brand-gold" />
                <h2 id="order-modal-title" className="font-serif text-xl md:text-2xl font-bold tracking-wide uppercase">
                  {language === 'fi' ? 'Oma tilauslista' : 'My Order List'}
                </h2>
              </div>
              <p className="text-xs text-brand-gold/90 font-sans mt-1">
                {language === 'fi' 
                  ? 'Lisää annoksia tai näytä valmis lista tarjoilijalle' 
                  : 'Add items or show the ready list to the waiter'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2.5 rounded-full transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={language === 'fi' ? 'Sulje' : 'Close'}
              id="close-order-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body (Scrollable) */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-6 space-y-4 touch-pan-y">
            {orderItems.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto border border-brand-gold/20">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-blue">
                  {language === 'fi' ? 'Tilauslistasi on tyhjä' : 'Your order list is empty'}
                </h3>
                <p className="text-xs sm:text-sm text-[#171b18]/70 max-w-xs mx-auto">
                  {language === 'fi'
                    ? 'Selaa menua ja paina "Lisää tilaukseen" valitaksesi haluamasi annokset.'
                    : 'Browse the menu and tap "Add to order" to select your dishes.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {orderItems.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const menuItemIndex = MENU_ITEMS.findIndex(m => m.id === item.menuItemId);
                  const displayIndex = menuItemIndex >= 0 ? menuItemIndex + 1 : null;
                  return (
                    <div
                      key={item.id}
                      className="bg-white/95 rounded-2xl p-4 border border-brand-gold/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      id={`order-item-${item.id}`}
                    >
                      {/* Item Name & Option Details */}
                      <div className="flex-1 min-w-0 pr-1">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#171b18] leading-snug whitespace-normal break-words">
                          {displayIndex ? `${displayIndex}. ` : ''}{item.name[language]}
                        </h4>
                        {item.selectedOptionLabel && (
                          <p className="text-xs text-brand-blue font-semibold mt-0.5">
                            {item.selectedOptionLabel[language]}
                          </p>
                        )}

                        {/* Customization Badges */}
                        {item.customizationSummary && (
                          <div className="mt-2 space-y-1 text-xs">
                            {item.customizationSummary.removals.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {item.customizationSummary.removals.map((r, rIdx) => (
                                  <span
                                    key={rIdx}
                                    className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200"
                                  >
                                    ✕ {r[language]}
                                  </span>
                                ))}
                              </div>
                            )}

                            {item.customizationSummary.swaps.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {item.customizationSummary.swaps.map((s, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
                                  >
                                    ✓ {s.groupTitle[language]}: {s.optionName[language]}
                                  </span>
                                ))}
                              </div>
                            )}

                            {item.customizationSummary.specialNotes && (
                              <p className="text-[11px] text-amber-900 italic bg-amber-50/80 px-2 py-1 rounded-md border border-amber-200/60 leading-tight">
                                💬 "{item.customizationSummary.specialNotes}"
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <p className="text-[11px] text-[#171b18]/80 font-semibold">
                            {item.price.toFixed(2).replace('.', ',')} € / {language === 'fi' ? 'kpl' : 'pc'}
                          </p>
                          {onEditCustomization && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onEditCustomization(item);
                              }}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 min-h-[30px] rounded-full bg-white hover:bg-brand-cream text-brand-blue font-serif font-bold text-[10px] uppercase tracking-wider transition-all border border-brand-gold/40 active:scale-95 cursor-pointer shadow-2xs"
                              title={language === 'fi' ? 'Muokkaa ainesosia tai lisukkeita' : 'Customize ingredients or sides'}
                              id={`edit-custom-order-item-btn-${item.id}`}
                            >
                              <ChefHat className="w-2.5 h-2.5 text-brand-gold-text" />
                              <span>{language === 'fi' ? 'Muokkaa' : 'Customize'}</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onClose();
                              if (onNavigateToReview) {
                                onNavigateToReview(item.menuItemId);
                              }
                            }}
                            className="inline-flex items-center space-x-1.5 px-3 py-1 min-h-[30px] rounded-full bg-brand-gold/20 hover:bg-brand-gold/40 text-brand-blue font-serif font-bold text-[11px] transition-all border border-brand-gold/30 active:scale-95 cursor-pointer"
                            title={language === 'fi' ? 'Arvostele tämä tuote' : 'Review this item'}
                            id={`review-order-item-btn-${item.id}`}
                          >
                            <Star className="w-3 h-3 text-brand-gold fill-brand-gold" />
                            <span>{language === 'fi' ? 'Arvostele' : 'Review'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Quantity Controls & Price Summary */}
                      <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                        {/* Compact Quantity Controls with 44px min touch targets */}
                        <div className="flex items-center space-x-1.5 bg-black/5 rounded-full p-1 border border-black/10">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="min-w-[40px] min-h-[40px] rounded-full bg-white text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors shadow-2xs active:scale-95 cursor-pointer"
                            aria-label={language === 'fi' ? 'Vähennä määrää' : 'Decrease quantity'}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-sans text-[#171b18]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="min-w-[40px] min-h-[40px] rounded-full bg-white text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors shadow-2xs active:scale-95 cursor-pointer"
                            aria-label={language === 'fi' ? 'Lisää määrää' : 'Increase quantity'}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Item Total Price & Delete */}
                        <div className="flex items-center space-x-2">
                          <span className="font-serif font-bold text-sm sm:text-base text-brand-blue min-w-[60px] text-right">
                            {itemTotal.toFixed(2).replace('.', ',')} €
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500/70 hover:text-red-600 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                            title={language === 'fi' ? 'Poista' : 'Remove'}
                            aria-label={language === 'fi' ? 'Poista annos' : 'Remove item'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Summary & Actions */}
          {orderItems.length > 0 && (
            <div className="p-5 md:p-6 bg-brand-gold/10 border-t border-brand-gold/30 space-y-4">
              {/* Price Summary */}
              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="font-sans text-xs uppercase tracking-wider text-[#171b18]/70 font-bold block">
                    {language === 'fi' ? 'Yhteensä' : 'Total'}
                  </span>
                  <span className="text-xs text-[#171b18]/80">
                    {totalItemCount} {language === 'fi' ? 'annosta' : 'items'}
                  </span>
                </div>
                <span className="font-serif font-extrabold text-2xl text-brand-blue">
                  {totalPrice.toFixed(2).replace('.', ',')} €
                </span>
              </div>

              {/* PROMINENT SHARE QR CODE BUTTON */}
              {onOpenTransferModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenTransferModal();
                  }}
                  className="w-full py-3.5 min-h-[44px] px-4 bg-brand-gold hover:bg-amber-400 text-brand-blue font-serif font-black text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-md border border-amber-300 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 group cursor-pointer"
                  id="order-modal-qr-transfer-btn"
                >
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue shrink-0" />
                  <span className="truncate">{language === 'fi' ? 'Jaa tilauksesi tarjoilijalle QR-koodilla' : 'Share order with waiter via QR code'}</span>
                </button>
              )}

              {/* Secondary Action Buttons - Näytä tarjoilijalle ja Tyhjennä */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    if (onShowToWaiter) {
                      onShowToWaiter();
                    }
                    setIsWaiterMode(true);
                  }}
                  className="w-full py-2.5 px-3 min-h-[44px] bg-brand-gold/20 hover:bg-brand-gold/40 text-brand-blue border border-brand-gold/40 text-xs font-serif font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  id="show-to-waiter-btn"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                  <span className="truncate">{language === 'fi' ? 'Näytä tarjoilijalle' : 'Show to Waiter'}</span>
                </button>
                <button
                  onClick={onClearOrder}
                  className="w-full py-2.5 px-3 min-h-[44px] rounded-full border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  id="clear-order-btn"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'fi' ? 'Tyhjennä' : 'Clear'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}


