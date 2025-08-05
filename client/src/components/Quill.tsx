import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/quill-overrides.css";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "./ui/card";
import { FileText } from "lucide-react";

function Quill({ articleContent, setArticleContent }: { articleContent: string; setArticleContent: (value: string) => void }) {
  localStorage.setItem("previewContent", articleContent);
  const toolbarOptions = [
    { header: [1, 2, 3, 4, 5, 6, false] },
    { list: "ordered" },
    { list: "bullet" },
    { align: [] },
    { color: [] },
    { background: [] },
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <CardTitle>Editor</CardTitle>
        </div>
        <CardDescription>The main content of your article</CardDescription>
      </CardHeader>
      <CardContent>
        <ReactQuill
          className="border border-muted-foreground rounded-md min-h-[420px] overflow-hidden"
          theme="snow"
          value={articleContent}
          placeholder="Write your article content here..."
          onChange={setArticleContent}
          modules={{ toolbar: toolbarOptions }}
        />
      </CardContent>
    </Card>
  );
}

export default Quill;
