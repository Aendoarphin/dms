import { Search, Calendar, User, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Articles() {
  const allArticles = [
    {
      id: 1,
      title: "Monthly Financial Reporting Best Practices",
      description: "Comprehensive guide to creating accurate and timely monthly financial reports for stakeholders.",
      category: "Accounting",
      author: "Sarah Johnson",
      publishDate: "2024-01-15",
      tags: ["Financial Reports", "Best Practices", "Monthly Closing"],
    },
    {
      id: 2,
      title: "GDPR Compliance Checklist 2024",
      description:
        "Updated checklist ensuring your organization meets all GDPR requirements and data protection standards.",
      category: "Compliance",
      author: "Michael Chen",
      publishDate: "2024-01-12",
      tags: ["GDPR", "Data Protection", "Privacy"],
    },
    {
      id: 3,
      title: "Incident Response Procedures",
      description: "Step-by-step procedures for handling operational incidents and minimizing business impact.",
      category: "Operations",
      author: "Emily Rodriguez",
      publishDate: "2024-01-10",
      tags: ["Incident Management", "Operations", "Emergency Response"],
    },
    {
      id: 4,
      title: "Network Security Configuration Guide",
      description: "Complete guide to configuring network security settings and implementing best practices.",
      category: "Information Technology",
      author: "David Kim",
      publishDate: "2024-01-08",
      tags: ["Network Security", "Configuration", "Cybersecurity"],
    },
    {
      id: 5,
      title: "Accounts Payable Automation",
      description: "How to streamline your accounts payable process using automation tools and workflows.",
      category: "Accounting",
      author: "Lisa Wang",
      publishDate: "2024-01-05",
      tags: ["Automation", "Accounts Payable", "Workflow"],
    },
    {
      id: 6,
      title: "SOX Compliance Framework",
      description: "Understanding and implementing Sarbanes-Oxley compliance requirements for public companies.",
      category: "Compliance",
      author: "Robert Taylor",
      publishDate: "2024-01-03",
      tags: ["SOX", "Internal Controls", "Audit"],
    },
    {
      id: 7,
      title: "Supply Chain Risk Management",
      description: "Strategies for identifying, assessing, and mitigating risks in your supply chain operations.",
      category: "Operations",
      author: "Jennifer Lee",
      publishDate: "2023-12-28",
      tags: ["Supply Chain", "Risk Management", "Vendor Management"],
    },
    {
      id: 8,
      title: "Cloud Migration Strategy",
      description: "Planning and executing a successful migration to cloud infrastructure with minimal downtime.",
      category: "Information Technology",
      author: "Alex Thompson",
      publishDate: "2023-12-25",
      tags: ["Cloud Migration", "Infrastructure", "AWS"],
    },
    {
      id: 9,
      title: "Employee Onboarding Checklist",
      description: "Comprehensive checklist to ensure smooth onboarding process for new team members.",
      category: "Other",
      author: "Maria Garcia",
      publishDate: "2023-12-20",
      tags: ["HR", "Onboarding", "Employee Experience"],
    },
    {
      id: 10,
      title: "Budget Planning and Forecasting",
      description: "Advanced techniques for creating accurate budgets and financial forecasts for your organization.",
      category: "Accounting",
      author: "James Wilson",
      publishDate: "2023-12-18",
      tags: ["Budgeting", "Forecasting", "Financial Planning"],
    },
    {
      id: 11,
      title: "Data Retention Policies",
      description:
        "Establishing comprehensive data retention policies to meet regulatory requirements and business needs.",
      category: "Compliance",
      author: "Amanda Brown",
      publishDate: "2023-12-15",
      tags: ["Data Retention", "Records Management", "Legal"],
    },
    {
      id: 12,
      title: "Disaster Recovery Planning",
      description: "Creating and maintaining effective disaster recovery plans to ensure business continuity.",
      category: "Operations",
      author: "Kevin Martinez",
      publishDate: "2023-12-12",
      tags: ["Disaster Recovery", "Business Continuity", "Risk Management"],
    },
    {
      id: 13,
      title: "Assessing payoffs and losses in collections",
      description:
        "Understanding how to assess payoffs and losses in collections to optimize recovery and minimize legal costs.",
      category: "Collections",
      author: "Emily Rodriguez",
      publishDate: "2023-12-10",
      tags: ["Collections", "Payoffs", "Losses"],
    },
  ];

  interface Article {
    id: number;
    title: string;
    description: string;
    category: string;
    author: string;
    publishDate: string;
    tags: string[];
  }

  interface Category {
    value: string;
    label: string;
    count: number;
  }

  const categories = [
    { value: "all", label: "All Articles", count: allArticles.length },
    {
      value: "accounting",
      label: "Accounting",
      count: allArticles.filter((a) => a.category === "Accounting").length,
    },
    {
      value: "compliance",
      label: "Compliance",
      count: allArticles.filter((a) => a.category === "Compliance").length,
    },
    {
      value: "operations",
      label: "Operations",
      count: allArticles.filter((a) => a.category === "Operations").length,
    },
    {
      value: "information-technology",
      label: "Information Technology",
      count: allArticles.filter((a) => a.category === "Information Technology").length,
    },
    {
      value: "collections",
      label: "Collections",
      count: allArticles.filter((a) => a.category === "Collections").length,
    },
    {
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
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 bg-muted rounded-lg">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button key={category.value} variant={index === 0 ? "default" : "outline"} size="sm" className="h-8">
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
              <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
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
