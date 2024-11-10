'use client'

import Link from "next/link";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const getAllCommunities = api.community.getAllCommunities.useQuery()

  const createCommunity = api.community.createCommunity.useMutation({
    onSuccess: () => {
      console.log('succesufully created community')
    },
    onError: (error: { message: string; }) => {
      toast.error(error.message as string)
    }
  })

  const { register, handleSubmit } = useForm();

  const [showCommunityForm, setShowCommunityForm] = useState(false)
  return (
    <div className="container max-w-6xl min-h-screen mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Communities</h1>
        {showCommunityForm ? (
          <button
            className="btn btn-ghost"
            onClick={() => setShowCommunityForm(false)}
          >
            Cancel
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setShowCommunityForm(true)}
          >
            Create Community
          </button>
        )}
      </div>

      {showCommunityForm && (
        <div className="card bg-base-200 shadow-xl mb-8">
          <form
            className="card-body"
            onSubmit={handleSubmit((data) => {
              createCommunity.mutate({
                name: data.name,
                description: data.description,
              });
            })}
          >
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              placeholder="Community Name"
              {...register("name")}
            />
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              placeholder="Description"
              {...register("description")}
            />
            <button className="btn btn-primary" type="submit">
              Create Community
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getAllCommunities?.data?.map((community) => (
          <Link
            href={`/communities/${community.slug}`}
            key={community.id}
            className="card bg-base-200 hover:shadow-xl transition-shadow"
          >
            <div className="card-body">
              <h2 className="card-title">{community.name}</h2>
              <div className="text-base-content/70">{community.description}</div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Members ({community.members.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {community.members.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img src={member.image as string} alt={member.name as string} />
                        </div>
                      </div>
                      <span className="text-sm">{member.name}</span>
                    </div>
                  ))}
                  {community.members.length > 3 && (
                    <span className="text-sm text-base-content/70">
                      +{community.members.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {community.permissions && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {community.permissions.map((permission) => (
                      <div key={permission.id} className="badge badge-outline">
                        {permission.role}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
