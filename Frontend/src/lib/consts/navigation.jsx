import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog,
	HiOutlineChartSquareBar
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
	{
	  key: 'dashboard',
	  label: 'Dashboard',
	  path: '/student-dashboard', // Full path for the root
	  icon: <HiOutlineViewGrid />
	},
	{
	  key: 'UpdateProfile',
	  label: 'View/Update Profile',
	  path: '/student-dashboard/UpdateProfile', // Correct relative path
	  icon: <HiOutlineUsers />
	},
	{
	  key: 'MyApplication',
		label: 'My Application / Result',
	  path: '/student-dashboard/MyApplication', // Correct relative path
	  icon: <HiOutlineDocumentText />
	}
	
  ];
  

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]