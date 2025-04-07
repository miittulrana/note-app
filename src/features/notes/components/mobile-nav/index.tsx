import { useState, useEffect } from 'react';
import { List, X } from 'phosphor-react';
import { SideBar } from '../side-bar';
import { Logo } from '../../../common/components/logo';

export function MobileNav() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector('.side-bar');
      const menuButton = document.querySelector('.menu-button');
      
      if (
        isSidebarOpen && 
        sidebar && 
        !sidebar.contains(e.target as Node) && 
        menuButton && 
        !menuButton.contains(e.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header hidden md:hidden">
        <button 
          className="menu-button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X size={24} weight="bold" />
          ) : (
            <List size={24} weight="bold" />
          )}
        </button>
        
        <div className="ml-4">
          <Logo />
        </div>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`side-bar md:relative md:translate-x-0 ${
          isSidebarOpen ? 'mobile-sidebar-open' : ''
        }`}
      >
        <SideBar />
      </div>
      
      {/* Backdrop */}
      <div 
        className={`mobile-backdrop md:hidden ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </>
  );
}