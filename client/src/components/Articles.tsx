import { Search, Calendar, User, Filter, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router";
import { useState } from "react";
import useArticles from "@/hooks/useArticles";
import useGetAdmin from "@/hooks/useGetAdmin";
import supabase from "@/util/supabase";

export default function Articles() {
  const [categoryValue, setCategoryValue] = useState("all");
  const [sortValue, setSortValue] = useState("newest");
  const [timeFilterValue, setTimeFilterValue] = useState("all-time");
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem(import.meta.env.VITE_COOKIE) || "")
  );
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const adminId = useGetAdmin(currentUser);
  const articles = useArticles(refresh);

  const navigate = useNavigate();

  // Filter articles based on search, category, and time period
  const filteredArticles = articles
    ? articles.filter((article) => {
        // Search filter
        const matchesSearch =
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          article.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
          categoryValue === "all" ||
          article.category.toLowerCase() === categoryValue.toLowerCase();

        // Time filter
        const publishDate = new Date(article.publish_date);
        const today = new Date();
        const lastWeek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );
        const lastQuarter = new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          today.getDate()
        );

        let matchesTimeFilter = true;
        switch (timeFilterValue) {
          case "last-week":
            matchesTimeFilter = publishDate >= lastWeek;
            break;
          case "last-month":
            matchesTimeFilter = publishDate >= lastMonth;
            break;
          case "last-quarter":
            matchesTimeFilter = publishDate >= lastQuarter;
            break;
          case "all-time":
          default:
            matchesTimeFilter = true;
            break;
        }

        return matchesSearch && matchesCategory && matchesTimeFilter;
      })
    : [];

  // Sort articles
  switch (sortValue) {
    case "newest":
      filteredArticles.sort((a, b) =>
        b.publish_date.localeCompare(a.publish_date)
      );
      break;
    case "oldest":
      filteredArticles.sort((a, b) =>
        a.publish_date.localeCompare(b.publish_date)
      );
      break;
    case "title":
      filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "author":
      filteredArticles.sort((a, b) => a.email.localeCompare(b.email));
      break;
  }

  const getCategoryCount = (category: string) => {
    if (!articles) return 0;
    if (category === "all") return articles.length;
    return articles.filter(
      (article) => article.category.toLowerCase() === category.toLowerCase()
    ).length;
  };

  const handleDeleteArticle = async (articleId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", articleId);
    setLoading(false);
    if (error) {
      window.alert("Could not delete article:" + articleId);
    }
    setRefresh(!refresh);
  };

  // Handle article click - update recently viewed and navigate
  const handleArticleClick = (articleId: string) => {
    // Update recently viewed articles in localStorage
    const stored = localStorage.getItem(currentUser.user.id);
    const recentlyViewed = stored ? JSON.parse(stored) : [];
    
    // Remove article if it exists and add it to the beginning, limit to 20 items
    const updated = [articleId, ...recentlyViewed.filter((id: string) => id !== articleId)].slice(0, 20);
    localStorage.setItem(currentUser.user.id, JSON.stringify(updated));
    
    // Navigate to article detail page
    navigate(`/articles/${articleId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="flex flex-col max-w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Knowledge Base Articles</h1>
              <p className="text-muted-foreground">
                Browse all published articles
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="w-full lg:w-[300px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCategoryValue("all")}>
                    All Articles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCategoryValue("accounting")}
                  >
                    Accounting
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCategoryValue("compliance")}
                  >
                    Compliance
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCategoryValue("operations")}
                  >
                    Operations
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCategoryValue("information technology")}
                  >
                    Information Technology
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCategoryValue("collections")}
                  >
                    Collections
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCategoryValue("human resources")}
                  >
                    Human Resources
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCategoryValue("other")}>
                    Other
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col p-4 space-y-4 rounded-lg sm:flex-row sm:items-center sm:justify-between sm:space-y-0 bg-card">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={categoryValue === "all" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("all")}
              >
                All
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("all")}
                </Badge>
              </Button>
              <Button
                variant={categoryValue === "accounting" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("accounting")}
              >
                Accounting
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("accounting")}
                </Badge>
              </Button>
              <Button
                variant={categoryValue === "compliance" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("compliance")}
              >
                Compliance
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("compliance")}
                </Badge>
              </Button>
              <Button
                variant={categoryValue === "operations" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("operations")}
              >
                Operations
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("operations")}
                </Badge>
              </Button>
              <Button
                variant={
                  categoryValue === "information technology"
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("information technology")}
              >
                Information Technology
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("information technology")}
                </Badge>
              </Button>
              <Button
                variant={
                  categoryValue === "collections" ? "default" : "outline"
                }
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("collections")}
              >
                Collections
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("collections")}
                </Badge>
              </Button>
              <Button
                variant={
                  categoryValue === "human resources" ? "default" : "outline"
                }
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("human resources")}
              >
                Human Resources
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("human resources")}
                </Badge>
              </Button>
              <Button
                variant={categoryValue === "other" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("other")}
              >
                Other
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("other")}
                </Badge>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="newest" onValueChange={setSortValue}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="author">Author A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Select
                defaultValue="all-time"
                onValueChange={setTimeFilterValue}
              >
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredArticles.length} articles
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-md transition-shadow relative cursor-pointer"
                onClick={() => handleArticleClick(article.id.toString())}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {article.category.includes(" ")
                        ? article.category
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : article.category.charAt(0).toUpperCase() +
                          article.category.slice(1)}
                    </Badge>
                    {currentUser.user.id === adminId && (
                      <Dialog modal>
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            className="p-0"
                            title="Delete Article"
                            onClick={(e) => e.stopPropagation()} // Prevent card click
                          >
                            <div className="flex items-center gap-2 w-full py-2 px-3 hover:bg-muted rounded-md cursor-pointer">
                              <Trash
                                strokeWidth={3}
                                fontSize={14}
                                color="red"
                              />
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Article Delete</DialogTitle>
                            <DialogDescription>
                              Do you wish to delete this article? This action
                              cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleDeleteArticle(article.id.toString())
                              }
                              disabled={loading}
                            >
                              {loading ? "Deleting..." : "Delete Article"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 leading-normal hover:underline">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {article.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(article.publish_date).toDateString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{article.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}