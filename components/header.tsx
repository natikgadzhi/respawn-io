import Link from 'next/link'
import { useRouter } from 'next/router'
import { config } from '../blog.config'

const Header = () => {
  const router = useRouter()

  return (
    <section className='flex-col justify-between justify-items-stretch flex-nowrap items-baseline my-8 md:mt-12 md:mb-16' >
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tighter leading-tight md:mb-2">
          {router.asPath === '/' ?
            config.title :
            <Link href="/" className="hover:underline">{config.title}</Link>
          }
        </h2>
        <ul className='text-md md:text-lg flex-row justify-start space-x-4 text-blue-700'>
          <li className='inline-flex'>
            <Link href="/about" className='hover:underline'>About</Link>
          </li>
          <li className='inline-flex'>
            <Link href="/rss/feed.xml" className='hover:underline'>RSS</Link>
          </li>
        </ul>
      </div>
      <div className='mt-2'>
        <p className="text-left text-md md:text-lg">
          {config.description}
        </p>
      </div>
    </section>
  )
}

export default Header