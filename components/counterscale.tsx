// "use client";
//
// import { useEffect } from "react";
// import { usePathname } from "next/navigation";

// This intentionally does not work yet, and it's fine.
// Counterscale tracks initial page hits, but can't yet track SPA-style navigation.
//
// export function Counterscale() {
//   const pathname = usePathname();

//   useEffect(() => {
//     console.log("trying");
//     // Make sure window and counterscale are available
//     // @ts-ignore
//     if (typeof window !== "undefined" && window.counterscale) {
//       // @ts-ignore
//       window.counterscale = {
//         q: [["trackPageview"]],
//       };
//       console.log("tracked " + pathname);
//     }
//   }, [pathname]); // Re-run when pathname changes

//   return null; // This component doesn't render anything
// }

export default function Counterscale() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
                  (function () {
                    window.counterscale = {
                      q: [["set", "siteId", "respawn-io"], ["trackPageview"]],
                    };
                  })();
                `,
        }}
      />
      <script
        id="counterscale-script"
        src="https://1ca90c7a.counterscale-a1l.pages.dev/tracker.js"
        defer
      />
    </>
  );
}
