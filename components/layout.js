import Footer from '../components/footer'
import Meta from '../components/meta'

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen max-w-3xl mx-auto">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
