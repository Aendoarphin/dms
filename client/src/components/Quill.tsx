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
      <CardContent>
        <ReactQuill className="border border-muted-foreground rounded-md h-[420px] overflow-hidden font-stretch-200%" theme="snow" value={value} placeholder="Write something..." onChange={setValue} modules={{ toolbar: true, history: true }} />
      </CardContent>
    </Card>
  );
}

export default Quill;
