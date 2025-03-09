import {
	HiOutlineViewGrid,
	HiOutlineUserGroup,
	HiOutlineOfficeBuilding,
	HiOutlineCloudUpload,
	HiOutlineClipboardCheck,
	HiUserAdd,
	HiOutlineSearch // Added icon for "Get Students"
} from 'react-icons/hi';

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/Admin-dashboard',
		icon: <HiOutlineViewGrid /> 
	},
	{
		key: 'ViewStudents',
		label: 'View Students',
		path: '/Admin-dashboard/ViewStudents',
		icon: <HiOutlineUserGroup /> 
	},
	{
		key: 'RegisterCompany',
		label: 'Register Company',
		path: '/Admin-dashboard/RegisterCompany',
		icon: <HiOutlineOfficeBuilding /> 
	},
	{
		key: 'UploadOrDeleteDrive',
		label: 'Upload Drive',
		path: '/Admin-dashboard/UploadOrDeleteDrive',
		icon: <HiOutlineCloudUpload /> 
	},
	{
		key: 'PublishResult',
		label: 'Publish Result',
		path: '/Admin-dashboard/PublishResult',
		icon: <HiOutlineClipboardCheck /> 
	},
	{
		key: 'AddStudents',
		label: 'Add Students',
		path: '/Admin-dashboard/AddStudent',
		icon: <HiUserAdd /> 
	},
	{
		key: 'GetStudents',
		label: 'Get Students',
		path: '/Admin-dashboard/GetStudents', // Added path for Get Students
		icon: <HiOutlineSearch /> // Added search icon for "Get Students"
	}
];
