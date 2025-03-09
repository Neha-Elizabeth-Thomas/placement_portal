// Import necessary React hooks
import React, { useEffect, useState } from 'react';
import Rit from '../../assets/Ritktym.png';
import { Link } from 'react-scroll';
import { FaXmark,FaBars } from "react-icons/fa6";

// Define the Navbar component
const Navbar = () => {
  // State to track whether the menu is open or closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State to track whether the navbar should be sticky
  const [isSticky, setIsSticky] = useState(false);

  // Function to toggle the menu open/close state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Flip the current value of isMenuOpen
  };

  // Effect to handle scroll behavior and make navbar sticky
  useEffect(() => {
    const handleScroll = () => {
      // Check how far the user has scrolled (scrollY)
      if (window.scrollY > 100) {
        setIsSticky(true); // Make navbar sticky
      } else {
        setIsSticky(false); // Remove sticky behavior
      }
    };

    // Add a scroll event listener to the window
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this runs only on component mount

  //navitems array


  const navItems = [
    { link: "Home", path: "home" },
    { link: "About", path: "about" },
    { link: "Login", path: "login" },
    { link: "Contact", path: "contact" },
  ];

  // Render the Navbar component
  return (
    <header className='w-ful md:bg-transparent fixed top-0 left-0 right-0 '>
      <nav className={`bg-Navy py-4 lg:px-14 px-4 ${isSticky ? "sticky top-0 left-0 right-0 border-b duration-300" : ""}`}>

          <div className='flex justify-between items-center text-base gap-8'> 
         
              <a href="" className='text-2xl flex items-center space-x-3 no-underline'>
                     <img src={Rit} alt="" className='w-20 inline-block items-center'/>
                    <div className='text-[#fff]'>
                        <span className='font-barlow block text-[30px] '>Rajiv Gandhi Institute of Technology</span>
                        <span className='font-barlow block text-[15px]'>Gov. Engineering College Kottayam</span>
                        
                    </div>
              </a>


            {/*nav items*/}
            <ul className='md:flex space-x-12 hidden'>
              {
                navItems.map(
                  ({link,path}) => 
                  <Link to={path} spy={true} smooth={true} duration={200} offset={-100} key={path}
                  className = 'block text-base text-[#fff] no-underline hover:underline'>{link}</Link>
                )
              }
            </ul>

            {/*Menu Button for only mobile devices */}

            <div className='md:hidden'>
              <button>
                {
                  isMenuOpen ? (<FaXmark className='h-6 w-6 text-[#fff]'/>):(<FaBars className='h-6 w-6 text-[#fff]'/>)
                }
              </button>
            </div>



          </div>
      </nav>
    </header>
  );
};

// Export the Navbar component for use in other parts of the app
export default Navbar;