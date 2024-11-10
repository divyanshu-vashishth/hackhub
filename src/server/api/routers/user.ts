import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure,protectedProcedure } from "../trpc";


export const userRouter = createTRPCRouter({
    updateUserDetails: protectedProcedure
    .input(z.object({
        name: z.string().optional(),
        education: 
        z.object({
            currentcollege: z.string().optional(),
            degree: z.string().optional(),
            fieldofstudy: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            description: z.string().optional(),
        }).optional(),
        experience: z.object({
            company: z.string().optional(),
            position: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            description: z.string().optional(),
            resume: z.string().optional(),
        }).optional(),
        about: z.object({
            description: z.string().optional(),
        }),
        socialLinks: z.object({
            github: z.string().optional(),
            linkedin: z.string().optional(),
            twitter: z.string().optional(),
            instagram: z.string().optional(),
        }).optional(),
        skills: z.array(z.string()),
        contact: z.object({
            email: z.string().optional(),
            phone: z.string().optional(),
            address: z.string().optional(),
        }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
        await ctx.db.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                name: input?.name,
                education: {
                    create: {
                        currentcollege: input.education?.currentcollege,
                        degree: input.education?.degree,
                        fieldofstudy: input.education?.fieldofstudy,
                        startDate: input.education?.startDate,
                        endDate: input.education?.endDate,
                        description: input.education?.description,
                    },  
                },
                experience: {
                    create: {
                        company: input.experience?.company,
                        position: input.experience?.position,
                        startDate: input.experience?.startDate,
                        endDate: input.experience?.endDate,
                        resume: input.experience?.resume,
                        description_how_you_describe_yourself: input.experience?.description,
                    },
                },
                about: {
                    create: {
                        description: input.about?.description,
                    },
                },
                socialLinks: {
                    create: {
                        github: input.socialLinks?.github,
                        linkedin: input.socialLinks?.linkedin,
                        twitter: input.socialLinks?.twitter,
                        instagram: input.socialLinks?.instagram,
                    },
                },
                skills: {
                  createMany:{
                    data: input.skills.map((skill) => ({name: skill})),
                  }
                },
                contact: {
                    create: {
                        email: input.contact?.email as string,
                        phone: input.contact?.phone as string,
                        address: input.contact?.address as string,
                    },
                },
    }});
      }),
      followUser: protectedProcedure
      .input(
        z.object({
          followingUserId: z.string(),
        })
      )
      .mutation(
        async ({ ctx: { db, session }, input: { followingUserId } }) => {
          if (followingUserId === session.user.id) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "you can't follow yourself",
            });
          }
  
          await db.user.update({
            where: {
              id: session.user.id,
            },
            data: {
              followings: {
                connect: {
                  id: followingUserId,
                },
              },
            },
          });
        }
      ),
  
    unfollowUser: protectedProcedure
      .input(
        z.object({
          followingUserId: z.string(),
        })
      )
      .mutation(
        async ({ ctx: { db, session }, input: { followingUserId } }) => {
          await db.user.update({
            where: {
              id: session.user.id,
            },
            data: {
              followings: {
                disconnect: {
                  id: followingUserId,
                },
              },
            },
          });
        }
      ),
  
    getAllFollowers: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
        })
      )
      .query(async ({ ctx: { db, session }, input: { userId } }) => {
        return await db.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            followedBy: {
              select: {
                name: true,
                id: true,
                image: true,
                followedBy: {
                  where: {
                    id: session.user.id,
                  },
                },
              },
            },
          },
        });
      }),
    getAllFollowing: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
        })
      )
      .query(async ({ ctx: { db, session }, input: { userId } }) => {
        return await db.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            followings: {
              select: {
                name: true,
                id: true,
                image: true,
              },
            },
          },
        });
      }),
      getUser: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
        })
      )
      .query(async ({ ctx: { db, session }, input: { userId } }) => {
        return await db.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            name: true,
            id: true,
            image: true,
            followedBy: {
              where: {
                id: session.user.id,
              },
            },
          },
        });
      }),

      updateUserPointsOnTheBasisOfNumberOfProjectsAndNumberOfBlogsAndNumberOfFollowers: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
        })
      )
      .mutation(async ({ ctx: { db, session }, input: { userId } }) => {
        const user = await db.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            name: true,
            image: true,
            followedBy: {
              where: {
                id: session.user.id,
              },
            },
            points: true,
            projects: {
              select: {
                id: true,
              },
            },
            posts: {
              select: {
                id: true,
              },
            },
          },
        });
        const points = (user && user.projects ? user.projects.length * 10 : 0) + (user && user.posts ? user.posts.length * 5 : 0) + (user && user.followedBy ? user.followedBy.length * 2 : 0);
        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            points: points,
          },
        
        });
      
      }),
      
      getUsersPointsTable: protectedProcedure
      .query(async ({ ctx: { db, session }}) => {
        return await db.user.findMany({
          select: {
            name: true,
            id: true,
            image: true,
            followedBy: {
              where: {
                id: session.user.id,
              },
            },
            points: true,
          },
          orderBy: {
            points: "desc",
          },
        });

      }),


      getshowableProfileofUser: publicProcedure
      .input(
        z.object({
          userId: z.string(),
        })
      )
      .query(async ({ ctx: { db, session }, input: { userId } }) => {
        return await db.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            name: true,
            id: true,
            image: true,
            followedBy: {
              where: {
                id: session?.user.id,
              },
            },
            about: {
              select: {
                description: true,
              },
            },
            socialLinks: {
              select: {
                github: true,
                linkedin: true,
                twitter: true,
                instagram: true,
              },
            },
            skills: {
              select: {
                name: true,
              },
            },
          },
        });
      }),
      
  });