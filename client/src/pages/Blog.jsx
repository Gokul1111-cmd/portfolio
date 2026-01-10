import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Tag,
  Clock,
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
  Filter,
  X,
  Layers,
  Mail,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { StarBackground } from "../components/StarBackground";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};

export const Blog = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState([]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
    setBookmarkedSlugs(bookmarks);
  }, []);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);

  const fetchPosts = async (cursor, append = false) => {
    const isLoadMore = Boolean(cursor);
    if (isLoadMore) setLoadingMore(true);
    else setLoadingPosts(true);
    setError(null);
    try {
      const res = await fetch(`/api/blog?limit=12${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`);
      if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);
      const data = await res.json();
      const incoming = Array.isArray(data?.posts) ? data.posts : [];
      setPosts((prev) => (append ? [...prev, ...incoming] : incoming));
      setNextCursor(data?.nextCursor || null);
    } catch (err) {
      console.error("Posts fetch error", err);
      setError(err.message);
      if (!append) {
        setPosts([]);
        setNextCursor(null);
      }
    } finally {
      if (isLoadMore) setLoadingMore(false);
      else setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set((posts || []).map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(cats)];
  }, [posts]);

  const tags = useMemo(() => {
    const allTags = new Set();
    (posts || []).forEach((p) => p.tags?.forEach((t) => allTags.add(t)));
    return ["all", ...Array.from(allTags)];
  }, [posts]);

  const filtered = useMemo(() => {
    const source = posts || [];
    return source.filter((post) => {
      const matchesQuery =
        post.title?.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
        post.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesTag = activeTag === "all" || post.tags?.includes(activeTag);
      const matchesCategory =
        activeCategory === "all" || post.category === activeCategory;
      const matchesBookmark = !showBookmarked || bookmarkedSlugs.includes(post.slug);
      return matchesQuery && matchesTag && matchesCategory && matchesBookmark;
    });
  }, [query, activeTag, activeCategory, posts, showBookmarked, bookmarkedSlugs]);

  const featured = filtered.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured);
  const trending = useMemo(
    () => [...(posts || [])].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    [posts]
  );
  const popularTags = useMemo(() => {
    const counts = new Map();
    (posts || []).forEach((p) => {
      (p.tags || []).forEach((t) => {
        counts.set(t, (counts.get(t) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [posts]);

  const series = useMemo(() => {
    const seriesSet = new Set();
    (posts || []).forEach((p) => {
      if (p.series) seriesSet.add(p.series);
    });
    return Array.from(seriesSet);
  }, [posts]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        <StarBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary w-max">
                <Sparkles size={16} />
                <span>Fresh insights from my tech journey</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl">
                Developer Chronicles
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                Deep dives into DevOps, Cloud, Full-Stack Development, Trading, and everything I&apos;m building and learning. Real code, real problems, real solutions.
              </p>
            </div>

            {/* Search & Filters compact on the right */}
            <div className="w-full lg:max-w-md xl:max-w-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-card shadow-sm">
                <Search size={20} className="text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, tags, topics..."
                  className="flex-1 bg-transparent outline-none text-sm"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                )}
              </div>
              {/* Quick filter previews (visible without opening filters) */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {categories.filter((c) => c !== "all").slice(0, 3).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full border text-xs md:text-sm transition-colors ${activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:border-primary/40"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
                {tags.filter((t) => t !== "all").slice(0, 3).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-3 py-1.5 rounded-full border text-xs md:text-sm transition-colors ${activeTag === tag
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:border-primary/40"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 rounded-lg border bg-card inline-flex items-center justify-between gap-2 hover:border-primary/40 transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <Filter size={16} />
                    Filters
                  </span>
                  {(activeTag !== "all" || activeCategory !== "all" || showBookmarked) && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                      {(activeTag !== "all" ? 1 : 0) + (activeCategory !== "all" ? 1 : 0) + (showBookmarked ? 1 : 0)}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowBookmarked(!showBookmarked)}
                  className={`px-4 py-3 rounded-lg border inline-flex items-center gap-2 transition-colors ${showBookmarked ? "bg-primary/10 border-primary text-primary" : "bg-card hover:border-primary/40"
                    }`}
                >
                  <Bookmark size={16} className={showBookmarked ? "fill-current" : ""} />
                  Bookmarked
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="space-y-4"
            >
              {/* Categories */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-muted-foreground">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${activeCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:border-primary/40"
                        }`}
                    >
                      {cat === "all" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-muted-foreground">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 15).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${activeTag === tag
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:border-primary/40"
                        }`}
                    >
                      {tag === "all" ? "All Tags" : `#${tag}`}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Filters */}
          {(activeTag !== "all" || activeCategory !== "all" || showBookmarked) && (
            <div className="flex flex-wrap gap-2">
              {activeCategory !== "all" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                  Category: {activeCategory}
                  <button onClick={() => setActiveCategory("all")}>
                    <X size={14} />
                  </button>
                </div>
              )}
              {activeTag !== "all" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                  Tag: #{activeTag}
                  <button onClick={() => setActiveTag("all")}>
                    <X size={14} />
                  </button>
                </div>
              )}
              {showBookmarked && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                  <Bookmark size={14} className="fill-current" />
                  Bookmarked
                  <button onClick={() => setShowBookmarked(false)}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <div className="space-y-12">
            {loadingPosts && posts.length === 0 && (
              <div className="text-sm text-muted-foreground">Loading articles…</div>
            )}
            {error && (
              <div className="flex items-center gap-3 text-sm text-red-500 bg-red-500/5 border border-red-500/30 rounded-md px-3 py-2">
                <span>Failed to load articles: {error}</span>
                <button
                  onClick={() => fetchPosts()}
                  className="px-2 py-1 rounded-md border border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Featured Posts */}
            {featured.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles size={16} className="text-primary" />
                  Featured Articles
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {featured.map((post) => (
                    <motion.article
                      key={post.slug}
                      className="border bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      <div className="relative h-48">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                        />
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                          Featured
                        </div>
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                            {post.category}
                          </span>
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} /> {post.readingTime}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xl font-bold leading-tight line-clamp-2">
                            {post.title}
                          </h3>
                          {bookmarkedSlugs.includes(post.slug) && (
                            <Bookmark size={20} className="text-primary fill-current flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full border border-purple-400/40 text-white text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                          <span className="inline-flex items-center gap-1">
                            <Eye size={14} /> {formatNumber(post.views)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Heart size={14} /> {formatNumber(post.likes)}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            {/* Series */}
            {series.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Layers size={16} className="text-primary" />
                  Article Series
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {series.map((s) => {
                    const seriesPosts = (posts || []).filter((p) => p.series === s);
                    return (
                      <div
                        key={s}
                        className="p-4 border bg-card rounded-lg hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold">{s}</h4>
                            <p className="text-xs text-muted-foreground">
                              {seriesPosts.length} part{seriesPosts.length > 1 ? "s" : ""}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(`/blog/${seriesPosts[0].slug}`)}
                            className="text-primary"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* All Posts */}
            <section className="space-y-6">
              {(regular.length > 0 || filtered.length === 0) && (
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    {filtered.length === 0 ? "Articles" : `All Articles (${filtered.length})`}
                  </div>
                </div>
              )}
              <div className="grid gap-6">
                {regular.map((post) => (
                  <motion.article
                    key={post.slug}
                    className="border bg-card rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer"
                    whileHover={{ x: 4 }}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    <div className="flex gap-4">
                      <div className="hidden sm:block w-40 h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          sizes="(min-width: 768px) 160px, 40vw"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                            {post.category}
                          </span>
                          {post.series && (
                            <span className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium inline-flex items-center gap-1">
                              <Layers size={12} /> {post.series} #{post.seriesOrder}
                            </span>
                          )}
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>•</span>
                          <span>{post.readingTime}</span>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold leading-tight">
                            {post.title}
                          </h3>
                          {bookmarkedSlugs.includes(post.slug) && (
                            <Bookmark size={18} className="text-primary fill-current flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 rounded-full border border-purple-400/40 text-white text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Eye size={14} /> {formatNumber(post.views)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Heart size={14} /> {formatNumber(post.likes)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-16 space-y-4">
                    <div className="text-6xl">🔍</div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">No articles found</h3>
                      <p className="text-muted-foreground">
                        {query && (
                          <>
                            No results for <span className="font-semibold text-foreground">&quot;{query}&quot;</span>
                          </>
                        )}
                        {!query && (activeTag !== "all" || activeCategory !== "all") && (
                          <>No articles match your selected filters</>
                        )}
                        {!query && activeTag === "all" && activeCategory === "all" && (
                          <>No articles available at the moment</>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setQuery("");
                        setActiveTag("all");
                        setActiveCategory("all");
                      }}
                      className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Reset all filters
                    </button>
                  </div>
                )}
              </div>

              {nextCursor && filtered.length > 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={() => fetchPosts(nextCursor, true)}
                    disabled={loadingMore}
                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {loadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="sticky top-4 space-y-6">
              {/* Trending */}
              <div className="p-6 border bg-card rounded-xl space-y-4">
                <div className="inline-flex items-center gap-2 font-semibold">
                  <TrendingUp size={18} className="text-primary" />
                  Trending
                </div>
                <div className="space-y-4">
                  {trending.slice(0, 5).map((post, idx) => (
                    <div
                      key={post.slug}
                      className="space-y-2 cursor-pointer group"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl font-bold text-muted-foreground/30">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Eye size={12} /> {formatNumber(post.views)} views
                          </div>
                        </div>
                      </div>
                      {idx < trending.length - 1 && <div className="border-b" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="p-6 border bg-card rounded-xl space-y-4">
                <div className="inline-flex items-center gap-2 font-semibold">
                  <Tag size={18} className="text-primary" />
                  Popular Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(({ tag, count }) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setActiveTag(tag);
                        setShowFilters(true);
                      }}
                      className="px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-sm transition-colors"
                    >
                      #{tag} <span className="text-xs opacity-70">({count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter moved to bottom */}
              <div className="p-6 border bg-card rounded-xl space-y-4">
                <div className="inline-flex items-center gap-2 text-primary">
                  <Mail size={20} />
                  <span className="font-semibold">Newsletter</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get the latest articles and tutorials delivered to your inbox weekly.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                />
                <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;
