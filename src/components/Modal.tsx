import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId?: string;
  ariaLabel?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  overlayClassName?: string;
  className?: string;
  children: React.ReactNode;
}

// Global scroll locking with counter and position preservation
let openModalCount = 0;
let savedScrollY = 0;

function lockBodyScroll() {
  if (openModalCount === 0) {
    savedScrollY = window.scrollY || window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflowY = 'scroll';
  }
  openModalCount++;
}

function unlockBodyScroll() {
  openModalCount = Math.max(0, openModalCount - 1);
  if (openModalCount === 0) {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflowY = '';
    window.scrollTo(0, savedScrollY);
  }
}

// Global stack of open modal containers to manage aria-hidden on everything outside
const activeModalContainers: HTMLElement[] = [];

function updateAriaHidden() {
  const topModal = activeModalContainers[activeModalContainers.length - 1];
  if (!topModal) {
    // No modals open: restore original aria-hidden on body children
    Array.from(document.body.children).forEach((child) => {
      const orig = child.getAttribute('data-orig-aria-hidden');
      if (orig !== null) {
        if (orig === 'REMOVE') {
          child.removeAttribute('aria-hidden');
        } else {
          child.setAttribute('aria-hidden', orig);
        }
        child.removeAttribute('data-orig-aria-hidden');
      }
    });
    return;
  }

  // Mark everything outside topModal as aria-hidden="true"
  Array.from(document.body.children).forEach((child) => {
    const htmlChild = child as HTMLElement;
    if (htmlChild.contains(topModal) || htmlChild === topModal) {
      const orig = htmlChild.getAttribute('data-orig-aria-hidden');
      if (orig !== null) {
        if (orig === 'REMOVE') {
          htmlChild.removeAttribute('aria-hidden');
        } else {
          htmlChild.setAttribute('aria-hidden', orig);
        }
        htmlChild.removeAttribute('data-orig-aria-hidden');
      }
    } else {
      if (!htmlChild.hasAttribute('data-orig-aria-hidden')) {
        const current = htmlChild.getAttribute('aria-hidden');
        htmlChild.setAttribute(
          'data-orig-aria-hidden',
          current === null ? 'REMOVE' : current
        );
      }
      htmlChild.setAttribute('aria-hidden', 'true');
    }
  });
}

export default function Modal({
  isOpen,
  onClose,
  titleId,
  ariaLabel,
  initialFocusRef,
  closeOnEscape = true,
  closeOnBackdropClick = true,
  overlayClassName = 'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in',
  className = 'bg-brand-cream border border-brand-gold/40 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative text-[#171b18]',
  children,
}: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store trigger element
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    // Scroll lock & aria-hidden
    lockBodyScroll();

    const node = containerRef.current;
    if (node) {
      activeModalContainers.push(node);
      updateAriaHidden();
    }

    // Move focus
    const timer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        const focusables = getFocusableElements(containerRef.current);
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          containerRef.current.focus();
        }
      }
    }, 30);

    return () => {
      clearTimeout(timer);
      unlockBodyScroll();
      if (node) {
        const idx = activeModalContainers.indexOf(node);
        if (idx !== -1) {
          activeModalContainers.splice(idx, 1);
        }
        updateAriaHidden();
      }
      if (
        previouslyFocusedRef.current &&
        typeof previouslyFocusedRef.current.focus === 'function' &&
        document.body.contains(previouslyFocusedRef.current)
      ) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isOpen, initialFocusRef]);

  // Keydown trap & Escape handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && closeOnEscape) {
      e.stopPropagation();
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'Tab' && containerRef.current) {
      const focusables = getFocusableElements(containerRef.current);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;

      if (e.shiftKey) {
        if (current === first || !containerRef.current.contains(current)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (current === last || !containerRef.current.contains(current)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={overlayClassName}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={ariaLabel}
        className={`${className} focus:outline-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([type="hidden"]):not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  const list = Array.from(
    container.querySelectorAll<HTMLElement>(selectors.join(','))
  );
  return list.filter((el) => {
    return (
      el.offsetWidth > 0 ||
      el.offsetHeight > 0 ||
      el.getClientRects().length > 0
    );
  });
}
