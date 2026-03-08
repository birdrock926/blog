import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const dbUrl = (process.env.DATABASE_URL || 'file:./dev.db').replace(/^file:/, '')
const adapter = new PrismaBetterSqlite3({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      bio: 'GameLog管理者。ゲームの最新情報を発信しています。',
    },
  })
  
  console.log('Created admin user:', admin.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'rpg' },
      update: {},
      create: { name: 'RPG', slug: 'rpg', description: 'ロールプレイングゲームの情報', color: '#7c3aed' },
    }),
    prisma.category.upsert({
      where: { slug: 'action' },
      update: {},
      create: { name: 'アクション', slug: 'action', description: 'アクションゲームの情報', color: '#ef4444' },
    }),
    prisma.category.upsert({
      where: { slug: 'fps' },
      update: {},
      create: { name: 'FPS/TPS', slug: 'fps', description: 'シューターゲームの情報', color: '#f59e0b' },
    }),
    prisma.category.upsert({
      where: { slug: 'strategy' },
      update: {},
      create: { name: 'ストラテジー', slug: 'strategy', description: 'ストラテジーゲームの情報', color: '#10b981' },
    }),
    prisma.category.upsert({
      where: { slug: 'review' },
      update: {},
      create: { name: 'レビュー', slug: 'review', description: 'ゲームレビュー', color: '#3b82f6' },
    }),
    prisma.category.upsert({
      where: { slug: 'news' },
      update: {},
      create: { name: 'ニュース', slug: 'news', description: 'ゲームニュース', color: '#ec4899' },
    }),
  ])

  console.log('Created categories:', categories.map(c => c.name).join(', '))

  // Create tags
  const tagNames = ['PS5', 'Xbox', 'Nintendo Switch', 'PC', 'Steam', '攻略', 'レビュー', '無料', 'DLC', '新作']
  const tags = await Promise.all(
    tagNames.map(name => 
      prisma.tag.upsert({
        where: { slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-') },
        update: {},
        create: {
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        },
      })
    )
  )

  console.log('Created tags:', tags.map(t => t.name).join(', '))

  // Create sample posts
  const samplePosts = [
    {
      title: '2024年最も期待されるRPG TOP10',
      slug: '2024-best-rpg-top10',
      excerpt: '2024年に発売予定の期待RPGを厳選してご紹介。シリーズ最新作から新IPまで見逃せない作品が勢揃いです。',
      content: `<h2>はじめに</h2>
<p>2024年はRPGファンにとって特別な年になりそうです。数多くの期待作が発売を控えており、どれを購入しようか迷ってしまうほどです。今回は、特に注目度の高い作品TOP10をご紹介します。</p>
<h2>第1位：黄金の迷宮 II</h2>
<p>人気RPGシリーズの最新作。グラフィックが大幅に向上し、オープンワールドの広大なフィールドを自由に探索できます。ストーリーの深さも前作を大きく上回ると評判です。</p>
<h2>第2位：星間の旅人</h2>
<p>宇宙を舞台にした壮大なSF-RPG。プレイヤーの選択によってストーリーが大きく分岐し、100時間以上のプレイが楽しめます。</p>
<h2>まとめ</h2>
<p>2024年はRPGの当たり年となりそうです。ぜひ気になる作品をチェックしてみてください。</p>`,
      status: 'published',
      isFeatured: true,
      hasPrDisclosure: false,
      categorySlug: 'rpg',
    },
    {
      title: 'PS5版アクションゲーム完全攻略ガイド',
      slug: 'ps5-action-game-guide',
      excerpt: 'PS5の人気アクションゲームを完全攻略。ボス戦のコツや隠し要素も詳しく解説します。',
      content: `<h2>基本的な戦い方</h2>
<p>このゲームの基本は「回避」と「カウンター」です。敵の攻撃パターンをよく観察し、適切なタイミングで反撃することが重要です。</p>
<h2>ボス攻略</h2>
<h3>第1ボス：炎の番人</h3>
<p>炎属性の攻撃が多いため、耐火装備を整えてから挑戦しましょう。フェーズ2では攻撃パターンが変化するので注意が必要です。</p>
<h3>第2ボス：氷の女王</h3>
<p>氷属性の攻撃に対する対策が重要です。火属性の武器が非常に効果的です。</p>
<h2>隠し要素</h2>
<p>ゲーム内には多数の隠しエリアとアイテムが存在します。探索を怠らないようにしましょう。</p>`,
      status: 'published',
      isFeatured: true,
      hasPrDisclosure: false,
      categorySlug: 'action',
    },
    {
      title: '【レビュー】最新FPSゲーム徹底評価',
      slug: 'latest-fps-review',
      excerpt: '話題の最新FPSゲームを徹底的にレビュー。グラフィック、ゲームプレイ、マルチプレイヤーモードを詳しく評価します。',
      content: `<h2>概要</h2>
<p>今回レビューするのは、2024年最注目のFPSゲームです。大手デベロッパーが5年の歳月をかけて開発した意欲作で、リリース前から大きな話題を集めていました。</p>
<h2>グラフィック：9/10</h2>
<p>次世代ゲームエンジンを活用した映像表現は圧巻です。特にレイトレーシングの表現が素晴らしく、リアルな光と影の表現がゲームの没入感を高めています。</p>
<h2>ゲームプレイ：8/10</h2>
<p>銃の操作感は業界最高水準で、照準合わせからリコイルのコントロールまで非常に気持ちよく仕上がっています。</p>
<h2>マルチプレイヤー：9/10</h2>
<p>20対20の大規模戦闘は圧倒的なスケール感があります。チームワークの重要性が高く、協力して戦う楽しさが味わえます。</p>
<h2>総合評価：8.5/10</h2>
<p>グラフィック、ゲームプレイ、マルチプレイヤーすべてにおいて高い水準を達成した優秀な作品です。FPSファンなら必須の一本と言えるでしょう。</p>`,
      status: 'published',
      isFeatured: false,
      hasPrDisclosure: true,
      categorySlug: 'review',
    },
    {
      title: 'Nintendo Switchおすすめインディーゲーム2024',
      slug: 'switch-indie-games-2024',
      excerpt: 'Nintendo Switchで楽しめるインディーゲームの中から、特におすすめの作品を厳選してご紹介します。',
      content: `<h2>インディーゲームの魅力</h2>
<p>インディーゲームはアイデアとクリエイティビティが詰まった作品が多く、大手タイトルとは一味違った体験ができます。</p>
<h2>おすすめ5選</h2>
<h3>1. ピクセルダンジョン冒険記</h3>
<p>ローグライク×RPGの傑作。毎回異なるダンジョンが生成され、何度でも新鮮な体験が楽しめます。</p>
<h3>2. 農場と魔法の物語</h3>
<p>農場経営シミュレーションと魔法使いの冒険を組み合わせた独創的な作品。リラックスしながら楽しめます。</p>
<h3>3. 宇宙探索アドベンチャー</h3>
<p>広大な宇宙を探索するオープンワールドゲーム。驚異的なスケールながら、一人の開発者が作り上げた力作です。</p>
<h2>まとめ</h2>
<p>インディーゲームには大手タイトルにはない独自の魅力があります。ぜひ気になった作品を試してみてください。</p>`,
      status: 'published',
      isFeatured: false,
      hasPrDisclosure: false,
      categorySlug: 'news',
    },
    {
      title: '2024年のゲーミングPC構成おすすめガイド',
      slug: 'gaming-pc-build-guide-2024',
      excerpt: '予算別のゲーミングPC構成を解説。コスパ重視から最高性能まで、あなたに最適な構成を見つけましょう。',
      content: `<h2>ゲーミングPCの基礎知識</h2>
<p>ゲーミングPCを構築する際に最も重要なのはGPU（グラフィックカード）です。次いでCPU、RAM、ストレージの順で重要度が下がります。</p>
<h2>予算別おすすめ構成</h2>
<h3>エントリー（10万円以下）</h3>
<p>フルHD解像度でのゲームプレイが可能な構成です。最新のミドルクラスGPUと合わせることで、多くのゲームを快適にプレイできます。</p>
<h3>ミドルクラス（15〜20万円）</h3>
<p>WQHD解像度での高フレームレートプレイが可能。RTX 4070クラスのGPUと組み合わせることで、ほぼすべてのゲームを最高設定で楽しめます。</p>
<h3>ハイエンド（30万円以上）</h3>
<p>4K解像度での最高品質ゲームプレイが可能。レイトレーシングを有効にしても高フレームレートを維持できます。</p>
<h2>まとめ</h2>
<p>ゲーミングPCの構築は投資ですが、長期間使用できる資産にもなります。予算に合わせた最適な構成を選んでください。</p>`,
      status: 'published',
      isFeatured: true,
      hasPrDisclosure: true,
      categorySlug: 'news',
    },
  ]

  for (const postData of samplePosts) {
    const { categorySlug, ...rest } = postData
    const category = categories.find(c => c.slug === categorySlug)
    
    const existing = await prisma.post.findUnique({ where: { slug: rest.slug } })
    if (!existing) {
      await prisma.post.create({
        data: {
          ...rest,
          authorId: admin.id,
          publishedAt: new Date(),
          readingTime: Math.ceil(rest.content.replace(/<[^>]*>/g, '').length / 400),
          categories: category ? { connect: [{ id: category.id }] } : undefined,
          viewCount: Math.floor(Math.random() * 1000),
        },
      })
      console.log('Created post:', rest.title)
    }
  }

  // Create site settings
  const defaultSettings = {
    siteName: 'GameLog',
    siteDescription: 'ゲーム情報・レビュー・攻略情報をお届けするゲーミングメディア',
    siteUrl: 'http://localhost:3000',
  }

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    })
  }

  console.log('Seed completed successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
