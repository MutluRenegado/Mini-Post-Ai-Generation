import { notFound } from 'next/navigation';
import { PostDetail, postsRepository } from '@/modules/posts';

interface PostDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  // Await the params promise as required in Next.js App Router
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const post = await postsRepository.getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full">
      <PostDetail post={post} />
    </div>
  );
}
