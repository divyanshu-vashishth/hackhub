import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure,protectedProcedure } from "../trpc";
import slugify from "slugify";

const LIMIT=20;
export const projectRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx:{db} }) => {
        return db.project.findMany({
            take:LIMIT
        });
    }),
    createProject: protectedProcedure
    .input(z.object({
        title:z.string().min(1).max(100),
        description:z.string().min(10).max(500),
        link:z.string().url(),
        videoLink:z.string().url(),
        image:z.string(),
        technologies:z.array(z.string()),
        problemItSolves:z.string().min(10).max(1000),
        blogPostLink:z.string().url(),
        imageAsDataUrl: z.string().url(),
    }))
    .mutation(async ({ ctx:{db,session}, input:{title,description,link,videoLink,image,technologies,problemItSolves,blogPostLink,imageAsDataUrl} }) => {
        const slug = slugify(title, { lower: true });
        const project = await db.project.create({
            data: {
                title,
                description,
                slug,
                link,
                videoLink,
                image,
                technologies,
                problemItSolves,
                blogPostLink,
                snapshot: imageAsDataUrl,
                user: {
                    connect: {
                        id: session.user.id,
                        
                },
                
            },
        },
        });
        return project;
    }),
    likeProject:protectedProcedure
    .input(z.object({
        projectId:z.string()
    }))
    .mutation(async ({ ctx:{db,session}, input:{projectId} }) => {
        const like = await db.like.create({
            data: {
                project: {
                    connect: {
                        id: projectId,
                    },
                },
                user: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
        });
        return like;
    }),
    unlikeProject:protectedProcedure
    .input(z.object({
        projectId:z.string()
    }))
    .mutation(async ({ ctx:{db,session}, input:{projectId} }) => {
        const like = await db.like.delete({
            where: {
                userId_postId
                : {
                    userId: session.user.id,
                    postId: projectId,
                },
            },
        });
        return like;
    }),
    commentOnProject:protectedProcedure
    .input(z.object({
        projectId:z.string(),
        text:z.string().min(1).max(1000)
    }))
    .mutation(async ({ ctx:{db,session}, input:{projectId,text} }) => {
        const comment = await db.comment.create({
            data: {
                text,
                project: {
                    connect: {
                        id: projectId,
                    },
                },
                user: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
        });
        return comment;
    }),
    getCommentsOnProject:publicProcedure
    .input(z.object({
        projectId:z.string()
    }))
    .query(async ({ ctx:{db}, input:{projectId} }) => {
        const comments = await db.comment.findMany({
            where: {
                projectId,
            },
            include: {
                user: true,
            },
        });
        return comments;
    }),

    addTeamMemberToProject:protectedProcedure
    .input(z.object({
        projectId:z.string(),
        name:z.string().min(1).max(100),
        role:z.string().min(1).max(100)
    }))
    .mutation(async ({ ctx:{db,session}, input:{projectId,name,role} }) => {
        const teamMember = await db.teamMember.create({
            data: {
                name,
                role,
                project: {
                    connect: {
                        id: projectId,
                    },
                },
            },
        });
        return teamMember;
    }),

    getProject:publicProcedure
    .input(z.object({
        projectId:z.string()
    }))
    .query(async ({ ctx:{db}, input:{projectId} }) => {
        const project = await db.project.findUnique({
            where: {
                id: projectId,
            },
            include :{
                likes:true,
                comments:true,
            }
        });
        return project;
    }),
    showableProjectsSortedOnTheBasisOfLikes:publicProcedure.query(async ({ ctx:{db} }) => {
        const projects = await db.project.findMany({
            orderBy: {
                likes: {
                    _count: "desc",
                },
            },
            select: {
                id: true,
                title: true,
                description: true,
                slug: true,
                link: true,
                image: true,
                snapshot: true,
                likes: {
                    select: {
                        id: true,
                    },
                },
            },
            take:LIMIT
        });
        return projects;
    }),
    getLikesOnProject:publicProcedure
    .input(z.object({
        projectId:z.string()
    }))
    .query(async ({ ctx:{db}, input:{projectId} }) => {
        const likes = await db.like.findMany({
            where: {
                projectId,
            },
        });
        return likes;
    }), 
    });
