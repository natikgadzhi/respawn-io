import Link from "next/link"

type Props = {
    className?: string
}

const Navigation = ({ className }: Props) => {
    return (
        <ul className={`${className} text-md md:text-lg flex-row justify-start space-x-4 text-blue-700`}>
          <li className='inline-block'>
            <Link href="/about" className='hover:underline'>About</Link>
          </li>
          <li className='inline-block'>
            <Link href="/rss/feed.xml" className='hover:underline'>RSS</Link>
          </li>
        </ul>
    )
}

export default Navigation