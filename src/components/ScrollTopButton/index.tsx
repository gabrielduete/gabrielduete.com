'use client'

import { useEffect, useState } from 'react'

import { FaArrowUp } from 'react-icons/fa'

const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 800) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  if (!isVisible) return null

  return (
    <button
      className='
        fixed hidden right-10 bottom-22 cursor-pointer 
        text-primary hover:text-secondary 
        bg-bg-secondary hover:bg-bg-primary p-base rounded-full
        transition-opacity duration-1000 ease-in-out
        lg:block
      '
      aria-hidden
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <FaArrowUp size={20} />
    </button>
  )
}

export default ScrollTopButton
