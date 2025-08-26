import { ArrowLeft, Calendar, User, Tag, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router";
import useArticles from "@/hooks/useArticles";
import { useSanitizeHtml } from "@/hooks/useSanitizeHtml";

export default function Article() {
  const navigate = useNavigate();
  const params = useParams();
  const articles = useArticles();
  const article = articles?.find(
    (a) => a.id.toString() === params.id?.toString() || null
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with Back Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="pl-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4">
                <div className="flex items-start justify-between">
                  <Badge variant="outline">{article?.category}</Badge>
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
                  <h1 className="text-3xl font-bold mb-2">{article?.title}</h1>
                  <p className="text-lg text-muted-foreground">
                    {article?.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {article?.email}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Published{" "}
                    {new Date(
                      article ? article.publish_date : ""
                    ).toDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {article?.tags.map((tag, index) => (
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
                    __html: useSanitizeHtml(article?.content || ""),
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
