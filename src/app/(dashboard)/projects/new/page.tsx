'use client'

import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from '~/trpc/react';

interface pageProps {
  
}

const page: FC<pageProps> = ({  }) => {
  const [imageAsDataUrl, setImageAsDataUrl] = useState<string | null>(null);
  const createProject = api.projects.createProject.useMutation({
    onSuccess: () => {
      toast.success('Project created successfully');
    },
    onError: (error) => {
      toast.error(error.message as string);
    }
  });

  const [projectId, setProjectId] = useState<string | null>(null);

  const addTeamMemberToProject = api.projects.addTeamMemberToProject.useMutation({
    onSuccess: () => {
      toast.success('Team member added successfully');
    },
    onError: (error) => {
      toast.error(error.message as string);
    }

  
  });

  const handleChangeImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 1.5 * 1000000) {
        return toast.error("images size should not be greater than 1MB");
      }
      const fileReader = new FileReader();
      URL.createObjectURL(file);
      fileReader.readAsDataURL(file);

      fileReader.onloadend = () => {
        if (fileReader.result) {
          const imageAsDataUrl = fileReader.result as string;
          setImageAsDataUrl(imageAsDataUrl);
        }
      };
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {!createProject.data?.id ? (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center">Create New Project</h1>
            <div className="card bg-base-200">
              <form className="card-body space-y-4" onSubmit={handleSubmit((data) => {
                return createProject.mutate({
                  title: data.title,
                  description: data.description,
                  link: data.link,
                  videoLink: data.videoLink,
                  image: data.image,
                  technologies: data.technologies.split(','),
                  problemItSolves: data.problemItSolves,    // Remove default value
                  blogPostLink: data.blogPostLink,          // Remove default value
                  imageAsDataUrl: imageAsDataUrl as string,
                });
              })}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Project Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project title"
                    className="input input-bordered"
                    {...register('title', { required: true })}
                  />
                  {errors.title && <span className="text-error text-sm mt-1">This field is required</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project description"
                    className="input input-bordered"
                    {...register('description', { required: true })}
                  />
                  {errors.description && <span className="text-error text-sm mt-1">This field is required</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Link</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project link"
                    className="input input-bordered"
                    {...register('link', { required: true })}
                  />
                  {errors.link && <span className="text-error text-sm mt-1">This field is required</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Video Link</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project video link"
                    className="input input-bordered"
                    {...register('videoLink', { required: true })}
                  />
                  {errors.videoLink && <span className="text-error text-sm mt-1">This field is required</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Image</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project image"
                    className="input input-bordered"
                    {...register('image', { required: true })}
                  />
                  {errors.image && <span className="text-error text-sm mt-1">This field is required</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Technologies</span>
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js, TypeScript..."
                    className="input input-bordered"
                    {...register('technologies', { required: true })}
                  />
                  <label className="label">
                    <span className="label-text-alt">Separate technologies with commas</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Project Screenshot</span>
                  </label>
                  <input
                          type="file"
                          id="project-image"
                          accept="image/*"
                          {...register('imageAsDataUrl', { required: true })}
                          onChange={handleChangeImage}
                        />
                </div>

                {/* Add these missing required fields */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Problem It Solves</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="What problem does your project solve?"
                    {...register('problemItSolves', { 
                      required: "Please explain what problem your project solves" 
                    })}
                  />
                  {errors.problemItSolves && 
                    <span className="text-error text-sm mt-1">{errors.problemItSolves.message as string}</span>
                  }
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Blog Post Link</span>
                  </label>
                  <input
                    type="url"
                    className="input input-bordered"
                    placeholder="Link to your blog post about this project"
                    {...register('blogPostLink', { 
                      required: "Please provide a link to your blog post" 
                    })}
                  />
                  {errors.blogPostLink && 
                    <span className="text-error text-sm mt-1">{errors.blogPostLink.message as string}</span>
                  }
                </div>

                <div className="flex gap-4 mt-6">
                  <button type="submit" className="btn btn-primary flex-1">
                    Create Project
                  </button>
                  <button type="reset" onClick={() => reset()} className="btn btn-ghost">
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-8 text-center">Add Team Members</h2>
            <div className="card bg-base-200">
              <form className="card-body space-y-4" onSubmit={handleSubmit((data) => {
                return addTeamMemberToProject.mutate(
                  {
                    projectId: createProject.data?.id as string,
                    name: data.name,
                    role: data.role,
                  },
                  {
                    onSuccess: () => {
                      reset()
                      toast.success('Team member added successfully');
                    },
                  }
                )
              })}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Member Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    {...register('name', { required: true })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    {...register('role', { required: true })}
                  />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    Add Member
                  </button>
                  <button type="reset" onClick={() => reset()} className="btn btn-ghost">
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default page;