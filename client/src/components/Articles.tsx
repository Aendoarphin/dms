import { Search, Calendar, User, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Articles() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [categoryValue, setCategoryValue] = useState("all");

  const navigate = useNavigate();

  interface ArticleCard {
    id: number;
    title: string;
    description: string;
    category: string;
    author: string;
    publishDate: string;
    tags: string[];
  }

  interface Category {
    id: number;
    value: string;
    label: string;
    count: number;
  }

  const allArticles: ArticleCard[] = [
    {
      id: 1,
      title: "Article 1",
      description: "Description of article 1",
      category: "Accounting",
      author: "John Doe",
      publishDate: "2023-01-01",
      tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11", "tag12"],
    },
    {
      id: 2,
      title: "Article 2",
      description: "Description of article 2",
      category: "Compliance",
      author: "Jane Doe",
      publishDate: "2023-02-01",
      tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11", "tag12"],
    },
  ]; // Fetch the array of articles here

  const categories = [
    { id: 1, value: "all", label: "All Articles", count: allArticles.length },
    {
      id: 2,
      value: "accounting",
      label: "Accounting",
      count: allArticles.filter((a) => a.category === "Accounting").length,
    },
    {
      id: 3,
      value: "compliance",
      label: "Compliance",
      count: allArticles.filter((a) => a.category === "Compliance").length,
    },
    {
      id: 4,
      value: "operations",
      label: "Operations",
      count: allArticles.filter((a) => a.category === "Operations").length,
    },
    {
      id: 5,
      value: "information-technology",
      label: "Information Technology",
      count: allArticles.filter((a) => a.category === "Information Technology").length,
    },
    {
      id: 6,
      value: "collections",
      label: "Collections",
      count: allArticles.filter((a) => a.category === "Collections").length,
    },
    {
      id: 7,
      value: "other",
      label: "Other",
      count: allArticles.filter((a) => a.category === "Other").length,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="flex flex-col space-y-6 max-w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Knowledge Base Articles</h1>
              <p className="text-muted-foreground">Browse all published articles</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search articles..." className="w-full lg:w-[300px] pl-8" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Filter className="h-4 w-4" />
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
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 bg-card rounded-lg">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={categoryIndex === category.id || categoryValue.toLowerCase() === category.value ? "default" : "outline"}
                  onClick={() => {
                    setCategoryIndex(category.id);
                    setCategoryValue(category.value);
                  }}
                  size="sm"
                  className="h-8">
                  {category.label}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="newest">
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
              <Select defaultValue="all-time">
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
            <p className="text-sm text-muted-foreground">Showing {allArticles.length} articles</p>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allArticles.map((article) => (
              <Card
                onClick={() => navigate(`/articles/${article.id}`)}
                key={article.id}
                className={
                  article.category.toLowerCase() === categoryValue.toLowerCase() || categoryValue.toLowerCase() === "all"
                    ? "hover:shadow-md transition-shadow cursor-pointer"
                    : "hidden"
                }>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="mb-2">
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      {article.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(article.publishDate).toLocaleDateString()}
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

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
