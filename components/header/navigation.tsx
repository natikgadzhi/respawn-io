import { RSSIcon } from "components/icons";
import Link from "next/link";

type Props = {
  className?: string;
};

const NavigationLink = ({ href, children }) => (
  <Link
    href={href}
    className="whitespace-nowrap hover:underline hover:decoration-2 underline-offset-4 flex items-baseline">
    <div className="flex items-center">
      {children}
    </div>
  </Link>
);

const Navigation = ({ className }: Props) => {
  return (
    <ul
      className={`${className} text-md md:text-lg flex-row justify-start space-x-4 text-blue-700 dark:text-sky-500`}>
      <li className="inline-block">
        <NavigationLink href="/daily">TIL</NavigationLink>
      </li>
      <li className="inline-block">
        <NavigationLink href="/about">About</NavigationLink>
      </li>
      <li className="inline-block">
        <NavigationLink href="/rss/feed.xml">
          <RSSIcon/>
          RSS
        </NavigationLink>
      </li>
    </ul>
  );
};

export default Navigation;
