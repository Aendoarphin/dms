import { useContext, useState } from "react";
import { FileText, Upload, Save, Calendar, Tag, User, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Quill from "./Quill";
import { SessionContext } from "@/context";
import supabase from "@/util/supabase";
import { toast, Toaster } from "sonner";

export default function Editor() {
  const currentUser = useContext(SessionContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState("operations");
  const [isPublishing, setIsPublishing] = useState(false);

  console.log(content);

  const handlePublish = async () => {
    try {
      const fetchResponse = await fetch(import.meta.env.VITE_DEV_SERVER_URL);
      if (fetchResponse.ok) {
        // Publish the article
        setIsPublishing(true);
        const { error } = await supabase.from("articles").insert({
          title,
          description,
          content,
          tags,
          category,
          email: currentUser?.user?.email,
        });

        if (error) {
          console.error("Error publishing article:", error);
          toast.error(error.message, {
            style: { backgroundColor: "red", color: "white" },
          });
          return;
        } else {
          console.log("Article published successfully!");
          toast.success("Article published successfully!", {
            style: { backgroundColor: "green", color: "white" },
          });
          setTitle("");
          setDescription("");
          setContent("");
          setTags([]);
          setCategory("operations");
        }
      } else {
        toast.error("Could not connect to server", {
          style: { backgroundColor: "red", color: "white" },
        });
      }
    } catch (error) {
      console.error("Error publishing article:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.key === "Enter") {
      const newTag = e.currentTarget.value.trim().toLowerCase();
      if (newTag) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        console.log(newTags);
        e.currentTarget.value = "";
      }
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    console.log(newTags);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster duration={5000} position="top-right" />
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
            <div hidden className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 bg-muted rounded-lg">
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last saved: 2 minutes ago</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="publish-toggle" className="text-sm">
                  Publish immediately
                </Label>
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
                      <Input id="title" placeholder="Enter article title..." value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of your article..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        style={{ resize: "none" }}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
                <Quill articleContent={content} setArticleContent={setContent} />
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
                      <Label htmlFor="category">Category</Label>
                      <Select defaultValue={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="accounting">Accounting</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="information technology">Information Technology</SelectItem>
                          <SelectItem value="human resources">Human Resources</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <div className="flex items-center space-x-2 p-2 border rounded-lg">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{currentUser?.user.user_metadata.firstName + " " + currentUser?.user.user_metadata.lastName}</span>
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
                          <button className="ml-1 text-xs" onClick={() => handleRemoveTag(index)}>
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input placeholder="Add a tag..." onKeyUp={(e) => handleAddTag(e)} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">Auto-saved at 3:42 PM</p>
              <div className="flex items-center space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button variant="outline" size="sm" onClick={() => window.open(`/preview?t=${encodeURIComponent(title)}&e=${encodeURIComponent(description)}`, "_blank")}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handlePublish} disabled={content === "<p><br></p>" || title === "" || description === ""}>
                  <Upload className={isPublishing ? "animate-pulse" : "h-4 w-4 mr-2"} />
                  {isPublishing ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
