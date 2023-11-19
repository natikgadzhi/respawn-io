import { ChatBubbleIcon, RSSIcon, UserCircleIcon } from "components/icons";
import Link from "next/link";

type NavigationProps = {
  className?: string;
};

type NavigationLinkProps = {
  className?: string;
  href: string;
  children: React.ReactNode;
};

const NavigationLink = ({ href, className, children }: NavigationLinkProps) => (
  <Link
    href={href}
    className={`${className} whitespace-nowrap hover:underline hover:decoration-2 underline-offset-4 flex items-baseline`}>
    <div className="flex items-center space-x-1">
      {children}
    </div>
  </Link>
);

const Navigation = ({ className }: NavigationProps) => {
  return (
    <ul
      className={`${className} text-md md:text-lg flex-row justify-start space-x-4 text-blue-700 dark:text-sky-500`}>
      <li className="inline-block">
        <NavigationLink href="/about">
          <UserCircleIcon />
          <span className="pl-0.25">
            About
          </span>
        </NavigationLink>
      </li>
      <li className="inline-block">
        <NavigationLink href="/daily">
          <ChatBubbleIcon />
          <span className="pl-0.25">
            TIL
          </span>
        </NavigationLink>
      </li>
      <li className="inline-block">
        <NavigationLink href="/rss/feed.xml">
          <RSSIcon/>
          <span className="pl-0.25">
            RSS
          </span>
        </NavigationLink>
      </li>
    </ul>
  );
};

export default Navigation;
