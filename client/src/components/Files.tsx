import {
  Search,
  FileIcon,
  Calendar,
  HardDrive,
  File,
  Trash,
  Download,
  Upload,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { formatFileSize, formatDate, formatDateTime } from "@/util/helper";
import { toast } from "sonner";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  created: string;
  modified: string;
  owner: string;
  category: string;
}

// Mock file data
const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "project-proposal.pdf",
    type: "PDF",
    size: 2048576, // 2MB in bytes
    created: "2024-01-15T10:30:00Z",
    modified: "2024-01-20T14:45:00Z",
    owner: "John Doe",
    category: "document",
  },
  {
    id: "2",
    name: "dashboard-mockup.figma",
    type: "Design",
    size: 15728640, // 15MB in bytes
    created: "2024-01-10T09:15:00Z",
    modified: "2024-01-25T16:20:00Z",
    owner: "Sarah Wilson",
    category: "design",
  },
  {
    id: "3",
    name: "user-analytics.xlsx",
    type: "Spreadsheet",
    size: 512000, // 500KB in bytes
    created: "2024-01-05T11:00:00Z",
    modified: "2024-01-22T13:30:00Z",
    owner: "Mike Johnson",
    category: "data",
  },
  {
    id: "4",
    name: "app-screenshot.png",
    type: "Image",
    size: 1024000, // 1MB in bytes
    created: "2024-01-12T15:45:00Z",
    modified: "2024-01-18T10:15:00Z",
    owner: "Emily Chen",
    category: "image",
  },
  {
    id: "5",
    name: "meeting-recording.mp4",
    type: "Video",
    size: 104857600, // 100MB in bytes
    created: "2024-01-08T14:00:00Z",
    modified: "2024-01-08T14:00:00Z",
    owner: "David Brown",
    category: "media",
  },
  {
    id: "6",
    name: "api-documentation.md",
    type: "Markdown",
    size: 25600, // 25KB in bytes
    created: "2024-01-20T08:30:00Z",
    modified: "2024-01-24T17:45:00Z",
    owner: "Alex Rodriguez",
    category: "document",
  },
];

export default function Files() {
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [categoryValue, setCategoryValue] = useState("all");
  const [sortValue, setSortValue] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploadLoading(true);

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`File "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);
      setUploadDialogOpen(false);

      // Reset file input
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setUploadDialogOpen(false);

    // Reset file input
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleDeleteFile = async (fileId: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Deleting file with ID: ${fileId}`);
      toast.success("File deleted successfully!");
      setLoading(false);
    }, 1000);
  };

  const handleDownloadFile = (fileId: string, fileName: string) => {
    console.log(`Downloading file: ${fileName}`);
    toast.info(`Downloading ${fileName}...`);
    // Simulate download
  };

  // Filter files based on search and category
  const filteredFiles = mockFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.owner.toLowerCase().includes(searchQuery.toLowerCase());

    if (categoryValue === "all") return matchesSearch;
    return matchesSearch && file.category === categoryValue;
  });

  // Sort files
  switch (sortValue) {
    case "newest":
      filteredFiles.sort((a, b) => {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      });
      break;
    case "oldest":
      filteredFiles.sort((a, b) => {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      });
      break;
    case "name":
      filteredFiles.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      break;
    case "size":
      filteredFiles.sort((a, b) => {
        return b.size - a.size;
      });
      break;
    case "modified":
      filteredFiles.sort((a, b) => {
        return new Date(b.modified).getTime() - new Date(a.modified).getTime();
      });
      break;
  }

  const getCategoryCount = (category: string): number => {
    if (category === "all") return mockFiles.length;
    return mockFiles.filter((file) => file.category === category).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="flex flex-col space-y-6 max-w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Files</h1>
              <p className="text-muted-foreground">
                Manage all files in the system
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search files..."
                  className="w-full lg:w-[300px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Upload Dialog */}
              <Dialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                      Select a file to upload. Supported formats: PDF, DOC,
                      DOCX, TXT, CSV, XLS, XLSX
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* File Drop Zone */}
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Maximum file size: 50MB
                          </p>
                        </div>
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>

                    {/* Selected File Preview */}
                    {selectedFile && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {selectedFile.name}
                          </span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dialog Actions */}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancelUpload}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleFileUpload}
                      disabled={!selectedFile || uploadLoading}
                    >
                      {uploadLoading ? "Uploading..." : "Upload File"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 bg-card rounded-lg">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={categoryValue === "all" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("all")}
              >
                All Files
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("all")}
                </Badge>
              </Button>
              <Button
                variant={categoryValue === "document" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("document")}
              >
                Documents
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("document")}
                </Badge>
              </Button>
              <Button
                variant={categoryValue === "image" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("image")}
              >
                Images
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("image")}
                </Badge>
              </Button>
              <Button
                variant={categoryValue === "design" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("design")}
              >
                Design
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("design")}
                </Badge>
              </Button>
              <Button
                variant={categoryValue === "data" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("data")}
              >
                Data
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("data")}
                </Badge>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                defaultValue="name"
                onValueChange={(value: string) => setSortValue(value)}
              >
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="size">Size (Large)</SelectItem>
                  <SelectItem value="modified">Last Modified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredFiles.length} files
            </p>
          </div>

          {/* Files Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileIcon className="h-5 w-5" />
                <CardTitle>File Library</CardTitle>
              </div>
              <CardDescription>
                Complete list of all uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <div className="flex items-center space-x-2">
                        <File className="h-4 w-4" />
                        <span>Name</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <HardDrive className="h-4 w-4" />
                        <span>Size</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created</span>
                      </div>
                    </TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((file) => (
                    <TableRow key={file.id} className="hover:bg-muted">
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatFileSize(file.size)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(file.created)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(file.modified)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {file.owner}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{file.type}</Badge>
                      </TableCell>
                      <TableCell className="flex justify-center space-x-1">
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleDownloadFile(file.id, file.name)}
                          className="p-2"
                          title="Download File"
                        >
                          <Download strokeWidth={3} />
                        </Button>

                        {/* Delete Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-2 text-destructive hover:text-destructive"
                              title="Delete File"
                            >
                              <Trash strokeWidth={3} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm File Delete</DialogTitle>
                              <DialogDescription>
                                Do you wish to delete the file "{file.name}"?
                                This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteFile(file.id)}
                                disabled={loading}
                              >
                                {loading ? "Deleting..." : "Delete File"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
