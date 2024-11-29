import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';

function ScrollButton() {
  const [visible, setVisible] = useState(false);
  
  useEffect(()=>{
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
  },[]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    visible?(
      <Button size='lg' className='scroll-to-top' onClick={scrollToTop}><FontAwesomeIcon icon={faArrowUp}/></Button>
    ) : (null)
  )
}

export default ScrollButton