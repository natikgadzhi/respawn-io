import Footer from '../components/footer'
import Meta from '../components/meta'
import Analytics from '../components/analytics'

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen max-w-3xl mx-auto">
        <main>{children}</main>
      </div>
      <Footer />
      <Analytics />
    </>
  )
}
