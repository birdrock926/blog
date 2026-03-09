import ArticleCard from './ArticleCard'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: string | null
  publishedAt?: Date | string | null
  readingTime?: number | null
  viewCount?: number
  categories?: Array<{ id: string; name: string; slug: string; color?: string | null }>
  author?: { name?: string | null; avatar?: string | null }
}

interface ArticleGridProps {
  posts: Post[]
  columns?: 2 | 3 | 4
}

export default function ArticleGrid({ posts, columns = 3 }: ArticleGridProps) {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns]

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">記事が見つかりませんでした</p>
      </div>
    )
  }

  return (
    <div className={`grid ${colClass} gap-6`}>
      {posts.map(post => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  )
}
