import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure,protectedProcedure } from "../trpc";
import slugify from "slugify";



const LIMIT=20;
export const postRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx:{db} }) => {
        return db.post.findMany({
            take:LIMIT
        });
    }),


    createPost: protectedProcedure
    .input(z.object({
        title:z.string().min(1).max(50),
        description:z.string().min(10).max(100),
        text:z.string().min(10).max(1000),
        featuredImageAsDataUrl: z.string().url(),
    }))
    .mutation(async ({ ctx:{db,session}, input:{title,description,text,featuredImageAsDataUrl} }) => {


        const slug = slugify(title, { lower: true });
   
        const post = await db.post.create({
            data: {
                title,
                description,
                slug,
                featuredImage: featuredImageAsDataUrl,
                text,
                author: {
                    connect: {
                        id: session.user.id,
                },
            },
        },
        });
        return post;
    }),
    updatePostFeaturedImage: protectedProcedure
    .input(z.object({
        postId:z.string(),
        imageUrl:z.string().url(),
    }))
    .mutation(async ({ ctx:{db,session}, input:{postId,imageUrl} }) => {
        const postData = await db.post.findUnique({
            where: {
              id: postId,
            },
          });
  
          if (postData?.authorId !== session.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "you are not owner of this post",
            });
          }
        const post = await db.post.update({
            where: {
                id: postId,
            },
            data: {
                featuredImage: imageUrl,
            },
        });
        return post;
    }),
    // input:{limit,skip}
    getPostsOnTheBasisOfLikes: publicProcedure
    .input(z.object({
        limit:z.number().min(1).max(100),
        skip:z.number().min(0),
    }))
    .query(async ({ ctx:{db}, input:{limit,skip}  }) => {
        const posts = await db.post.findMany({
            take:limit,
            skip:skip,
            orderBy: {
                likes: {
                  _count: "desc",
                },
              },
              include: {
                likes: true,
              },
        });
        return posts;
    }),
    getPost: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx: { db, session }, input: { slug } }) => {
      const post = await db.post.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
          description: true,
          title: true,
          text: true,
          likes: session?.user?.id
            ? {
                where: {
                  userId: session?.user?.id,
                },
              }
            : false,
          authorId: true,
          slug: true,
          featuredImage: true,
          createdAt: true,
          updatedAt: true,
          comments: {
            select: {
              id: true,
              text: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              createdAt: "desc",
            }
        },
        author: {
          select: {
            id: true,
            name: true,
            // email: true,
            image: true,
          },
        },
      },
      });

      return post;
    }),

  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { db, session }, input: { postId } }) => {
      await db.like.create({
        data: {
          userId: session.user.id,
          postId,
        },
      });
    }),
    disLikePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { db, session }, input: { postId } }) => {
      await db.like.delete({
        where: {
          userId_postId: {
            postId: postId,
            userId: session.user.id,
          },
        },
      });
    }),
    submitComment: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { db, session }, input: { text, postId } }) => {
      await db.comment.create({
        data: {
          text,
          user: {
            connect: {
              id: session.user.id,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        },
      });
    }),

  getComments: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx: { db }, input: { postId } }) => {
      const comments = await db.comment.findMany({
        where: {
          postId,
        },
        select: {
          id: true,
          text: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return comments;
    }),
});