import { Calendar, User, Tag, Clock, Eye, ThumbsUp, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router";
import "react-quill-new/dist/quill.snow.css";

export default function ArticlePreview() {
  const [searchParams] = useSearchParams();

  // Placeholder article data
  const article = {
    id: 1,
    title: searchParams.get("t") || "",
    description: searchParams.get("e") || "",
    category: "Accounting",
    author: "Sarah Johnson",
    publishDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    readTime: "8 min read",
    views: 1247,
    likes: 42,
    tags: ["reconciliation", "accounting", "best-practices", "finance", "processes", "audit"],
    content: searchParams.get("c") || "This is a sample article content for preview purposes."
  }; // continue here; parse html string to html

  // const relatedArticles = [
  //   {
  //     id: 2,
  //     title: "Cash Flow Management Strategies",
  //     category: "Accounting",
  //     publishDate: "2024-01-10"
  //   },
  //   {
  //     id: 3,
  //     title: "Internal Controls and Audit Preparation",
  //     category: "Compliance",
  //     publishDate: "2024-01-05"
  //   },
  //   {
  //     id: 4,
  //     title: "Automated Accounting Systems Implementation",
  //     category: "Information Technology",
  //     publishDate: "2023-12-28"
  //   }
  // ];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Article Header */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start justify-between">
                  <Badge variant="outline">{article.category}</Badge>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                  <p className="text-lg text-muted-foreground">{article.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Published {new Date(article.publishDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {article.content.split(" ").length / 200} min read
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {article.views.toLocaleString()} views
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {article.likes} likes
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Article Content */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-gray max-w-none ql-snow">
                <div className="whitespace-pre-wrap text-sm leading-relaxed ql-editor"
                  dangerouslySetInnerHTML={{ __html: article.content }}>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}