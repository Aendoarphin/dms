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
import { useState, useEffect } from "react";
import { formatFileSize, formatDate } from "@/util/helper";
import { toast, Toaster } from "sonner";
import { toasterStyle } from "@/static";
import supabase from "@/util/supabase";

interface FileItem {
  id: string;
  name: string;
  size: number;
  created: string;
}

export default function Files() {
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [sortValue, setSortValue] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);

  // Fetch files when component mounts or refresh changes
  useEffect(() => {
    const fetchFiles = async () => {
      setFilesLoading(true);
      try {
        const allDocs = await supabase.storage.from("documents").list();
        console.log(allDocs.data);

        if (allDocs.data) {
          const allFiles: FileItem[] = allDocs.data.map((file) => ({
            id: file.name,
            name: file.name,
            size: file.metadata?.size || 0,
            created: file.created_at,
          }));
          setFiles(allFiles);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        toast.error("Failed to fetch files");
      } finally {
        setFilesLoading(false);
      }
    };

    fetchFiles();
  }, [refresh]); // Re-run when refresh changes

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 50MB", toasterStyle.error);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploadLoading(true);
    try {
      // Store the file in storage
      const { error } = await supabase.storage
        .from("documents")
        .upload(selectedFile.name, selectedFile);

      if (error) {
        console.error("Error uploading file:", error);
        toast.error(
          "Failed to upload file. Please try again.",
          toasterStyle.error
        );
        return;
      }

      setSelectedFile(null);
      setUploadDialogOpen(false);

      // Reset file input
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      toast.success(
        `File "${selectedFile.name}" uploaded successfully!`,
        toasterStyle.success
      );

      // Trigger re-render by toggling refresh state
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(
        "Failed to upload file. Please try again.",
        toasterStyle.error
      );
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
    try {
      const { error } = await supabase.storage
        .from("documents")
        .remove([fileId]);

      if (error) {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete file", toasterStyle.error);
        return;
      }

      toast.success("File deleted successfully!");
      // Trigger re-render by toggling refresh state
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file", toasterStyle.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (fileId: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(fileId);

      if (error) {
        console.error("Error downloading file:", error);
        toast.error("Failed to download file", toasterStyle.error);
        return;
      }

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.info(`Downloading ${fileName}...`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file", toasterStyle.error);
    }
  };

  // Filter files based on search and category
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
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
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster duration={5000} position="bottom-right" />
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
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-end sm:space-y-0 p-4 bg-card rounded-lg">
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
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filesLoading
                ? "Loading files..."
                : `Showing ${filteredFiles.length} files`}
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
              {filesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <p className="text-muted-foreground">Loading files...</p>
                </div>
              ) : (
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
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) =>
                      file.name.includes("emptyFolder") ? null : (
                        <TableRow key={file.id} className="hover:bg-muted">
                          <TableCell className="font-medium">
                            {file.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatFileSize(file.size)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(file.created)}
                          </TableCell>
                          <TableCell className="flex justify-center space-x-1">
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() =>
                                handleDownloadFile(file.id, file.name)
                              }
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
                                    Do you wish to delete the file "{file.name}
                                    "? This action cannot be undone.
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
                      )
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
