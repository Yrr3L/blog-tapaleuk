import Link from "next/link";
import { getAllPublishedBlog } from "./lib/notion";
import { Post } from "./types/Notion";

export default async function Home() {
  const posts = await fetchBlogData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-[672px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">List Blog</h1>

        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post: Post, index: number) => (
            <article key={index} className="bg-white rounded-lg cursor-pointer p-4 mb-4 border-b border-gray-300">
              <div>
                <span className="text-gray-500 mb-2 text-sm">{post.publishedDate.toString()}</span>
                <h2 className="text-xl font-semibold mb-2">
                  <Link className="text-blue-500 hover:underline" href={`/blog/${encodeURIComponent(post.slug)}`}>
                    {post.title}
                  </Link>
                </h2>

                <p>{post.description}</p>
                {renderContentBlocks(post.blocks)}
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

async function fetchBlogData() {
  const res = getAllPublishedBlog();
  return res;
}

function renderContentBlocks(blocks) {
  return blocks.map((block) => {
    switch (block.type) {
      case 'paragraph':
        return <p>{block.paragraph.rich_text[0]?.plain_text}</p>;
      case 'heading_1':
        return <h1>{block.heading_1.rich_text[0]?.plain_text}</h1>;
      case 'heading_2':
        return <h2>{block.heading_2.rich_text[0]?.plain_text}</h2>;
      case 'heading_3':
        return <h3>{block.heading_3.rich_text[0]?.plain_text}</h3>;
      case 'image':
        return (
          <img
            src={block.image.file.url}
            alt={block.image.caption[0]?.plain_text || 'Image'}
          />
        );
      // tambahkan penanganan untuk tipe blok lainnya seperti video, tabel, dll. sesuai kebutuhan
      default:
        return null;
    }
  });
}