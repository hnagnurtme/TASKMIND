import Sidebar from '@/components/SideBar';
import TopBar from '@/components/TopBar';
import React from 'react';

interface ILayoutMainProps {
  children: React.ReactNode;
}

const LayoutMain: React.FC<ILayoutMainProps> = ({ children }) => {
  return (
    <div className="layout-main">
      {/* TopBar - Fixed at the top */}
      <div className="topbar">
        <TopBar />
      </div>

      {/* Body - Sidebar on the left + Main content */}
      <div className="layout-body">
        {/* Sidebar - On the left */}
        <div className="sidebar-container">
          <Sidebar />
        </div>

        {/* Main content - Remaining space */}
        <main className="main-content">
          {children || <div className="placeholder">No content available</div>}
        </main>
      </div>
    </div>
  );
};

export default LayoutMain;