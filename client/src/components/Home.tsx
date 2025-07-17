import { Search, Clock, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const recentArticles = [
    {
      id: 1,
      title: "Understanding Credit Union Membership",
      excerpt: "Learn about the benefits and requirements of becoming a credit union member.",
      lastAccessed: "2 hours ago",
      category: "Membership",
      tags: ["Membership", "Credit Union 101", "Benefits"],
    },
    {
      id: 2,
      title: "Navigating Online Banking",
      excerpt:
        "A step-by-step guide to using our online banking platform for secure and convenient account management.",
      lastAccessed: "Yesterday",
      category: "Digital Banking",
      tags: ["Online Banking", "Mobile Banking", "Account Management"],
    },
    {
      id: 3,
      title: "Applying for a Loan",
      excerpt: "Find out how to apply for a loan, including the required documents and approval process.",
      lastAccessed: "3 days ago",
      category: "Lending",
      tags: ["Loans", "Application Process", "Approval"],
    },
    {
      id: 4,
      title: "Understanding Credit Scores",
      excerpt: "Learn how credit scores are calculated and how to improve your credit score.",
      lastAccessed: "1 week ago",
      category: "Financial Education",
      tags: ["Credit Scores", "Credit Reports", "Financial Literacy"],
    },
    {
      id: 5,
      title: "Using Mobile Deposit",
      excerpt: "A guide to using our mobile deposit feature to deposit checks remotely.",
      lastAccessed: "2 weeks ago",
      category: "Digital Banking",
      tags: ["Mobile Deposit", "Remote Deposit", "Convenience"],
    },
    {
      id: 6,
      title: "Protecting Against Identity Theft",
      excerpt: "Tips and best practices for protecting your identity and preventing identity theft.",
      lastAccessed: "3 weeks ago",
      category: "Security",
      tags: ["Identity Theft", "Security", "Fraud Prevention"],
    },
    {
      id: 7,
      title: "Navigating Online Banking",
      excerpt:
        "A step-by-step guide to using our online banking platform for secure and convenient account management.",
      lastAccessed: "Yesterday",
      category: "Digital Banking",
      tags: ["Online Banking", "Mobile Banking", "Account Management"],
    },
    {
      id: 8,
      title: "Applying for a Loan",
      excerpt: "Find out how to apply for a loan, including the required documents and approval process.",
      lastAccessed: "3 days ago",
      category: "Lending",
      tags: ["Loans", "Application Process", "Approval"],
    },
    {
      id: 9,
      title: "Understanding Credit Scores",
      excerpt: "Learn how credit scores are calculated and how to improve your credit score.",
      lastAccessed: "1 week ago",
      category: "Financial Education",
      tags: ["Credit Scores", "Credit Reports", "Financial Literacy"],
    },
    {
      id: 10,
      title: "Using Mobile Deposit",
      excerpt: "A guide to using our mobile deposit feature to deposit checks remotely.",
      lastAccessed: "2 weeks ago",
      category: "Digital Banking",
      tags: ["Mobile Deposit", "Remote Deposit", "Convenience"],
    },
    {
      id: 11,
      title: "Protecting Against Identity Theft",
      excerpt: "Tips and best practices for protecting your identity and preventing identity theft.",
      lastAccessed: "3 weeks ago",
      category: "Security",
      tags: ["Identity Theft", "Security", "Fraud Prevention"],
    },
    {
      id: 12,
      title: "Navigating Online Banking",
      excerpt:
        "A step-by-step guide to using our online banking platform for secure and convenient account management.",
      lastAccessed: "Yesterday",
      category: "Digital Banking",
      tags: ["Online Banking", "Mobile Banking", "Account Management"],
    },
    {
      id: 13,
      title: "Applying for a Loan",
      excerpt: "Find out how to apply for a loan, including the required documents and approval process.",
      lastAccessed: "3 days ago",
      category: "Lending",
      tags: ["Loans", "Application Process", "Approval"],
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="flex flex-col space-y-6 mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">View your recently accessed articles</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search articles..." className="w-full md:w-[300px] pl-8" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Most Recent</DropdownMenuItem>
                  <DropdownMenuItem>Most Viewed</DropdownMenuItem>
                  <DropdownMenuItem>Alphabetical</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="recent">
            <TabsList>
              <TabsTrigger value="recent">
                <Clock className="mr-2 h-4 w-4" />
                Recently Viewed
              </TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentArticles.map((article) => (
                  <Card key={article.id}>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 overflow-ellipsis leading-normal">{article.title}</CardTitle>
                      <CardDescription className="flex items-center text-xs">
                        <Clock className="mr-1 h-3 w-3" />
                        {article.lastAccessed}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start space-y-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="popular">
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">Popular articles would appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
