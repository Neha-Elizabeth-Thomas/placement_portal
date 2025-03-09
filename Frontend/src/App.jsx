import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home';
import LoginCards from './Components/LoginCards';
import TopCompany from './Components/TopCompany';
import Welcome from './Components/Welcome';
import FlashNews from './Components/FlashNews';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
import Explore from './Explore';
import Login from './Student/Login';
import Layout from './Student/StudentDashboard/shared/Layout';
import Register from './Student/Register';
import Result from './Student/StudentDashboard/Result';
import UpdateProfile from './Student/StudentDashboard/UpdateProfile';
import Chatbot from './Student/StudentDashboard/chatbot.jsx';
import MyApplication from './Student/StudentDashboard/MyApplication';
import Placement from './Student/StudentDashboard/Placement';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import RecentPlacement from './Components/RecentPlacement';
import AdminLayout from './Admin/AdminDashboard/Shared/AdminLayout';
import Dashboard from './Admin/AdminDashboard/Dashboard';
import PublishResult from './Admin/AdminDashboard/PublishResult';
import UploadOrDeleteDrive from './Admin/AdminDashboard/UploadOrDeleteDrive';
import RegisterCompany from './Admin/AdminDashboard/RegisterCompany';
import AddStudent from './Admin/AdminDashboard/AddStudent';
import AddRounds from './Admin/AdminDashboard/AddRounds';
import AdminLogin from './Admin/AdminDashboard/AdminLogin';
import ViewStudent from './Admin/AdminDashboard/ViewStudent';
import GetStudents from './Admin/AdminDashboard/GetStudents';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import ProtectedAdminRoute from './ProtectedRoute/ProtectedAdminRoute';

const App = () => {
  return (
    <Router>

      <Routes>
        
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <section id="home">
                <Home />
              </section>
              <FlashNews />
              <section id="about">
                <Welcome />
              </section>
              <section id="login">
                <LoginCards />
              </section>
              <section id="RecentPlacement">
              <RecentPlacement/>
              </section>
              
              <TopCompany />
              <section id="contact">
                <Contact />
              </section>
              <Footer />
            </>
          }
        />

        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />

        <Route element={<ProtectedRoute/>}>
           {/* Student Dashboard Routes*/}
        <Route path="/student-dashboard" element={<Layout />}>
            <Route index element={<Placement />} />
            <Route path="Result/:driveId" element={<Result />} />
            <Route path="UpdateProfile" element={<UpdateProfile />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="MyApplication" element={<MyApplication />} />
        </Route>
        </Route>
        

       
        
        <Route element={<ProtectedAdminRoute/>}>
        { /* Admin Dashboard Routes */}

      <Route path="/Admin-dashboard" element={<AdminLayout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="PublishResult" element={<PublishResult/>}/>
          <Route path="UploadOrDeleteDrive" element={<UploadOrDeleteDrive/>}/>
          <Route path="RegisterCompany" element={<RegisterCompany />} />
          <Route path="AddStudent" element={<AddStudent />} />
          <Route path="AddRounds/:round/:drive_id" element={<AddRounds />} />
          <Route path="ViewStudents" element={<ViewStudent />} />
          <Route path="GetStudents" element={<GetStudents/>} />
        </Route>
        </Route>


      </Routes>
    </Router>
  );
};

export default App;
