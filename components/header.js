import Link from 'next/link'
import { useRouter } from 'next/router'
import { config } from '../blog.config'

export default function Header() {
  const router = useRouter()

  return (
    <section className='flex justify-between justify-items-stretch flex-nowrap items-baseline my-8 md:my-12 space-x-8' >
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tighter leading-tight md:mb-2">
          { router.asPath === '/' ? config.title : <Link href="/"><a className="hover:underline">{config.title}</a></Link> }
        </h2>
        <p className="text-left text-md">
          { config.description }
        </p>
      </div>

      <div>
        <ul className='text-md md:text-lg space-x-4'>
          <li className='inline-block'>
            <Link href="/about"><a className='hover:underline'>About</a></Link>
          </li>
          <li className='inline-block'>
            <Link href="/rss/feed.xml"><a className='hover:underline'>RSS</a></Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
