import { Post } from '../types/post.types';

const globalForPosts = globalThis as unknown as {
  postsStore: Post[] | undefined;
};

// Initial seed posts so the feed is never empty on startup
const initialPosts: Post[] = [
  {
    id: "1",
    title: "Building Resilient Next.js Apps with Server Actions",
    content: "Combining Server Actions, Zod validation, and domain-driven design ensures that your application fails gracefully and recovers without breaking the client UI.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    title: "Why Modular Architecture Outperforms Global Folders",
    content: "Grouping components, actions, types, and DB logic into dedicated feature modules keeps codebases maintainable as team size and complexity scale.",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  }
];

if (!globalForPosts.postsStore) {
  globalForPosts.postsStore = initialPosts;
}

export const postsStore: Post[] = globalForPosts.postsStore;
