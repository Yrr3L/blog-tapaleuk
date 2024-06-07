import { NotionRenderer } from "@notion-render/client";
const { Client } = require("@notionhq/client");

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getAllPublishedBlog = async () => {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "status",
      select: {
        equals: "Published",
      },
    },
    sorts: [
      {
        property: "createdTime",
        direction: "descending",
      },
    ],
  });

  const allPosts = posts.results;

  // Fetch full content for each post
  const detailedPosts = await Promise.all(allPosts.map(async (post: any) => {
    const content = await getPageContent(post);
    return content;
  }));

  return detailedPosts;
};

export const getSinglePost = async (slug: string) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "slug",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });

  const singlePost = response.results[0];

  const responseBlockPages = await notion.blocks.children.list({
    block_id: singlePost.id,
  });

  const content = responseBlockPages.results;
  const renderer = new NotionRenderer({
    client: notion,
  });
  const html = await renderer.render(...content);

  return {
    ...getPageContent(singlePost),
    content: html,
  };
};

const getPageContent = async (post: any) => {
  const responseBlockPages = await notion.blocks.children.list({
    block_id: post.id,
  });

  const content = responseBlockPages.results;
  return {
    id: post.id,
    title: post.properties.title.title[0].plain_text,
    author: post.properties.author.select.name,
    publishedDate: post.properties.publishedDate.date.start,
    slug: post.properties.slug.formula.string,
    description: post.properties.description.rich_text[0].plain_text,
    blocks: content, // include content blocks
  };
};