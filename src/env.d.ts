/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "@microflash/remark-figure-caption" {
  import type { Plugin } from "unified";
  interface Options {
    captionClassName?: string;
  }
  const remarkFigureCaption: Plugin<[Options?]>;
  export default remarkFigureCaption;
}
