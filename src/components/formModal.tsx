"use client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import React from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
export function MyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [featuredImageAsDataUrl, setFeaturedImageAsDataUrl] = React.useState<
    string | null
  >(null);
  const createPost = api.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("successfully created");
      closeModal();
      router.refresh();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleChangeFeaturedImage = async (
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
          const featuredImageAsDataUrl = fileReader.result as string;
          setFeaturedImageAsDataUrl(featuredImageAsDataUrl);
        }
      };
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8">
        <button
          type="button"
          onClick={openModal}
          className="btn btn-outline flex items-center gap-2 rounded-full"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Write Post
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 " onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-85" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full border max-w-2xl transform overflow-hidden rounded-2xl p-6 shadow-xl transition-all">
                  <DialogTitle as="h3" className="mb-6 text-2xl font-bold">
                    Create New Blog Post
                  </DialogTitle>

                  <form
                    className="space-y-6"
                    onSubmit={handleSubmit((data) => {
                      return createPost.mutate(
                        {
                          description: data.description,
                          title: data.title,
                          text: data.text,
                          featuredImageAsDataUrl:
                            featuredImageAsDataUrl as string,
                        },
                        {
                          onSuccess: () => {
                            toast.success("successfully created");
                            reset();
                          },
                        },
                      );
                    })}
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <input
                        className="w-full rounded-lg border px-4 py-2"
                        type="text"
                        placeholder="Enter post title"
                        {...register("title", {
                          required: "Title is required",
                        })}
                      />
                      {/* {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>} */}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <input
                        className="w-full rounded-lg border px-4 py-2"
                        type="text"
                        placeholder="Brief description of your post"
                        {...register("description", {
                          required: "Description is required",
                        })}
                      />
                      {/* {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>} */}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content</label>
                      <textarea
                        className="w-full rounded-lg border px-4 py-2"
                        rows={8}
                        placeholder="Write your post content..."
                        {...register("text", {
                          required: "Content is required",
                        })}
                      />
                      {/* {errors.text && <span className="text-sm text-red-500">{errors.text.message}</span>} */}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Featured Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          className="hidden"
                          id="featured-image"
                          accept="image/*"
                          {...register("featuredImageAsDataUrl", {
                            required: "Featured image is required",
                          })}
                          onChange={handleChangeFeaturedImage}
                        />
                        <label
                          htmlFor="featured-image"
                          className="btn btn-outline"
                        >
                          Choose Image
                        </label>
                        {featuredImageAsDataUrl && (
                          <span className="text-sm text-green-600">
                            Image selected
                          </span>
                        )}
                      </div>
                      {/* {errors.featuredImageAsDataUrl && <span className="text-sm text-red-500">{errors.featuredImageAsDataUrl.message}</span>} */}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          reset();
                          closeModal();
                        }}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Publish Post
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
