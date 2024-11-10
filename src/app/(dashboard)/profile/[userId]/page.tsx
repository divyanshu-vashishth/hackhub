'use client'
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { api } from '~/trpc/react';
import {use } from 'react';
import toast from 'react-hot-toast';
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';


interface pageProps {
  params: Promise<{ userId: string }>;
  
}

const page: FC<pageProps> = ({ params }) => {
  const [userIsOwner, setUserIsOwner] = useState(false);

  const {data:session} = api.auth.getSession.useQuery();


  const { register, handleSubmit } = useForm();

  const router = useRouter();

  const userId = use(params).userId;
  console.log(userId);
  const showableProfileofUser = api.user.getshowableProfileofUser.useQuery({
    userId: userId as string,
  });

  const followUser = api.user.followUser.useMutation();

  const unfollowUser = api.user.unfollowUser.useMutation();

  const getAllFollowers = api.user.getAllFollowers.useQuery({
    userId: userId as string,
  });

  const getAllFollowing = api.user.getAllFollowing.useQuery({
    userId: userId as string,
  });

  const sendMessageToUser = api.message.sendMessageToUser.useMutation(
    {
      onSuccess: () => {
        toast.success('message sent')
      },
    }
  );

  const getUserMessages = api.message.getUserMessages.useQuery({
    recipientId: userId as string,
  },
  {
    enabled: !!userId,
  });

  useEffect(() => {
    if (showableProfileofUser.data?.id === userId) {
      setUserIsOwner(true);
    } else {
      setUserIsOwner(false);
    }
  }, [showableProfileofUser.data?.id, userId]);
  


  const ifNotFollowed = getAllFollowers.data?.followedBy?.every(
    (follower) => follower.id !== session?.user.id 
  );

  const ifAlReadyFollowed = getAllFollowers.data?.followedBy?.some(
    (follower) => follower.id === session?.user.id
  );

 
  const [openForm, setOpenForm] = useState(false);
  const [openMessagePortal, setOpenMessagePortal] = useState(false);
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={showableProfileofUser.data?.image as string} alt="Profile" />
                </div>
              </div>
              
              <h2 className="card-title text-2xl mb-2">{showableProfileofUser.data?.name}</h2>
              <p className="text-base-content/70">{showableProfileofUser.data?.about?.description}</p>

              <div className="flex gap-4 my-4">
                {showableProfileofUser.data?.socialLinks?.github && (
                  <a href={showableProfileofUser.data.socialLinks.github} className="btn btn-ghost btn-sm">
                    <FaGithub className="text-xl" />
                  </a>
                )}
                {/* Similar buttons for other social links */}
              </div>

              <div className="stats shadow">
                <div className="stat place-items-center">
                  <div className="stat-title">Following</div>
                  <div className="stat-value">{getAllFollowing.data?.followings?.length}</div>
                </div>
                <div className="stat place-items-center">
                  <div className="stat-title">Followers</div>
                  <div className="stat-value">{getAllFollowers.data?.followedBy?.length}</div>
                </div>
              </div>

              {!userIsOwner && (
                <div className="card-actions justify-center mt-4">
                  {ifNotFollowed ? (
                    <button className="btn btn-primary" onClick={() => followUser.mutateAsync({ followingUserId: userId })}>
                      Follow
                    </button>
                  ) : (
                    <button className="btn btn-outline" onClick={() => unfollowUser.mutateAsync({ followingUserId: userId })}>
                      Unfollow
                    </button>
                  )}
                  <button className="btn btn-ghost" onClick={() => setOpenForm(true)}>
                    Send Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills & Messages Section */}
        <div className="lg:col-span-2">
          {/* Skills Card */}
          <div className="card bg-base-200 shadow-xl mb-6">
            <div className="card-body">
              <h3 className="card-title">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {showableProfileofUser.data?.skills?.map((skill) => (
                  <span key={skill.name} className="badge badge-primary badge-lg">{skill.name}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Section */}
          {userIsOwner && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">Messages</h3>
                <div className="space-y-4">
                  {getUserMessages.data?.map((message) => (
                    <div key={message.id} className="chat chat-start">
                      <div className="chat-header">
                        {message.sender.name}
                      </div>
                      <div className="chat-bubble">{message.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default page;