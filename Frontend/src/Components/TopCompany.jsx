import React from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import Marquee from 'react-fast-marquee';
import Cognizant from '../assets/cognizant.png';
import Ibm from '../assets/ibm.png';
import Tcs from '../assets/tcs.png';
import Envestnet from '../assets/Envestnet.png';
import Ust_global from '../assets/ust_global.png';
import { fadeIn } from '../variants'; // Import fadeIn function

const TopCompany = () => {
  return (
    <div className="md:px-14 w-full py-3 mt-6 px-0 mx-auto max-w-full">
      {/* Title Section */}
      <motion.div
        className="text-center mb-8"
      initial="hidden"
                       whileInView="show"
                       viewport={{ once: false, amount: 0.3 }} // Trigger animation when 30% of the div is visible
                       variants={fadeIn('right', 0.2)} // Trigger animation when 30% of the section is visible
      >
        <h2 className="text-3xl font-bold text-Navy uppercase">Top Companies</h2>
      </motion.div>

      {/* Marquee Section */}
      <motion.div
        className="w-full"
         initial="hidden"
                          whileInView="show"
                          viewport={{ once: false, amount: 0.3 }} // Trigger animation when 30% of the div is visible
                          variants={fadeIn('left', 0.2)}
      >
        <Marquee className="w-full">
          <div className="flex items-center gap-36">
            <img src={Ibm} alt="IBM" className="h-36 w-auto object-contain" />
            <img src={Cognizant} alt="Cognizant" className="h-36 w-auto object-contain" />
            <img src={Tcs} alt="TCS" className="h-28 w-auto object-contain" />
            <img src={Envestnet} alt="Envestnet" className="h-28 w-auto object-contain" />
            <img src={Ust_global} alt="UST Global" className="h-20 w-auto object-contain" />
          </div>
        </Marquee>
      </motion.div>
    </div>
  );
};

export default TopCompany;
