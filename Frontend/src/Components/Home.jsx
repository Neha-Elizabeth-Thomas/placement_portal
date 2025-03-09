import React from 'react';
import { Carousel } from 'flowbite-react';
import Rit from '../assets/placement2.png';

import { motion } from 'framer-motion';
import { fadeIn } from '../variants';
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();

  const explorePage = () => {
    navigate("/explore");
  }


  
  return (
    <div>
      <div className='px-4 lg:px-14 max-w-screen-2xl mx-auto min-h-screen h-screen'>
        <Carousel className='w-full mx-auto'>
          <div className='my-28 md:my-8 py-12 flex flex-col md:flex-row-reverse items-center justify-between'>
            <motion.div
              initial='hidden'
              whileInView='show'
              viewport={{ once: false, amount: 0.3 }} // Trigger animation when 30% of the div is visible
              variants={fadeIn('right', 0.2)} // Optional transition duration for fade-in
            >
              <img src={Rit} alt='RIT Placement' />
            </motion.div>

            <div className='md:w-1/2'>
              <motion.h1
                className='text-5xl mb-4 text-[#696969] md:w-3/4 leading-snug'
                initial='hidden'
                whileInView='show'
                viewport={{ once: false, amount: 0.3 }} // Trigger animation when 30% of the div is visible
                variants={fadeIn('right', 0.2)}
              >
                <span className='block text-Navy'>WELCOME TO</span>
                <span className='block'><span className='text-red-600'>RIT</span> CAREER CONNECT!</span>
              </motion.h1>

                          <motion.p
                               initial='hidden'
              whileInView='show'
              viewport={{ once: false, amount: 0.3 }} // Trigger animation when 30% of the div is visible
              variants={fadeIn('left', 0.2)} 
                          >
                 <p className='text-[#696969] text-2xl mb-8 font-dancing'>
               This platform is designed to streamline the placement process for students and placement cell at RIT. For students, it offers an easy way to explore job opportunities, track applications, and stay updated on campus placements
              </p>                 
                          </motion.p>
                          
                          <motion.button
                                    initial='hidden'
              whileInView='show'
              viewport={{ once: false, amount: 0.3 }} // Trigger animation when 30% of the div is visible
              variants={fadeIn('up', 0.2)} 
                          >
                <button className='px-7 py-2 bg-Navy text-white rounded hover:bg-[#696969] transition-all duration-300 hover:-translate-y-4 w-36'
                onClick={explorePage}>
                Explore
              </button>
                          </motion.button>

             
              
            </div>
          </div>

          
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
