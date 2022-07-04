import Link from 'next/link'
import { useRouter } from 'next/router'
import { config } from '../blog.config'

export default function Header() {
  const router = useRouter()

  return (
    <section className="flex-col flex items-center mt-16 mb-16 md:mb-12">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tighter leading-tight md:pr-8">
        { router.asPath === '/' ? config.title : <Link href="/"><a className="hover:underline">{config.title}</a></Link> }
      </h2>
      <p className="text-center md:text-left text-md mt-5 md:pl-8">
        { config.description }
      </p>
    </section>
  )
}
