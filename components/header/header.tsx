import { config } from "../../blog.config";

import BlogTitle from "./blog-title";
import Navigation from "./navigation";

const Header = () => {
  return (
    <section className="my-8 md:mt-12 md:mb-16">
      <div className="flex justify-between items-baseline md:items-center">
        <BlogTitle title={config.title} />

        <Navigation className="hidden md:inline-flex" />
      </div>

      <p className="flex text-left text-md md:text-lg mt-2">{config.description}</p>

      <Navigation className="my-2 inline-flex md:hidden" />
    </section>
  );
};

export default Header;
