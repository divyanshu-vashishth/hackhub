import Link from "next/link";
import React, { FC } from "react";
import { api } from "~/trpc/server";
import Image from "next/image";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const showableProjectsSortedOnTheBasisOfLikes =
    await api.projects.showableProjectsSortedOnTheBasisOfLikes();
  return (
    <div className="container mx-auto min-h-screen max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Showcase Projects</h1>
        <Link href="projects/new" className="btn btn-primary">
          Create Project
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {showableProjectsSortedOnTheBasisOfLikes.map((project) => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="card bg-base-200 hover:shadow-xl transition-all"
          >
            <figure className="aspect-video">
              <img
                width={600}
                height={400}
                src={project.snapshot as string}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{project.title}</h2>
              <p className="text-base-content/70 line-clamp-2">{project.description}</p>
              <div className="card-actions justify-end">
                <div className="flex items-center gap-2">
                  {project.likes.length > 0 ? (
                    <FcLike className="h-6 w-6" />
                  ) : (
                    <FcLikePlaceholder className="h-6 w-6" />
                  )}
                  <span className="font-medium">{project.likes.length}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
