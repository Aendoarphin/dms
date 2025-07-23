import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { FileText, ImageIcon, Link, Settings } from "lucide-react";
import { useRef, useState } from "react";

function RichTextEditor() {
  const italicRef = useRef(false);
  const boldRef = useRef(false);
  const underlineRef = useRef(false);
  const textContentRef = useRef("");

  const toggleBold = (value: boolean) => {
    boldRef.current = value;
  };
  const toggleItalic = (value: boolean) => {
    italicRef.current = value;
  };
  const toggleUnderline = (value: boolean) => {
    underlineRef.current = value;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Content Editor</CardTitle>
            </div>
          </div>
          <CardDescription>Rich text editor for your article content</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mock Rich Text Editor */}
          <div className="border rounded-lg min-h-[400px] p-4 bg-card">
            <div className="border-b pb-2 mb-4 flex items-center space-x-2 text-sm">
              <Button variant="ghost" size="sm" title="Add Image">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Add Link">
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant={boldRef.current === true ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => toggleBold(!boldRef.current)}>
                <strong>B</strong>
              </Button>
              <Button
                variant={italicRef.current ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => toggleItalic(!italicRef.current)}>
                <em>I</em>
              </Button>
              <Button
                variant={underlineRef.current ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => toggleUnderline(!underlineRef.current)}>
                <u>U</u>
              </Button>
              <div className="h-4 w-px bg-border mx-2" />
              <Select defaultValue="paragraph">
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="heading1" className="text-3xl font-bold">
                    Heading 1
                  </SelectItem>
                  <SelectItem value="heading2" className="text-2xl font-semibold">
                    Heading 2
                  </SelectItem>
                  <SelectItem value="heading3" className="text-xl font-semibold">
                    Heading 3
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <textarea
              name="content"
              id="content"
              style={{
                resize: "none",
                maxWidth: "100%",
                width: "100%",
                height: "400px",
              }}
              className="outline-none"
              placeholder="Write your article content here..."></textarea>
              {/* continue here */}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default RichTextEditor;
