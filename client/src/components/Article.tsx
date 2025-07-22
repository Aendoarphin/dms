import { ArrowLeft, Calendar, User, Tag, Clock, Eye, ThumbsUp, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";

export default function Article() {
  const navigate = useNavigate();
  // Placeholder article data
  const article = {
    id: 1,
    title: "Understanding Financial Reconciliation Best Practices",
    description: "A comprehensive guide to implementing effective financial reconciliation processes in your organization",
    category: "Accounting",
    author: "Sarah Johnson",
    publishDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    readTime: "8 min read",
    views: 1247,
    likes: 42,
    tags: ["reconciliation", "accounting", "best-practices", "finance", "processes", "audit"],
    content: `Introduction

Financial reconciliation is a critical process that ensures the accuracy and integrity of financial records. This comprehensive guide will walk you through the best practices for implementing effective reconciliation processes in your organization.

## What is Financial Reconciliation?

Financial reconciliation is the process of comparing two sets of records to ensure they are in agreement and accurate. This typically involves matching internal financial records with external statements, such as bank statements, to identify and resolve any discrepancies.

## Key Benefits

- **Accuracy**: Ensures financial records are correct and complete
- **Fraud Detection**: Helps identify unauthorized transactions or errors
- **Compliance**: Meets regulatory requirements and audit standards
- **Cash Flow Management**: Provides accurate cash position information

## Best Practices

### 1. Establish Regular Schedules

Set up consistent reconciliation schedules based on account activity and importance:
- Daily reconciliation for high-volume accounts
- Weekly reconciliation for moderate activity accounts
- Monthly reconciliation for low-activity accounts

### 2. Implement Proper Documentation

Maintain detailed records of all reconciliation activities:
- Document all adjusting entries
- Keep supporting documentation for variances
- Create clear audit trails for all transactions

### 3. Use Automation Where Possible

Leverage technology to streamline the reconciliation process:
- Automated bank feeds
- Exception reporting
- Workflow management systems

### 4. Segregation of Duties

Ensure proper internal controls by separating responsibilities:
- Different people should prepare and review reconciliations
- Independent approval for adjusting entries
- Regular supervisory review of reconciliation processes

## Common Challenges

- **Timing Differences**: Transactions recorded in different periods
- **Outstanding Items**: Checks or deposits in transit
- **Bank Errors**: Mistakes made by financial institutions
- **Data Entry Errors**: Manual input mistakes

## Conclusion

Implementing robust financial reconciliation processes is essential for maintaining accurate financial records and ensuring regulatory compliance. By following these best practices and maintaining consistent procedures, organizations can minimize errors and improve their overall financial management.

Remember to regularly review and update your reconciliation procedures to ensure they remain effective and aligned with your organization's needs.
    `
  };

  const relatedArticles = [
    {
      id: 2,
      title: "Cash Flow Management Strategies",
      category: "Accounting",
      publishDate: "2024-01-10"
    },
    {
      id: 3,
      title: "Internal Controls and Audit Preparation",
      category: "Compliance",
      publishDate: "2024-01-05"
    },
    {
      id: 4,
      title: "Automated Accounting Systems Implementation",
      category: "Information Technology",
      publishDate: "2023-12-28"
    }
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with Back Navigation */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="pl-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </div>

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
                    {article.readTime}
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
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {article.content}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Related Articles */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <Badge variant="outline" className="mb-2 w-fit">
                      {relatedArticle.category}
                    </Badge>
                    <CardTitle className="text-base line-clamp-2">{relatedArticle.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(relatedArticle.publishDate).toLocaleDateString()}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}