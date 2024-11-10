import React, { FC } from 'react'
import Image from 'next/image'
import { api } from '~/trpc/server';
import { MyModal } from '~/components/formModal';
import Link from 'next/link';

interface pageProps {
  
}

const page: FC<pageProps> = async ({ }) => {
  const getPostsOnTheBasisOfLikes = await api.post.getPostsOnTheBasisOfLikes(
    { limit: 10, skip: 0 },
  )

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Latest Blog Posts</h1>
          <MyModal />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {getPostsOnTheBasisOfLikes.map((post) => (
            <Link
              href={`blogs/${post.slug}`}
              key={post.slug}
              className="group card-bordered overflow-hidden rounded-xl shadow-md  transition-all hover:shadow-lg"
            >
              <div className="aspect-video overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={600}
                  height={400}
                  src={post.featuredImage as string}
                  alt={post.title}
                />
              </div>
              <div className="p-6">
                <h2 className="mb-2 text-xl font-semibold  line-clamp-2">
                  {post.title}
                </h2>
                <p className="mb-4 text-gray-600 line-clamp-3">
                  {post.description}
                </p>
                <div className="flex items-center text-blue-600">
                  Read more
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page;