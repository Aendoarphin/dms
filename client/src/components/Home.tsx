import { Search, Clock, Filter, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import useArticles from "@/hooks/useArticles";
import Loader from "./Loader";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("recent");
  const [refresh] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`) || "")
  );

  const articles = useArticles(refresh);
  const navigate = useNavigate();

  // Load recently viewed articles from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem(currentUser.user.id);
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    }
  }, []);

  // Filter and sort recently viewed articles
  const recentArticles = useMemo(() => {
    if (!articles) return [];

    // Get articles that have been recently viewed
    const viewedArticles = articles.filter((article) =>
      recentlyViewed.includes(article.id.toString())
    );

    // Sort by the order in recentlyViewed array (most recent first)
    viewedArticles.sort((a, b) => {
      const aIndex = recentlyViewed.indexOf(a.id.toString());
      const bIndex = recentlyViewed.indexOf(b.id.toString());
      return aIndex - bIndex;
    });

    // Apply search filter
    let filtered = viewedArticles;
    if (searchQuery) {
      filtered = viewedArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply sorting
    switch (sortValue) {
      case "recent":
        // Already sorted by recently viewed order
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "category":
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        break;
    }

    return filtered;
  }, [articles, recentlyViewed, searchQuery, sortValue]);

  const handleArticleClick = (articleId: string) => {
    // Update recently viewed list
    const updated = [
      articleId,
      ...recentlyViewed.filter((id) => id !== articleId),
    ].slice(0, 20);
    setRecentlyViewed(updated);
    localStorage.setItem(currentUser.user.id, JSON.stringify(updated));

    navigate(`/articles/${articleId}`);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4)
      return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const formatCategory = (category: string) => {
    return category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (!articles)
    return (
      <div className="place-content-center h-full border">
        <Loader />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="flex flex-col space-y-6 mx-auto h-full">
          {/* Header */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Quick access to your recently viewed articles
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="w-full md:w-[300px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortValue("recent")}>
                    Most Recent
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortValue("alphabetical")}
                  >
                    Alphabetical
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortValue("category")}>
                    By Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Recently Viewed Section */}
          <div className="space-y-4 h-full border">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">
                Recently Viewed Articles ({recentArticles.length})
              </h2>
            </div>

            {recentArticles.length === 0 ? (
              <div className="content-center min-h-9/10">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    No recently viewed articles
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start browsing articles to see them here
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardHeader>
                      <CardTitle
                        className="line-clamp-2 overflow-ellipsis leading-normal hover:underline"
                        onClick={() =>
                          handleArticleClick(article.id.toString())
                        }
                      >
                        {article.title}
                      </CardTitle>
                      <CardDescription className="flex items-center text-xs">
                        <Clock className="mr-1 h-3 w-3" />
                        {getTimeAgo(article.publish_date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {article.email}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(article.publish_date).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start space-y-2">
                      <Badge variant="outline">
                        {formatCategory(article.category)}
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
