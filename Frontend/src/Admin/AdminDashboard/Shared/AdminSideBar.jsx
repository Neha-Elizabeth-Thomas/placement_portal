import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Female from '../../../assets/Ritktym.png';
import { DASHBOARD_SIDEBAR_LINKS } from '../../../lib/consts/AdminNavigation';
import { HiOutlineLogout, HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import classNames from 'classnames';

const AdminSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/AdminLogin"); // Redirect to the login page
  };

  return (
    <div
      className={classNames(
        'bg-[#005f69] h-screen p-3 flex flex-col text-white transition-all duration-300',
        {
          'w-20': isCollapsed,
          'w-60': !isCollapsed,
        }
      )}
    >
      {/* Toggle Button */}
      <div className={`flex justify-${isCollapsed ? 'center' : 'end'} mb-4`}>
        <button
          className="text-2xl p-1 hover:bg-blue-400 rounded"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <HiChevronDoubleRight /> : <HiChevronDoubleLeft />}
        </button>
      </div>

      {/* Avatar Section */}
      {!isCollapsed && (
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
            <img
              src={Female}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-white text-center font-bold">ADMIN PANEL</p>
          <hr className="border-white w-full my-2" />
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} isCollapsed={isCollapsed} />
        ))}
      </div>

      <hr className="border-white w-full my-2" />

      {/* Logout Section */}
      <div>
        <button
          onClick={handleLogout}
          className={classNames(
            'flex items-center text-red-500 gap-4 font-extrabold px-3 py-2 rounded-sm text-base transition-colors duration-200 w-full',
            {
              'justify-center': isCollapsed,
            }
          )}
        >
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

function SidebarLink({ item, isCollapsed }) {
  const { pathname } = useLocation();

  return (
    <Link
      to={item.path}
      className={classNames(
        'flex items-center gap-4 font-extrabold px-3 py-2 rounded-sm no-underline text-base text-white hover:bg-blue-400 mt-6',
        {
          'justify-center': isCollapsed,
        }
      )}
    >
      <span className="text-2xl">{item.icon}</span>
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  );
}

export default AdminSideBar;
