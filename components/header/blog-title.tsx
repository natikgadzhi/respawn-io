import { useRouter } from "next/router";
import Link from "next/link";

type Props = {
    title: String
}

const BlogTitle = ({ title }: Props) => {
    const router = useRouter();

    return (
        <h2 className="inline-flex text-xl md:text-2xl font-bold tracking-tighter leading-tight">
          {router.asPath === "/" ? (
            title
          ) : (
            <Link href="/" className="hover:underline underline-offset-4">
              {title}
            </Link>
          )}
        </h2>
    )
}

export default BlogTitle