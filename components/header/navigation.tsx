import Link from "next/link"

type Props = {
    className?: string
}

const Navigation = ({ className }: Props) => {
    return (
        <ul className={`${className} text-md md:text-lg flex-row justify-start space-x-4 text-blue-700 dark:text-sky-500`}>
          <li className='inline-block'>
            <Link href="/daily" className='hover:underline underline-offset-4'>TIL</Link>
          </li>
          <li className='inline-block'>
            <Link href="/about" className='hover: hover:underline underline-offset-4'>About</Link>
          </li>
          <li className='inline-block'>
            <Link href="/rss/feed.xml" className='hover:underline underline-offset-4'>RSS</Link>
          </li>
        </ul>
    )
}

export default Navigation
