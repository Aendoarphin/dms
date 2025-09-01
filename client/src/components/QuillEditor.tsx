import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/quill-overrides.css";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import Quill from "quill";
import ResizeModule from "@botom/quill-resize-module";

Quill.register("modules/resize", ResizeModule);

export default function QuillEditor({
  articleContent,
  setArticleContent,
}: {
  articleContent: string;
  setArticleContent: (value: string) => void;
}) {
  localStorage.setItem("previewContent", articleContent);
  const toolbarOptions = [
    { header: [1, 2, 3, false] },
    { list: "ordered" },
    { list: "bullet" },
    { indent: "-1" },
    { indent: "+1" },
    { align: [] },
    { color: [] },
    { background: [] },
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "link",
    "image",
  ];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <CardTitle>Editor</CardTitle>
        </div>
        <CardDescription>The main content of the article</CardDescription>
      </CardHeader>
      <CardContent>
        <ReactQuill
          className="border border-muted-foreground rounded-md max-h-[420px] overflow-y-auto"
          theme="snow"
          value={articleContent}
          placeholder="Write the article content here..."
          onChange={setArticleContent}
          modules={{
            toolbar: toolbarOptions,
            resize: {
              locale: {
                altTip: "Hold down the alt key to zoom",
                floatLeft: "Left",
                floatRight: "Right",
                center: "Center",
                restore: "Restore",
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
