import React, { useRef, useEffect, useState } from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../data/menuData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  language: 'fi' | 'en';
}

export default function CategoryNav({ activeCategory, setActiveCategory, language }: CategoryNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Check scroll position to show/hide left and right fading gradients
  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftFade(scrollLeft > 10);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (container.scrollWidth > container.clientWidth) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          const canScrollLeft = container.scrollLeft > 0;
          const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth;
          
          if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
          }
        }
      }
    };

    container.addEventListener('scroll', checkScroll);
    container.addEventListener('wheel', handleWheel, { passive: false });
    checkScroll();
    
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Center selected category button when it is clicked
  const handleCategoryClick = (categoryId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasDragged) return; // Prevent click trigger when dragging mouse
    setActiveCategory(categoryId);
    
    // Smoothly scroll the clicked button into the center of the nav view
    const button = e.currentTarget;
    if (containerRef.current && button) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.clientWidth;
      
      container.scrollTo({
        left: buttonLeft - (containerWidth / 2) + (buttonWidth / 2),
        behavior: 'smooth'
      });
    }

    // Only scroll the window if the user is already scrolled further down than the menu list,
    // so we never force an unwanted downwards auto-scroll when the user is at the top of the page.
    requestAnimationFrame(() => {
      const listElement = document.getElementById('menu-items-section');
      if (listElement) {
        const stickyHeader = document.getElementById('sticky-nav-header');
        const headerOffset = stickyHeader ? stickyHeader.getBoundingClientRect().height : 140;
        const elementPosition = listElement.getBoundingClientRect().top + window.scrollY;
        const targetScrollTop = Math.max(0, elementPosition - headerOffset);

        if (window.scrollY > targetScrollTop + 10) {
          window.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        }
      }
    });
  };

  // Handle keyboard navigation across categories
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % CATEGORIES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = CATEGORIES.length - 1;
    } else {
      return;
    }

    const nextCat = CATEGORIES[nextIndex];
    setActiveCategory(nextCat.id);

    // Focus and scroll next button into view
    const nextBtn = document.getElementById(`cat-btn-${nextCat.id}`);
    if (nextBtn) {
      nextBtn.focus();
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const buttonLeft = nextBtn.offsetLeft;
        const buttonWidth = nextBtn.clientWidth;
        container.scrollTo({
          left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div className="relative w-full border-b border-brand-gold/20 bg-brand-cream/95 backdrop-blur-xs py-4 sm:py-5 z-40">
      <div className="max-w-7xl mx-auto relative px-2 sm:px-4 md:px-8">
        {/* Left desktop scroll arrow button */}
        {showLeftFade && (
          <button
            onClick={() => scrollByAmount('left')}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] w-11 h-11 items-center justify-center rounded-full bg-brand-cream border border-brand-gold/40 text-brand-blue shadow-md hover:bg-brand-blue hover:text-white transition-all duration-200 cursor-pointer"
            aria-label={language === 'fi' ? 'Selaa vasemmalle' : 'Scroll left'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right desktop scroll arrow button */}
        {showRightFade && (
          <button
            onClick={() => scrollByAmount('right')}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] w-11 h-11 items-center justify-center rounded-full bg-brand-cream border border-brand-gold/40 text-brand-blue shadow-md hover:bg-brand-blue hover:text-white transition-all duration-200 cursor-pointer"
            aria-label={language === 'fi' ? 'Selaa oikealle' : 'Scroll right'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Category Container */}
        <div
          ref={containerRef}
          role="tablist"
          aria-label={language === 'fi' ? 'Ruokalistan kategoriat' : 'Menu Categories'}
          className="flex overflow-x-auto no-scrollbar px-3 sm:px-6 py-2 space-x-3 sm:space-x-4 md:space-x-5 scroll-smooth touch-pan-x cursor-grab active:cursor-grabbing select-none items-center"
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
        >
          {CATEGORIES.map((cat, index) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={(e) => handleCategoryClick(cat.id, e)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`flex-shrink-0 whitespace-nowrap px-6 sm:px-8 md:px-9 py-3 sm:py-3.5 md:py-4 rounded-full text-xs sm:text-sm md:text-base font-serif font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer min-h-[44px] flex items-center justify-center ${
                  isActive
                    ? 'bg-brand-blue text-brand-gold shadow-md shadow-brand-blue/20 border-2 border-brand-gold/60 scale-[1.02]'
                    : 'bg-white/90 text-brand-blue hover:text-brand-blue hover:bg-white border border-brand-gold/30 shadow-2xs hover:border-brand-gold/50'
                }`}
                id={`cat-btn-${cat.id}`}
              >
                {cat.name[language]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
