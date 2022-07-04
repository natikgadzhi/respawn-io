import { config } from '../blog.config'


export default function Footer() {
  return (
    <footer className="border-t border-accent-2 py-4">
      <div className="text-md max-w-3xl mx-auto px-5">
        {config.footer.copyright} {new Date().getFullYear()}
      </div>
    </footer>
  )
}
