"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [users, setUsers] = React.useState([]);
  const [updatedYourPoints, setUpdatedYourPoints] = useState(true);
  const router = useRouter();

  const session = api.auth.getSession.useQuery();

  const updateUserPointsOnTheBasisOfNumberOfProjectsAndNumberOfBlogsAndNumberOfFollowers =
    api.user.updateUserPointsOnTheBasisOfNumberOfProjectsAndNumberOfBlogsAndNumberOfFollowers.useMutation(
      {},
    );

  const getUsersPointsTable = api.user.getUsersPointsTable.useQuery();
  return (
    <div className="container max-w-6xl min-h-screen mx-auto py-8 px-4">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Builders Leaderboard</h1>
              <p className="mt-2 text-base-content/70">
                Rankings based on projects, blogs and community contributions
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                updateUserPointsOnTheBasisOfNumberOfProjectsAndNumberOfBlogsAndNumberOfFollowers.mutate(
                  { userId: session.data?.user.id as string },
                  {
                    onSuccess() {
                      setUpdatedYourPoints(true);
                      toast.success("Points updated successfully");
                    },
                    onError(error) {
                      toast.error(error.message);
                    },
                  }
                );
              }}
            >
              Update My Points
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Builder</th>
                  <th>Points</th>
                  <th>Followers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getUsersPointsTable.data?.map((person, index) => (
                  <tr key={person.id} className="hover">
                    <td>
                      <div className="font-bold">{index + 1}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={person.image as string} alt={person.name as string} />
                          </div>
                        </div>
                        <div className="font-bold">{person.name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-primary badge-lg">{person.points}</div>
                    </td>
                    <td>{person.followedBy.length}</td>
                    <td>
                      <Link href={`/profile/${person.id}`} className="btn btn-ghost btn-sm">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
