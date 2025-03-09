export const fadeIn = (direction, delay = 0) => {
  return {
    hidden: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0, // Ensures the element starts hidden
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1, // Fades in the element
      transition: {
        type: 'tween',
        duration: 1.2,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75], // Smooth easing
      },
    },
  };
};
