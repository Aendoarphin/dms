import { Search, FolderOpen, Calendar, HardDrive, File, Trash, Download, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { formatFileSize, formatDate, fileIsTooBig } from "@/util/helper";
import { fileSortItems, toasterStyle } from "@/static";
import supabase from "@/util/supabase";
import Loader from "./Loader";
import NoContent from "./NoContent";
import useGetAdmin from "@/hooks/useGetAdmin";
import { toast, Toaster } from "sonner";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./ui/shadcn-io/dropzone";

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [deleteDialogFileId, setDeleteDialogFileId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Safely get admin status
  const getAuthToken = () => {
    try {
      const token = localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`);
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error("Error parsing auth token:", error);
      return null;
    }
  };

  const admin = useGetAdmin(getAuthToken());

  // Helper function to reset file input
  const resetFileInput = () => {
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Fetch files when component mounts or refresh changes
  useEffect(() => {
    const fetchFiles = async () => {
      setFilesLoading(true);
      try {
        const allDocs = await supabase.storage.from("documents").list();

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
        toast.error("Failed to fetch files", toasterStyle.error);
      } finally {
        setFilesLoading(false);
      }
    };

    fetchFiles();
  }, [refresh]);

  const handleFileSelect = (files: File[]) => {
    if (!files || files.length === 0) {
      return;
    }

    // Check if any of the files exceed file size limit
    if (fileIsTooBig(Array.from(files))) {
      toast.error("File size must be less than 50MB", toasterStyle.error);
      resetFileInput();
      return;
    }

    // Convert FileList to array
    const selected: File[] = Array.from(files);
    setSelectedFiles(selected);
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    setUploadLoading(true);
    setUploadProgress(0);

    try {
      if (selectedFiles.length === 1) {
        // Store single file in storage
        const { error } = await supabase.storage.from("documents").upload(selectedFiles[0].name, selectedFiles[0]);

        if (error) {
          console.error("Error uploading file:", error.message);
          toast.error(error.message || "Failed to upload file", toasterStyle.error);
          return;
        }
        setUploadProgress(100);
      } else {
        // Upload multiple files with progress tracking
        let completedUploads = 0;
        const totalFiles = selectedFiles.length;
        const errors = [];

        for (const file of selectedFiles) {
          try {
            const { error } = await supabase.storage.from("documents").upload(file.name, file);

            if (error) {
              errors.push({ file: file.name, error });
            }

            completedUploads++;
            const progress = Math.round((completedUploads / totalFiles) * 100);
            setUploadProgress(progress);
          } catch (err) {
            errors.push({ file: file.name, error: err });
            completedUploads++;
            const progress = Math.round((completedUploads / totalFiles) * 100);
            setUploadProgress(progress);
          }
        }

        if (errors.length > 0) {
          toast.error(`Failed to upload ${errors.length} file(s)`, toasterStyle.error);
          return;
        }
      }

      // Success - show toast and refresh
      setTimeout(() => {
        toast.success("File(s) uploaded successfully", toasterStyle.success);
      }, 500);
      setUploadDialogOpen(false);
      setSelectedFiles([]);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Server error. Please try again later.", toasterStyle.error);
    } finally {
      resetFileInput();
      setUploadLoading(false);
      setUploadProgress(0);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFiles([]);
    setUploadDialogOpen(false);
    setUploadProgress(0);
    resetFileInput();
  };

  const handleDeleteFile = async (fileId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.storage.from("documents").remove([fileId]);

      if (error) {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete file", toasterStyle.error);
        return;
      }

      setTimeout(() => {
        toast.success("File deleted successfully", toasterStyle.success);
      }, 500);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file", toasterStyle.error);
    } finally {
      setDeleteDialogFileId(null);
      setLoading(false);
    }
  };

  const handleDownloadFile = async (fileId: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage.from("documents").download(fileId);

      if (error) {
        console.error("Error downloading file:", error);
        toast.error("Failed to download file", toasterStyle.error);
        return;
      }

      // Create download link with proper cleanup
      const url = window.URL.createObjectURL(data);
      try {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.info(`Downloading ${fileName}...`);
      } finally {
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file", toasterStyle.error);
    }
  };

  // Filter files based on search and exclude emptyFolder
  const filteredFiles = files.filter((file) => {
    if (file.name.includes("emptyFolder")) {
      return false;
    }
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortValue) {
      case "newest":
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      case "oldest":
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return b.size - a.size;
      default:
        return 0;
    }
  });

  if (filesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
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
              <p className="text-muted-foreground">Manage all files in the system</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search files..." className="w-full lg:w-[300px] pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              {/* Upload Dialog */}
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>Select a file to upload. Supported formats: PDF, DOC, DOCX, TXT, CSV, XLS, XLSX</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* File Dropzone */}
                    <Dropzone className="border border-dashed border-neutral-400" disabled={selectedFiles.length > 0} maxSize={1024 * 1024 * 10} maxFiles={5} minSize={1024} onDrop={handleFileSelect} onError={console.error} src={selectedFiles}>
                      <DropzoneEmptyState />
                      <DropzoneContent className="*:whitespace-break-spaces" />
                    </Dropzone>

                    {/* Selected File Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="overflow-y-scroll max-h-60 space-y-1">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">{file.name}</span>
                              <span className="text-xs text-blue-600 dark:text-blue-400 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Dialog Actions */}
                  <div className="flex justify-end space-x-2 items-center">
                    {uploadLoading && <div className="mr-auto text-sm text-muted-foreground">Progress: {uploadProgress}%</div>}
                    <Button variant="outline" onClick={handleCancelUpload} disabled={uploadLoading}>
                      Cancel
                    </Button>
                    <Button onClick={handleFileUpload} disabled={selectedFiles.length === 0 || uploadLoading}>
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
              <Select defaultValue="name" onValueChange={(value: string) => setSortValue(value)}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fileSortItems.map((f, index) => (
                    <SelectItem key={index} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filesLoading ? "Loading files..." : `Showing ${sortedFiles.length} ${sortedFiles.length === 1 ? "file" : "files"}`}</p>
          </div>

          {/* Files Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5" />
                <CardTitle>File Library</CardTitle>
              </div>
              <CardDescription>Complete list of all uploaded files</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedFiles.length > 0 ? (
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
                    {sortedFiles.map((file) => (
                      <TableRow key={file.id} className="hover:bg-muted">
                        <TableCell className="font-medium">{file.name}</TableCell>
                        <TableCell className="text-muted-foreground">{formatFileSize(file.size)}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(file.created)}</TableCell>
                        <TableCell className="flex justify-center space-x-1">
                          <Button variant="link" size="sm" onClick={() => handleDownloadFile(file.id, file.name)} className="p-2" title="Download File">
                            <Download strokeWidth={3} />
                          </Button>
                          {admin && (
                            <Dialog open={deleteDialogFileId === file.id} onOpenChange={(open) => setDeleteDialogFileId(open ? file.id : null)}>
                              <DialogTrigger asChild>
                                <Button variant="link" size="sm" className="p-2 text-destructive hover:text-destructive" title="Delete File">
                                  <Trash strokeWidth={3} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm File Delete</DialogTitle>
                                  <DialogDescription>Do you wish to delete the file "{file.name}"? This action cannot be undone.</DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setDeleteDialogFileId(null)} disabled={loading}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={() => handleDeleteFile(file.id)} disabled={loading}>
                                    {loading ? "Deleting..." : "Delete File"}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <NoContent />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
