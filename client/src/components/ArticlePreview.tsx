import { Calendar, User, Tag, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router";
import "react-quill-new/dist/quill.snow.css";
import { useSanitizeHtml } from "@/hooks/useSanitizeHtml";

export default function ArticlePreview() {
  const [searchParams] = useSearchParams();

  const previewData = {
    title: searchParams.get("t") || "",
    description: searchParams.get("e") || "",
    category: searchParams.get("c") || "",
    author: searchParams.get("a") || "",
    tags: searchParams.get("tags") || "",
  };

  // Placeholder article data
  const article = {
    id: 1,
    title: previewData.title,
    description: previewData.description,
    category: previewData.category,
    author: previewData.author,
    tags: JSON.parse(decodeURIComponent(previewData.tags)),
    content: useSanitizeHtml(localStorage.getItem("previewContent") || ""),
  };

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
                    <Button variant="ghost" size="sm" hidden>
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" hidden>
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                  <p className="text-lg text-muted-foreground">
                    {article.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Published {new Date(Date.now()).toDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string, index: number) => (
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
                <div
                  className="whitespace-pre-wrap text-sm leading-relaxed ql-editor"
                  dangerouslySetInnerHTML={{
                    __html: article.content,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
