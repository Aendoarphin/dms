import {
  Search,
  Calendar,
  User,
  Filter,
} from "lucide-react";
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

export default function Articles() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [categoryValue, setCategoryValue] = useState("all");
  const articles = useArticles();

  const navigate = useNavigate();

  const allArticles = articles ? articles : [];

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
      count: allArticles.filter(
        (a) => a.category === "accounting"
      ).length,
    },
    {
      id: 3,
      value: "compliance",
      label: "Compliance",
      count: allArticles.filter(
        (a) => a.category === "compliance"
      ).length,
    },
    {
      id: 4,
      value: "operations",
      label: "Operations",
      count: allArticles.filter(
        (a) => a.category === "operations"
      ).length,
    },
    {
      id: 5,
      value: "information technology",
      label: "Information Technology",
      count: allArticles.filter(
        (a) => a.category === "information technology"
      ).length,
    },
    {
      id: 6,
      value: "collections",
      label: "Collections",
      count: allArticles.filter(
        (a) => a.category === "collections"
      ).length,
    },
    {
      id: 7,
      value: "other",
      label: "Other",
      count: allArticles.filter(
        (a) => a.category === "Other"
      ).length,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="flex flex-col max-w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">
                Knowledge Base Articles
              </h1>
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
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    All Articles
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Accounting
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Compliance
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Operations
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Information Technology
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Collections
                  </DropdownMenuItem>
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
                    categoryValue.toLowerCase() ===
                      category.value
                      ? "default"
                      : "outline"
                  }
                  onClick={() => {
                    setCategoryIndex(category.id);
                    setCategoryValue(category.value);
                  }}
                  size="sm"
                  className="h-8">
                  {category.label}
                  <Badge
                    variant="secondary"
                    className="ml-2">
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
                  <SelectItem value="newest">
                    Newest First
                  </SelectItem>
                  <SelectItem value="oldest">
                    Oldest First
                  </SelectItem>
                  <SelectItem value="title">
                    Title A-Z
                  </SelectItem>
                  <SelectItem value="author">
                    Author A-Z
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-time">
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">
                    All Time
                  </SelectItem>
                  <SelectItem value="last-week">
                    Last Week
                  </SelectItem>
                  <SelectItem value="last-month">
                    Last Month
                  </SelectItem>
                  <SelectItem value="last-quarter">
                    Last Quarter
                  </SelectItem>
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
                onClick={() =>
                  navigate(`/articles/${article.id}`)
                }
                key={article.id}
                className={
                  article.category.toLowerCase() ===
                    categoryValue.toLowerCase() ||
                  categoryValue.toLowerCase() === "all"
                    ? "hover:shadow-md transition-shadow cursor-pointer"
                    : "hidden"
                }>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge
                      variant="outline"
                      className="mb-2">
                      {article.category
                        .charAt(0)
                        .toUpperCase() +
                        article.category.slice(1)}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">
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
                      {new Date(
                        article.publish_date
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.tags
                      .slice(0, 2)
                      .map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    {article.tags.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="text-xs">
                        +{article.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center pt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled>
              Previous
            </Button>
            <Button
              variant="default"
              size="sm">
              1
            </Button>
            <Button
              variant="outline"
              size="sm">
              2
            </Button>
            <Button
              variant="outline"
              size="sm">
              3
            </Button>
            <Button
              variant="outline"
              size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
