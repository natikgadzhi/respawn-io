---
title: Using Contentlayer with Next.js
excerpt: |
  Contentlayer is the easiest way to setup markdown with mdx source to static website pipeline. Here's how it's implemented in respawn.io.
draft: false
created: 2023-07-10
modified: 2023-07-10
meta_description:
meta_keywords: javascript, mdx, contentlayer, nextjs
tags:
  - coding
  - contentlayer
---
# Using Contentlayer with Next.js

I've just added a new section to this blog
— [Today I Learned notes](https://respawn.io/daily). With that, I'm writing down
a few other things I've changed around, and how it works together.

## Contentlayer in a statically generated site

First off, [Contentlayer](https://contentlayer.dev). It simplified things quite
a lot. If I had half a brain left back when I started the blog, and used 11ty
instead of the monstrocity that Next.js is, Contentlayer would be an overkill.
But with Next.js, you don't get the automatic pipeline that grabs all of your
markdown files and renders them — you build that pipeline yourself.

And that generation pipeline generally consists of a few stages:

1. **Read the source files, populate and compute their fields based on
   frontmatter or whatever custom logic you want, and define your types.** For
   me, that was a `lib/posts.ts` that has just a handful of functions and made
   sure that `Post.created` is actually a date.
2. **Configure and setup a way to process markdown**. That would likely involve
   `MDX` or `next-mdx-remote` or something similar. Not too complex, but that's
   just boilerplate code. _Would be cool if you didn't have to write
   boilerplate, huh?_
3. **Rendering your content within the site URL structure** — Next.js makes that
   relatively straightforward.

Coming from the world of OG backend web frameworks (_Wait, is Rails and Symphony
OG?_), Contentlayer looks similar to what you'd call an ORM, except it's not
exactly a _relational_ mapper. You could say it's an Object Markdown Mapper
_questionmark_.

Anyway, Contentlayer allows you to specify what fields (and types) your markdown
sources have, and then it will generate the types and objects for you, including
a nice `allPosts()` or `allPages()` or `allWhateverYourTypeIs()` that fetches
them. The only thing left for you to write is a function that grabs your
processed content and sorts it.
[Here it is in this blog's repository](https://github.com/natikgadzhi/respawn-io/blob/main/app/page.tsx#L9).

To get all that, you specify your source data type and fields in a
`contentlayer.config.ts` file:

```ts
// contentlayer.config.ts

// Use defineDocumentType to describe each source file type.
// Each type will have `content` field automatically, but you can add
// `fields` that are based on frontmatter keys, and
// `computedFields` that are computed when the object is instanciated.
const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/*.md`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => `${doc._raw.sourceFileName.replace(/\.md$/, "")}`,
    },
  }
  // ...
}

// call makeSource to tell Contentlayer to actually run and generate your data
// into objects.
// This will generate a ./.contentlayer/generated directory with a bunch of typescript
// files that describe your data.
export default makeSource({
  disableImportAliasWarning: true,
  // where your content is located. Each content type's filePathPattern is relative to this.
  contentDirPath: "content/",
  // what data types to generate? In this example, there are just posts, but you can add more.
  documentTypes: [Post],

  // mdx settings to use — that's where you put all your remark and rehype plugins,
  // without the rest of the boilerplate!
  mdx: {
    remarkPlugins: [
      remarkGfm,
      [remarkFigureCaption, {captionClassName: "text-center italic"}],
      [wikilinks, {pageResolver, hrefTemplate, aliasDivider: "|"}]
    ],
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions],
      rehypeMermaid
    ]
  }
});
```

It also works well with MDX, and that comes in two pieces. First, you tell
Contentlayer that you're actually about to render some MDX, and specify what
plugins you want to use in `remark` and `rehype`:

```ts
export default makeSource({
  disableImportAliasWarning: true,
  contentDirPath: "content/",
  documentTypes: [Post, Page, Daily],

  mdx: {
    remarkPlugins: [
      remarkGfm,
      [remarkFigureCaption, { captionClassName: "text-center italic" }],
      [wikilinks, { pageResolver, hrefTemplate, aliasDivider: "|" }],
    ],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions], rehypeMermaid],
  },
});
```

And then you render your content with a component that Contentlayer makes for
you in `getMDXComponent`:

```ts
// import the function that returns an MDXComponent based on your data type's mdx content
import { getMDXComponent } from "next-contentlayer/hooks";

export default async function Post( { params }: Params ) {
  const post = allPosts.find((post) => post.slug === params.slug);

  // Get an MDXComponent that will render the post's content.
  const MDXContent = getMDXComponent(post.body.code);
  return (
    <>
      /* Pass additional mdx component specifications as needed */
      <MDXContent components={mdxComponents} />
    </>
  )
```

## Adding multiple source types to your Contentlayer configuration

So what if you want multiple types of posts, with different fields? Well, you
`defineDocumentType` several times, but then your `contentlayer.config.ts`
starts to cause pain comparable to `package.json`. So as any sane person who
dealt with an ORM before, you split it into the config itself, and the data
definition files that you can tuck away in `lib`, like this:

```ts
// lib/page.contentlayer.ts
import { defineDocumentType } from "contentlayer/source-files";
// Page is a simple type to hold the content
// of a page. Currently used in `/about`.
export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/*.md`,
  contentType: "mdx",
}));

// contentlayer.config.ts
import { Post } from "./lib/post.contentlayer";
import { Page } from "./lib/page.contentlayer";
import { Daily } from "./lib/daily.contentlayer";
```

[Here's the commit with that split for respawn.io](https://github.com/natikgadzhi/respawn-io/commit/1c778b020c2bcaaac3607a9d2bcc7e0a698dd524).

And here's the
[full contentlayer.config.ts](https://github.com/natikgadzhi/respawn-io/blob/main/contentlayer.config.ts)
— that now defines wikilinks, some other formatting, and uses `rehypePrettyCode`
for code blocks. At the time of this writing, 38 lines of code to bootstrap all
of that.

I think I've played with Next.js for a little bit too long, so I'm no longer
sure if that's actually neat, or if that's way too much. But after tinkering
with `next-mdx-remote` and friends, I'd say 38 lines for the whole mdx
conversion configuration is pretty cool.

## Links

- Here's the original [[hello-world|Hello, World!]] post for this blog.
- Read more on [Contentlayer](https://contentlayer.dev)
- More on [Rehype Pretty Code](https://rehype-pretty-code.netlify.app/) code
  highlighting — the best and most flexible I've tried so far.
- [Today I learned](https://respawn.io/daily) — a pile of short notes on how I
  broke things that day.
- [[contentlayer-mermaid-diagrams|Mermaid diagrams in a static site using MDX and Contentlayer]] — more on customizing Contentlayer to render Mermaid diagrams.
