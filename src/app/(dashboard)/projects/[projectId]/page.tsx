'use client'

import { useRouter } from 'next/navigation';
import React, { FC, use } from 'react'
import { api } from '~/trpc/react';
import Image from 'next/image';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { IoArrowBack } from 'react-icons/io5';

interface pageProps {
  params: Promise<{ projectId: string }>;
}

const page: FC<pageProps> = ({ params }) => {
  const utils = api.useUtils(); // Add this line at the top of the component

  const router = useRouter();

  const [showTextArea, setShowTextArea] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const projectId = use(params).projectId;

  const getProject = api.projects.getProject.useQuery({
    projectId,
  }, {
    enabled: !!projectId, // Only run query when projectId exists
  });

  const likeProject = api.projects.likeProject.useMutation({
    onSuccess: () => {
      utils.projects.getProject.invalidate({
        projectId: projectId as string,
      });
    },
  })

  const unlikeProject = api.projects.unlikeProject.useMutation({
    onSuccess: () => {
      utils.projects.getProject.invalidate({
        projectId: projectId as string,
      });
    },
  })

  const commentOnProject = api.projects.commentOnProject.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.projects.getCommentsOnProject.invalidate({ projectId });
      }
      setComment('');
      setShowTextArea(false);
    }
  });

  const getComments = api.projects.getCommentsOnProject.useQuery(
    { projectId },
    { 
      enabled: !!projectId, // Only run query when projectId exists
    }
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="btn btn-ghost mb-6 gap-2"
        >
          <IoArrowBack className="h-5 w-5" />
          Back to projects
        </button>

        <div className="card bg-base-200">
          <figure className="aspect-video">
            {(!!getProject.data?.snapshot) &&
           <Image
            width={600}
            height={600}
           className="h-full w-full object-cover"
           alt={getProject.data?.title}
           src={getProject.data?.snapshot as string}
         />
            }
            
          </figure>
          
          <div className="card-body">
            <h1 className="card-title text-3xl">{getProject.data?.title}</h1>
            <p className="text-base-content/70">{getProject.data?.description}</p>

            <div className="flex items-center gap-4 my-4">
              <button
                className="btn btn-outline gap-2"
                onClick={() => {
                  if (!getProject.data?.id) return;
                  getProject.data?.likes.length
                    ? unlikeProject.mutate({ projectId: getProject.data.id })
                    : likeProject.mutate({ projectId: getProject.data.id })
                }}
              >
                {getProject.data?.likes.length ? (
                  <FcLike className="h-6 w-6" />
                ) : (
                  <FcLikePlaceholder className="h-6 w-6" />
                )}
                <span>{getProject.data?.likes.length || 0}</span>
              </button>
            </div>

            <div className="divider"></div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Comments</h2>
              
              <button 
                onClick={() => setShowTextArea(true)}
                className="btn btn-primary">
                Add Comment
              </button>

              {showTextArea && (
                <div className="card bg-base-100">
                  <div className="card-body">
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="textarea textarea-bordered w-full"
                      placeholder="Write your comment..."
                    />
                    <div className="card-actions justify-end">
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          if (!projectId || !getProject.data?.id) return;
                          commentOnProject.mutate({
                            projectId: projectId,
                            text: comment,
                          });
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {getComments.data?.map((comment) => (
                  <div key={comment.id} className="card bg-base-100">
                    <div className="card-body">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{comment.user.name}</div>
                        <div className="text-sm opacity-70">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;