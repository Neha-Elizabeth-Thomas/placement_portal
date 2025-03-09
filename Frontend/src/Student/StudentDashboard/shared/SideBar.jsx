import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Import decoder
import Female from '../../../assets/FemaleAvatar.png';
import Male from '../../../assets/Maleprofile.avif'
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from '../../../lib/consts/navigation';
import { HiOutlineLogout, HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false); // State to toggle sidebar collapse
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token

    if (token) {
      const decoded = jwtDecode(token); // Decode token
      setStudent(decoded); // Store student data from token
    }
  }, []);

  return (
    <div className={`bg-Navy ${collapsed ? 'w-20' : 'w-60'} p-3 flex flex-col text-white h-screen transition-all duration-300`}>
      {/* Collapse Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white text-2xl focus:outline-none transition-all"
        >
          {collapsed ? <HiChevronDoubleRight /> : <HiChevronDoubleLeft />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && student && (
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
            <img  src={student?.gender === "male" ? Male : Female}  alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <p className="text-white text-center font-bold">{student?.student_name}</p>
          <p className="text-white text-center font-semibold">{student?.ktu_id}</p>
          <hr className="border-white w-full my-2" />
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} collapsed={collapsed} />
        ))}
      </div>
      <hr className="border-white w-full my-2" />

      {/* Bottom Links */}
      <div>
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} collapsed={collapsed} />
        ))}

        <div className="flex items-center text-red-500 gap-4 font-extrabold mt-2 px-3 py-2 no-underline rounded-sm text-base transition-colors duration-200 cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token"); // Logout by clearing token
            window.location.href = "/login"; // Redirect to login
          }}
        >
          <span className="text-xl"><HiOutlineLogout /></span>
          {!collapsed && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

function SidebarLink({ item, collapsed }) {
  const { pathname } = useLocation();

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-4 font-extrabold mt-4 px-3 py-2 no-underline rounded-sm text-base text-white hover:bg-blue-400 transition-colors duration-200 ${
        collapsed ? 'justify-center' : ''
      }`}
    >
      <span className="text-2xl">{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export default SideBar;
