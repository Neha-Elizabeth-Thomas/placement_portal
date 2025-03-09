import React from 'react'
import Marquee from 'react-fast-marquee';

const FlashNews = () => {
  return (
    <div>
       <div className="bg-red-800 text-white py-2 mt-4">
      <Marquee gradient={false} speed={50}>
        <span className="mx-4">🔥 Admission open for 2025 batch!</span>
        <span className="mx-4">📢 Placement training starts next week!</span>
        <span className="mx-4">🏆 Congrats to all students placed in top companies!</span>
        <span className="mx-4">🎓 Upcoming workshop on AI and ML!</span>
      </Marquee>
    </div>
    </div>
  )
}

export default FlashNews
