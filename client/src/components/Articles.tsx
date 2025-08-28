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
import { useNavigate } from "react-router";
import { useState } from "react";
import useArticles from "@/hooks/useArticles";
import useGetAdmin from "@/hooks/useGetAdmin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import supabase from "@/util/supabase";
export default function Articles() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [categoryValue, setCategoryValue] = useState("all");
  const [filterValue, setFilterValue] = useState("newest");
  const [timeFilterValue, setTimeFilterValue] = useState("all-time");
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem(import.meta.env.VITE_COOKIE) || "")
  );
  const [loading, setLoading] = useState(false);
  const adminId = useGetAdmin(currentUser);
  const articles = useArticles();

  const navigate = useNavigate();

  const allArticles = articles
    ? articles.filter((article) => {
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

        switch (timeFilterValue) {
          case "all-time":
            return true;
          case "last-week":
            return publishDate >= lastWeek;
          case "last-month":
            return publishDate >= lastMonth;
          case "last-quarter":
            return publishDate >= lastQuarter;
          default:
            return true;
        }
      })
    : [];

  const categories = [
    {
      id: 1,
      value: "all",
      label: "All Articles",
      count: allArticles.length,
    },
    {
      id: 2,
      value: "accounting",
      label: "Accounting",
      count: allArticles.filter((a) => a.category === "accounting").length,
    },
    {
      id: 3,
      value: "compliance",
      label: "Compliance",
      count: allArticles.filter((a) => a.category === "compliance").length,
    },
    {
      id: 4,
      value: "operations",
      label: "Operations",
      count: allArticles.filter((a) => a.category === "operations").length,
    },
    {
      id: 5,
      value: "information technology",
      label: "Information Technology",
      count: allArticles.filter((a) => a.category === "information technology")
        .length,
    },
    {
      id: 6,
      value: "collections",
      label: "Collections",
      count: allArticles.filter((a) => a.category === "collections").length,
    },
    {
      id: 7,
      value: "other",
      label: "Other",
      count: allArticles.filter((a) => a.category === "Other").length,
    },
  ];

  switch (filterValue) {
    case "newest":
      allArticles.sort((a, b) => b.publish_date.localeCompare(a.publish_date));
      break;
    case "oldest":
      allArticles.sort((a, b) => a.publish_date.localeCompare(b.publish_date));
      break;
    case "title":
      allArticles.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "author":
      allArticles.sort((a, b) => a.email.localeCompare(b.email));
      break;
  }

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
    window.location.reload();
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
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Articles</DropdownMenuItem>
                  <DropdownMenuItem>Accounting</DropdownMenuItem>
                  <DropdownMenuItem>Compliance</DropdownMenuItem>
                  <DropdownMenuItem>Operations</DropdownMenuItem>
                  <DropdownMenuItem>Information Technology</DropdownMenuItem>
                  <DropdownMenuItem>Collections</DropdownMenuItem>
                  <DropdownMenuItem>Other</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col p-4 space-y-4 rounded-lg sm:flex-row sm:items-center sm:justify-between sm:space-y-0 bg-card">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={
                    categoryIndex === category.id ||
                    categoryValue.toLowerCase() === category.value
                      ? "default"
                      : "outline"
                  }
                  onClick={() => {
                    setCategoryIndex(category.id);
                    setCategoryValue(category.value);
                  }}
                  size="sm"
                  className="h-8"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue={filterValue} onValueChange={setFilterValue}>
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
              Showing {allArticles.length} articles
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allArticles.map((article) => (
              <Card
                key={article.id}
                className={
                  article.category.toLowerCase() ===
                    categoryValue.toLowerCase() ||
                  categoryValue.toLowerCase() === "all"
                    ? "hover:shadow-md transition-shadow relative z-1"
                    : "hidden"
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="">
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
                      <Button
                        variant={"link"}
                        className={`p-0`}
                        title="Delete Article"
                      >
                        <Dialog modal>
                          <DialogTrigger asChild>
                            <div className="flex items-center gap-2 w-full py-2 px-3 hover:bg-muted rounded-md cursor-pointer">
                              <Trash
                                strokeWidth={3}
                                fontSize={14}
                                color="red"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Article Delete</DialogTitle>
                              <DialogDescription>
                                Do you wish to delete this article?
                              </DialogDescription>
                            </DialogHeader>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleDeleteArticle(article.id.toString())
                              }
                              type="button"
                            >
                              {loading ? (
                                <div className="animate-pulse">
                                  Deleting Article...
                                </div>
                              ) : (
                                "Delete Article"
                              )}
                            </Button>
                          </DialogContent>
                        </Dialog>
                      </Button>
                    )}
                  </div>
                  <CardTitle
                    className="line-clamp-2 leading-normal cursor-pointer hover:underline"
                    onClick={() => navigate(`/articles/${article.id}`)}
                  >
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
