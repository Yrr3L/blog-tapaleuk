import { getSinglePost } from "../lib/notion";
import Link from "next/link";

export default function Page({ post }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-[672px] mx-auto">
        <Link href="/" className="text-blue-500">
          &lt; Go Back
        </Link>
        <div className="my-4">
          <span className="text-gray-600">
            {post.publishedDate} | By {post.author}{" "}
          </span>
        </div>
        <h1 className="text-6xl text-gray-900 font-bold my-6">{post.title}</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
    </main>
  );
}

export async function getStaticPaths() {
  // Generate paths based on data from API
  // Example:
  // const paths = [{ params: { slug: 'first-post' }}, { params: { slug: 'second-post' }}];
  // return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = await fetchBlogData(params.slug);
  return {
    props: {
      post,
    },
  };
}

async function fetchBlogData(slug) {
  const res = await getSinglePost(slug);
  return res;
}
