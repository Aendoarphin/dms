import { useContext, useState } from "react";
import { FileText, Upload, Save, Calendar, Tag, User, ImageIcon, Link, Settings, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "./RichTextEditor";
import { SessionContext } from "@/App";

interface Author {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

export default function Editor() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const currentUser = useContext(SessionContext);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="flex flex-col space-y-6 max-w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Article Editor</h1>
              <p className="text-muted-foreground">Create and publish your article</p>
            </div>
          </div>

          {/* Article Status Bar */}
          <div
            hidden
            className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 bg-muted rounded-lg">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant={isPublished ? "default" : "secondary"}>{isPublished ? "Published" : "Draft"}</Badge>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Last saved: 2 minutes ago</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="publish-toggle" className="text-sm">
                Publish immediately
              </Label>
              <Switch id="publish-toggle" checked={isPublished} onCheckedChange={setIsPublished} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Article Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <CardTitle>Article Details</CardTitle>
                  </div>
                  <CardDescription>Basic information about your article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter article title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Brief description of your article..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <RichTextEditor />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing Options */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <CardTitle>Publishing</CardTitle>
                  </div>
                  <CardDescription>Control when and how your article is published</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="draft">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <div className="flex items-center space-x-2 p-2 border rounded-lg">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {currentUser?.user.user_metadata.firstName + " " + currentUser?.user.user_metadata.lastName}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <CardTitle>Tags</CardTitle>
                  </div>
                  <CardDescription>Add tags to help categorize your article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {tag}
                        <button className="ml-1 text-xs">×</button>
                      </Badge>
                    ))}
                  </div>
                  <Input placeholder="Add a tag..." />
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <CardTitle>Featured Image</CardTitle>
                  </div>
                  <CardDescription>Upload a featured image for your article</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop an image here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">Auto-saved at 3:42 PM</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/preview?t=${title}&e=${excerpt}`, "_blank")}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Publish Article
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
