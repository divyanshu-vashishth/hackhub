import { createTRPCRouter,protectedProcedure,publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";


export const messageRouter = createTRPCRouter({
    sendMessageToCommunity: protectedProcedure
    .input(z.object({
        communityId: z.string(),
        text: z.string(),
    }))
    .mutation(async ({input,ctx}) => {
        const {communityId,text} = input;
        const message = await ctx.db.message.create({
            data: {
                text,
                senderId: ctx.session.user.id,
                communityId,
            }
        })
        return message;
    }),
    sendMessageToUser: protectedProcedure
    .input(z.object({
        recipientId: z.string(),
        text: z.string(),
    }))
    .mutation(async ({input,ctx}) => {
        const {recipientId,text} = input;
        const message = await ctx.db.message.create({
            data: {
                text,
                senderId: ctx.session.user.id,
                recipientId,
            }
        })
        return message;
    }),
    getMessages: protectedProcedure
    .input(z.object({
        communityId: z.string().optional(),
        recipientId: z.string().optional(),
    }))
    .query(async ({input,ctx}) => {
        const {communityId,recipientId} = input;
        if(communityId){
            const messages = await ctx.db.message.findMany({
                where: {
                    communityId,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 20,
            })
            return messages;
        }
        if(recipientId){
            const messages = await ctx.db.message.findMany({
                where: {
                    OR: [
                        {
                            senderId: ctx.session.user.id,
                            recipientId,
                        },
                        {
                            senderId: recipientId,
                            recipientId: ctx.session.user.id,
                        }
                    ]
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 20,
            })
            return messages;
        }
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You must provide either a communityId or a recipientId',
        })
    }),
    getCommunityMessages: protectedProcedure
    .input(z.object({
        communityId: z.string(),
    }))
    .query(async ({input,ctx}) => {
        const {communityId} = input;
        const messages = await ctx.db.message.findMany({
            where: {
                communityId,
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                sender: true,
            },
            take: 20,
        })
        return messages;
    }),
    getUserMessages: protectedProcedure
    .input(z.object({
        recipientId: z.string(),
    }))
    .query(async ({input,ctx}) => {
        const {recipientId} = input;
        const messages = await ctx.db.message.findMany({
            where: {
                OR: [
                    {
                        senderId: ctx.session.user.id,
                        recipientId,
                    },
                    {
                        senderId: recipientId,
                        recipientId: ctx.session.user.id,
                    }
                ]
            },
            include: {
                 sender:{
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        }}
                 },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20,
        })
        return messages;
    }),
})