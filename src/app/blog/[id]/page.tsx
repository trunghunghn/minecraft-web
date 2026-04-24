import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const post = await prisma.post.findUnique({
        where: { id, published: true },
        include: {
            author: { select: { id: true, name: true, image: true } }
        }
    });

    if (!post) notFound();

    const relatedPosts = await prisma.post.findMany({
        where: { published: true, id: { not: post.id } },
        take: 3,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, category: true, createdAt: true, imageUrl: true }
    });

    return (
        <div className="min-h-screen bg-[#1e1e1e]">
            {/* Header */}
            <div className="border-b border-white/5 bg-[#161616] px-6 py-4 flex items-center gap-4">
                <Link href="/blog" className="mc-button flex items-center gap-2 py-2 text-sm px-4">
                    <ArrowLeft size={16} /> BLOG
                </Link>
                <span className="text-gray-500 text-sm">/</span>
                <span className="text-gray-400 text-sm line-clamp-1">{post.title}</span>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Category badge */}
                {post.category && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 bg-green-600/20 border border-green-500/30 px-3 py-1 rounded-full text-xs text-green-400 font-bold">
                            <Tag size={12} /> {post.category}
                        </div>
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                    {post.title}
                </h1>

                {/* Meta */}
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-8 pb-8 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        {post.author.image ? (
                            <img src={post.author.image} className="w-7 h-7 rounded border border-white/10" alt="" />
                        ) : (
                            <div className="w-7 h-7 rounded bg-green-700 flex items-center justify-center">
                                <User size={14} />
                            </div>
                        )}
                        <span>{post.author.name || "Ẩn danh"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                            year: "numeric", month: "long", day: "numeric"
                        })}
                    </div>
                </div>

                {/* Cover image */}
                {post.imageUrl && (
                    <div className="mb-10 rounded-xl overflow-hidden border border-white/5">
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-72 object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <article className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {post.content}
                </article>

                {/* Related posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-white/5">
                        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                            Bài viết liên quan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedPosts.map(p => (
                                <Link key={p.id} href={`/blog/${p.id}`}
                                    className="mc-card p-4 group hover:border-green-700/60 transition-colors">
                                    {p.imageUrl && (
                                        <div className="h-32 rounded overflow-hidden mb-3">
                                            <img src={p.imageUrl} alt={p.title}
                                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                    <div className="text-xs text-green-500 mb-1 font-bold">{p.category}</div>
                                    <h3 className="text-sm font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2">
                                        {p.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
