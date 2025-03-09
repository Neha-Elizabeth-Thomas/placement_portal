import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import officer from '../assets/officer.png';
import student from '../assets/student.png';
import { useNavigate } from 'react-router-dom';
import { fadeIn } from '../variants';
import { motion, useInView } from 'framer-motion';

const LoginCards = () => {
  const [studentHover, setStudentHover] = useState(false);
  const [registerHover, setRegisterHover] = useState(false);
  const [placementHover, setPlacementHover] = useState(false);

  const navigate = useNavigate();

  const buttonStyle = (hover) => ({
    backgroundColor: hover ? 'gray' : 'navy',
    color: 'white',
    borderRadius: '0.375rem',
    padding: '0.5rem 1.75rem',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
  });

  return (
    <div className="md:px-14 px-4 py-16 max-w-screen-2xl mx-auto">
      <motion.div
        className="flex justify-center gap-28"
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }} // Trigger animation when 30% of the div is visible
        variants={fadeIn('up', 0.2)}
      >
        {/* Student Card */}
        <motion.div variants={fadeIn('up', 0.4)}>
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={student} />
            <Card.Body>
              <Card.Title style={{ fontSize: '1.5rem', color: 'navy', fontWeight: 'bold' }}>Student</Card.Title>
              <Card.Text style={{ fontSize: '1rem', color: '#696969', lineHeight: '1.5' }}>
                "Access your personalized placement updates and resources. Login to stay connected with opportunities tailored for you."
              </Card.Text>
              <div className="d-flex gap-4 justify-center">
                <motion.button
                  style={buttonStyle(studentHover)}
                  onMouseEnter={() => setStudentHover(true)}
                  onMouseLeave={() => setStudentHover(false)}
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.1 }}
                >
                  Login
                </motion.button>
                <motion.button
                  style={buttonStyle(registerHover)}
                  onMouseEnter={() => setRegisterHover(true)}
                  onMouseLeave={() => setRegisterHover(false)}
                  onClick={() => navigate('/Register')}
                  whileHover={{ scale: 1.1 }}
                >
                  Register
                </motion.button>
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Placement Cell Card */}
        <motion.div variants={fadeIn('up', 0.6)}>
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={officer} className='mb-20' />
            <Card.Body>
              <Card.Title style={{ fontSize: '1.5rem', color: 'navy', fontWeight: 'bold' }} >Placement Cell</Card.Title>
              <Card.Text style={{ fontSize: '1rem', color: '#696969', lineHeight: '1.5' }} >
                "Manage student profiles and placement activities effortlessly. Track company visits, interview schedules, and placement results."
              </Card.Text>
              <div className="d-flex gap-4 justify-center">
                <motion.button
                  style={buttonStyle(placementHover)}
                  onMouseEnter={() => setPlacementHover(true)}
                  onMouseLeave={() => setPlacementHover(false)}
                  whileHover={{ scale: 1.1 }}
                  onClick={()=>navigate("/AdminLogin")}
                >
                  Login
                </motion.button>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginCards;
