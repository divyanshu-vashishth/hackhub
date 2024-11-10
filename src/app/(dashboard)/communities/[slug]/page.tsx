"use client";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { api } from "~/trpc/react";
import { use } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface pageProps {
  params: Promise<{ slug: string }>;
}

const page: FC<pageProps> = ({ params }) => {
  const router = useRouter();
  const utils = api.useUtils(); // Add this line at the top of the component

  const getCommunityBySlug = api.community.getCommunityBySlug.useQuery({
    slug: use(params).slug as string,
  });

  const createCommunityMember = api.community.createCommunityMember.useMutation(
    {
      onSuccess: async () => {
        toast.success("successfully joined the community");
        getCommunityBySlug.refetch();
      },
      onError: (error) => {
        toast.error("You are already a member of this community");
      },
    },
  );

  const deleteCommunityMember = api.community.deleteCommunityMember.useMutation(
    {
      onSuccess: async () => {
        toast.success("successfully left the community");
        getCommunityBySlug.refetch();
        router.push("/communities");
      },
      onError: (error) => {
        toast.error(error.message as string);
      },
    },
  );

  const sendMessageToCommunity =
    api.message.sendMessageToCommunity.useMutation(
        {
            onSuccess: async () => {
            getCommunityMessages.refetch();
            reset();
            },
            onError: (error) => {
            toast.error(error.message as string);
            },
        },
    );

  const getCommunityMessages = api.message.getCommunityMessages.useQuery({
    communityId: getCommunityBySlug.data?.id || "",
  });

  const { register, handleSubmit, reset } = useForm();
  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="card mb-8 bg-base-200 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl">
            {getCommunityBySlug.data?.name}
          </h1>
          <div className="text-base-content/70">
            {getCommunityBySlug.data?.description}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                createCommunityMember.mutate({
                  communityId: getCommunityBySlug.data?.id as string,
                });
              }}
            >
              Join Community
            </button>
            <button
              className="btn btn-error"
              onClick={() => {
                deleteCommunityMember.mutate({
                  communityId: getCommunityBySlug.data?.id as string,
                });
              }}
            >
              Leave Community
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              Members ({getCommunityBySlug.data?.members.length})
            </h2>
            <div className="divide-y divide-base-300">
              {getCommunityBySlug.data?.members.map((member) => (
                <div key={member.id} className="flex items-center gap-4 py-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={member.image as string}
                        alt={member.name as string}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-base-content/70">
                      Points: {member.points}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Community Chat</h2>
            <div className="mb-4 max-h-[500px] space-y-4 overflow-y-auto">
              {getCommunityMessages.data?.map((message) => (
                <div key={message.id} className="chat chat-start">
                  <div className="avatar chat-image">
                    <div className="w-10 rounded-full">
                      <img
                        src={message.sender.image as string}
                        alt={message.sender.name as string}
                      />
                    </div>
                  </div>
                  <div className="chat-header">{message.sender.name}</div>
                  <div className="chat-bubble">{message.text}</div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit((data) => {
                sendMessageToCommunity.mutate({
                  communityId: getCommunityBySlug.data?.id as string,
                  text: data.text,
                });
              })}
              className="flex gap-2"
            >
              <input
                {...register("text")}
                type="text"
                placeholder="Type your message..."
                className="input input-bordered flex-1"
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
