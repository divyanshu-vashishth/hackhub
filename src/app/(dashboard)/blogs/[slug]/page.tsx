"use client";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { use } from "react";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { IoArrowBack } from "react-icons/io5"; 

interface pageProps {
  params: Promise<{ slug: string }>;
}

const page: FC<pageProps> = ({ params }) => {
  const router = useRouter();
  const [showTextArea, setShowTextArea] = useState(false);
  const [comment, setComment] = useState("");
  const getPost = api.post.getPost.useQuery({
    slug: use(params).slug as string,
  });

  const likePost = api.post.likePost.useMutation({
    onSuccess: () => {
      getPost.refetch();
    },
    onError: (error) => {
      toast.error(error.message as string);
    },
  });

  const disLikePost = api.post.disLikePost.useMutation({
    onSuccess: () => {
      getPost.refetch();
    },
    onError: (error) => {
      toast.error(error.message as string);
    },
  });
  const submitComment = api.post.submitComment.useMutation({
    onSuccess: () => {
      getComments.refetch();
    },
    onError: (error) => {
      toast.error(error.message as string);
    },
  });

  const getComments = api.post.getComments.useQuery({
    postId: getPost.data?.id || "",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button 
        onClick={() => router.back()} 
        className="mb-6 flex items-center gap-2"
      >
        <IoArrowBack className="h-5 w-5" />
        <span>Back to posts</span>
      </button>

      {getPost.isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
        </div>
      ) : (
        <article className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">
            {getPost.data?.title}
          </h1>

          <div className="flex items-center space-x-4">
            <img
              className="h-12 w-12 rounded-full object-cover"
              src={getPost.data?.author.image as string}
              alt={getPost.data?.author.name as string}
            />
            <div>
              <div className="font-medium">{getPost.data?.author.name}</div>
              <div className="text-sm text-gray-500">
                {new Date(getPost.data?.createdAt || "").toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <img
              className="h-full w-full object-cover"
              alt={getPost.data?.title}
              src={getPost.data?.featuredImage as string}
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl ">{getPost.data?.description}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            {getPost.data?.text}
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="flex items-center space-x-2 rounded-full bg-gray-100 px-4 py-2 transition hover:bg-gray-200"
              onClick={() =>
                getPost.data?.likes?.length
                  ? disLikePost.mutate({ postId: getPost.data?.id as string })
                  : likePost.mutate({ postId: getPost.data?.id as string })
              }
            >
              {getPost.data?.likes?.length ? (
                <FcLike className="h-6 w-6" />
              ) : (
                <FcLikePlaceholder className="h-6 w-6" />
              )}
              <span className="font-medium">{getPost.data?.likes?.length || 0}</span>
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Comments</h2>
            
            <button
              onClick={() => setShowTextArea(!showTextArea)}
              className="btn btn-primary"
            >
              Add Comment
            </button>

            {showTextArea && (
              <div className="space-y-2">
                <textarea
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Write your comment..."
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  onClick={() => {
                    submitComment.mutate({
                      text: comment,
                      postId: getPost.data?.id as string,
                    });
                    setComment("");
                    setShowTextArea(false);
                  }}
                  className="btn btn-secondary"
                  disabled={!comment.trim()}
                >
                  Submit
                </button>
              </div>
            )}

            <div className="space-y-4">
              {getComments.data?.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg  p-2"
                >
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="font-medium">{comment.user.name}</div>
                    <div className="text-sm ">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="mt-2">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default page;
