import Icons from './components/Icons'

const Footer = () => {
  return (
    <footer
      // Fixed only on large screens: on mobile the bottom tab bar takes the
      // bottom edge, so the footer sits at the end of the page instead
      className='
      w-full h-[60px] border-1 border-green-weak-border bg-bg-primary
      flex justify-center
      lg:fixed lg:bottom-0 lg:left-0 lg:z-40'
    >
      <Icons />
    </footer>
  )
}

export default Footer
