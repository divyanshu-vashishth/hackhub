import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure,protectedProcedure } from "../trpc";
import slugify from "slugify";
import Error from "next/error";


export const communityRouter = createTRPCRouter({
    createCommunity: protectedProcedure
    .input(z.object({
        name:z.string().min(1).max(50),
        description:z.string().min(10).max(100),
    }))
    .mutation(async ({ ctx:{db,session}, input:{name,description} }) => {
        const slug = slugify(name, { lower: true });
        const community = await db.community.create({
            data:{
                name,
                description,
                slug,
                members:{
                    connect:{
                        id:session.user.id
                    }
                },
                permissions:{
                    create:{
                        role:"ADMIN"
                    }
                }
            }
        });
        return community;
    }),
    getCommunity:publicProcedure
    .input(z.object({
        communityId:z.string()
    }))
    .query(async ({ ctx:{db}, input:{communityId} }) => {
        const community = await db.community.findUnique({
            where: {
                id: communityId,
            },
            include :{
                members:true,
                permissions:true,
            }
        });
        return community;
    }),
    getAllCommunities:publicProcedure
    .query(async ({ ctx:{db} }) => {
        const communities = await db.community.findMany({
            include :{
                members:true,
                permissions:true,
            }
        });
        return communities;
    }),

    getCommunityBySlug:publicProcedure
    .input(z.object({
        slug:z.string()
    }))
    .query(async ({ ctx:{db}, input:{slug} }) => {
        const community = await db.community.findUnique({
            where: {
                slug: slug,
            },
            include :{
                members:true,
                permissions:true,
            }
        });
        return community;
    }),

    createCommunityMember: protectedProcedure
    .input(z.object({
        communityId:z.string(),
    }))
    .mutation(async ({ ctx:{db,session}, input:{communityId} }) => {
        const community = await db.community.findUnique({
            where: {
                id: communityId,
            },
            include :{
                members:true,
                permissions:true,
            }
        });
        if(!community){
            throw new TRPCError({code:"NOT_FOUND",message:"Community not found"});
        }
        const member = await db.user.findUnique({
            where: {
                id: session.user.id,
            },
            include :{
                communities:true,
            }
        });
        if(!member){
            throw new TRPCError({code:"NOT_FOUND",message:"User not found"});
        }
        const isMember = member.communities.find((community)=>community.id === communityId);
        if(isMember){
            //  don't show trpc error to user
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User is already a member of this community"
            });
        }
        const newMember = await db.user.update({
            where: {
                id: session.user.id,
            },
            data:{
                communities:{
                    connect:{
                        id:communityId
                    }
                }
            },
            include :{
                communities:true,
            }
        });
        return newMember;
    }),
    deleteCommunityMember: protectedProcedure
    .input(z.object({
        communityId:z.string(),
    }))
    .mutation(async ({ ctx:{db,session}, input:{communityId} }) => {
        const community = await db.community.findUnique({
            where: {
                id: communityId,
            },
            include :{
                members:true,
                permissions:true,
            }
        });
        if(!community){
            throw new TRPCError({code:"NOT_FOUND",message:"Community not found"});
        }
        const member = await db.user.findUnique({
            where: {
                id: session.user.id,
            },
            include :{
                communities:true,
            }
        });
        if(!member){
            throw new TRPCError({code:"NOT_FOUND",message:"User not found"});
        }
        const isMember = member.communities.find((community)=>community.id === communityId);
        if(!isMember){
            throw new TRPCError({
                code : "PARSE_ERROR",
                message:"User is not a member of this community"
            });
        }
        const newMember = await db.user.update({
            where: {
                id: session.user.id,
            },
            data:{
                communities:{
                    disconnect:{
                        id:communityId
                    }
                }
            },
            include :{
                communities:true,
            }
        });
        return newMember;
    }),
})
