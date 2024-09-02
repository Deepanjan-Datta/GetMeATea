import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import mongoose from 'mongoose';
import User from '@/models/User.js';
import Payment from '@/models/Payment.js';
import connectDB from '@/db/connectDb';

const authoptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          redirect_uri: "http://localhost:3000",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === "github") {
        await connectDB();
        let currentUser = await User.findOne({ email: email });
        if (!currentUser) {
          const newUser = new User({
            email: email,
            username: email.split("@")[0],
          });
          await newUser.save();
        }
        return true;
      }
      return false; 
    },
    async session({ session, user, token }) {
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.name = dbUser.username;
      }
      return session;
    },
  },
});

// Named exports for HTTP methods
export const GET = authoptions;
export const POST = authoptions;