import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "./ui/card";
import { FileText } from "lucide-react";

function Quill() {
  const [value, setValue] = useState("");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <CardTitle>Editor</CardTitle>
        </div>
        <CardDescription>The main content of your article</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 border rounded-xl">
        <ReactQuill theme="snow" value={value} onChange={setValue} modules={{ toolbar: true, history: true }} />
      </CardContent>
    </Card>
  );
}

export default Quill;
