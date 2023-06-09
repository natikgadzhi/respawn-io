import Link from 'next/link'
import Image from 'next/image'
import Callout from 'components/callout'

import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  a: ({ href, children }) => <Link href={href as string}>{children}</Link>,
  img: ({ src, alt }) => <Image src={src} alt={alt} />,
  Callout
}
