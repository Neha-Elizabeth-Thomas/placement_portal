import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './AdminSideBar';
import Header from './AdminHeader';

const AdminLayout = () => {
  return (
    <div className='flex flex-row h-screen w-screen'>
      {/* Sidebar */}
      <div className='flex-shrink-0 '>
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='flex flex-col flex-1 h-screen'>
        {/* Header */}
        <Header />

        {/* Scrollable Outlet */}
        <div className='flex-1 overflow-y-auto p-4'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
