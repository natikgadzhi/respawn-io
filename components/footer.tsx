import { config } from '../blog.config'

const Footer = () => {
  return (
    <footer className="py-4">
      <div className="text-md max-w-3xl mx-auto px-5">
        {config.footer.copyright} {new Date().getFullYear()}
      </div>
    </footer>
  )
}

export default Footer
