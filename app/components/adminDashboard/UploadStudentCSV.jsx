'use client';

// Dev
import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Loader2,
  Users,
  BookOpen,
  Check,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Papa from 'papaparse';
import { toast } from 'sonner';
import {
  addStudent,
  getCourses,
  testServerAction,
} from '@/lib/actions/students';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CSVUploadStudent = ({ onUploadComplete }) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState([]);
  const [currentStep, setCurrentStep] = useState('upload');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [openPopover, setOpenPopover] = useState(false);

  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  // Use mutation for adding students
  const { mutateAsync: addStudentMutation } = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      toast.success('Student added successfully');
      queryClient.invalidateQueries(['profiles']);
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to add student');
    },
  });

  // Test server action mutation
  const { mutateAsync: testServerActionMutation } = useMutation({
    mutationFn: testServerAction,
  });

  console.log(courses);

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setCsvData([]);
    setValidatedData([]);
    setUploadProgress(0);
    setUploadResults([]);
    setCurrentStep('upload');
    setIsProcessing(false);
    setSelectedCourses([]);
  };

  const testServerActionHandler = async () => {
    try {
      console.log('Testing server action...');
      const result = await testServerActionMutation();
      console.log('Test result:', result);
      toast.success('Server action test successful!');
    } catch (error) {
      console.error('Server action test failed:', error);
      toast.error('Server action test failed: ' + error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      toast.error('Please select a valid CSV file');
      setFile(null);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error('Error parsing CSV file');
          console.error('CSV parsing errors:', results.errors);
          return;
        }

        setCsvData(results.data);
        validateAndTransformData(results.data);
        setCurrentStep('preview');
      },
      error: (error) => {
        toast.error('Failed to parse CSV file');
        console.error('CSV parsing error:', error);
      },
    });
  };

  const validateAndTransformData = (data) => {
    const validated = data.map((row, index) => {
      const errors = [];
      const warnings = [];

      const name =
        row.name?.trim() ||
        row.student_name?.trim() ||
        row.studentName?.trim() ||
        '';
      const email = row.email?.trim().toLowerCase() || '';

      if (!name) {
        errors.push('Name is required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        errors.push('Email is required');
      } else if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }

      return {
        rowIndex: index + 1,
        original: row,
        validated: {
          name,
          email,
          password: 'Student123!',
          courseIds: selectedCourses.map((course) => course.id),
        },
        errors,
        warnings,
        isValid: errors.length === 0,
      };
    });

    setValidatedData(validated);
  };

  // Re-validate data when selected courses change
  React.useEffect(() => {
    if (csvData.length > 0) {
      validateAndTransformData(csvData);
    }
  }, [selectedCourses]);

  const handleCourseSelect = (course) => {
    const isSelected = selectedCourses.some((sc) => sc.id === course.id);

    if (isSelected) {
      // Remove course
      const newSelected = selectedCourses.filter((sc) => sc.id !== course.id);
      setSelectedCourses(newSelected);
    } else {
      // Add course
      const newSelected = [...selectedCourses, course];
      setSelectedCourses(newSelected);
    }
  };

  const handleProcessUpload = async () => {
    const validRows = validatedData.filter((row) => row.isValid);

    if (validRows.length === 0) {
      toast.error('No valid rows to process');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');
    setUploadProgress(0);

    const results = [];
    const total = validRows.length;

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        console.log('Attempting to create student with data:', row.validated);

        // Use the mutation instead of calling addStudent directly
        const response = await addStudentMutation(row.validated);
        console.log('Student creation response:', response);

        results.push({
          ...row,
          status: 'success',
          message: 'Student created successfully',
        });
        toast.success(`Created student: ${row.validated.name}`);
      } catch (error) {
        console.error('Error creating student:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          response: error.response,
          data: error.data,
          status: error.status,
        });

        let errorMessage = 'Failed to create student';

        if (error.message) {
          errorMessage = error.message;
        } else if (error.response) {
          // Server responded with error status
          errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
          if (error.response.data) {
            errorMessage += ` - ${JSON.stringify(error.response.data)}`;
          }
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = 'No response from server - network error';
        }

        results.push({
          ...row,
          status: 'error',
          message: errorMessage,
        });
        toast.error(`Failed to create ${row.validated.name}: ${errorMessage}`);
      }

      setUploadProgress(((i + 1) / total) * 100);

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setUploadResults(results);
    setCurrentStep('results');
    setIsProcessing(false);

    if (onUploadComplete) {
      onUploadComplete(results);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'AnotherPass456',
      },
    ];

    const csv = Papa.unparse(templateData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-indigo-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const validRows = validatedData.filter((row) => row.isValid).length;
  const invalidRows = validatedData.filter((row) => !row.isValid).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-indigo-50 to-emerald-50 hover:from-indigo-100 hover:to-blue-100 border-indigo-200 text-indigo-700 hover:text-indigo-800 transition-all duration-200"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Import Students from CSV
              </DialogTitle>
              <p className="text-sm text-slate-600">
                Upload a CSV file to bulk import student accounts
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {/* Upload Step */}
          {currentStep === 'upload' && (
            <div className="space-y-6 p-2">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  Upload CSV File
                </h3>
                <p className="text-slate-500 mb-4">
                  Select a CSV file containing student information
                </p>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer max-w-xs mx-auto"
                />
              </div>

              {/* Course Selection */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Select Courses to Enroll Students In
                </Label>
                <Popover open={openPopover} onOpenChange={setOpenPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      type="button"
                      className="w-full justify-between bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-indigo-300 focus:ring-indigo-100 transition-all duration-200 h-auto min-h-[40px] p-3"
                    >
                      <div className="flex flex-wrap gap-1 flex-1 text-left">
                        {loadingCourses ? (
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Loading courses...
                          </div>
                        ) : selectedCourses.length > 0 ? (
                          selectedCourses.map((course) => (
                            <Badge
                              key={course.id}
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 border-blue-200 text-xs"
                            >
                              {course.title}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-slate-500">
                            Select courses (optional)
                          </span>
                        )}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search courses..." />
                      <CommandEmpty>No course found.</CommandEmpty>
                      <CommandGroup>
                        {courses.map((course) => {
                          const isSelected = selectedCourses.some(
                            (sc) => sc.id === course.id,
                          );
                          return (
                            <CommandItem
                              key={course.id}
                              value={course.title}
                              onSelect={() => handleCourseSelect(course)}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  isSelected ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{course.title}</span>
                                {course.description && (
                                  <span className="text-xs text-slate-500 truncate">
                                    {course.description}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-slate-500">
                  All imported students will be enrolled in the selected
                  courses. You can select multiple courses.
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-medium text-indigo-800 mb-2">
                  CSV Format Requirements:
                </h4>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>
                    • <strong>name</strong>: Student's full name (required)
                  </li>
                  <li>
                    • <strong>email</strong>: Student's email address (required)
                  </li>
                  <li>
                    • <strong>password</strong>: Account password (optional,
                    default provided)
                  </li>
                  <li>
                    • <strong>Courses</strong>: Selected above will be applied
                    to all students
                  </li>
                </ul>
              </div>

              {/* Test Server Action Button */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Debug Tools:
                </h4>
                <Button
                  onClick={testServerActionHandler}
                  variant="outline"
                  size="sm"
                  className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                >
                  Test Server Action
                </Button>
                <p className="text-xs text-yellow-600 mt-2">
                  Click this to test if server actions are working properly
                </p>
              </div>
            </div>
          )}

          {/* Preview Step */}
          {currentStep === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-200"
                  >
                    {validRows} Valid
                  </Badge>
                  {invalidRows > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      {invalidRows} Invalid
                    </Badge>
                  )}
                  {selectedCourses.length > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {selectedCourses.length} Course(s) Selected
                    </Badge>
                  )}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validatedData.slice(0, 10).map((row, index) => (
                      <TableRow
                        key={index}
                        className={!row.isValid ? 'bg-red-50' : ''}
                      >
                        <TableCell>{row.rowIndex}</TableCell>
                        <TableCell>{row.validated.name}</TableCell>
                        <TableCell>{row.validated.email}</TableCell>
                        <TableCell>
                          {selectedCourses.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedCourses.map((course) => (
                                <Badge
                                  key={course.id}
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                >
                                  {course.title}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              No courses selected
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {row.errors.map((error, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-red-50 text-red-700 text-xs"
                              >
                                {error}
                              </Badge>
                            ))}
                            {row.warnings.map((warning, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-yellow-50 text-yellow-700 text-xs"
                              >
                                {warning}
                              </Badge>
                            ))}
                            {row.isValid &&
                              row.errors.length === 0 &&
                              row.warnings.length === 0 && (
                                <Badge
                                  variant="outline"
                                  className="bg-indigo-50 text-indigo-700 text-xs"
                                >
                                  Valid
                                </Badge>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {validatedData.length > 10 && (
                <p className="text-sm text-slate-500 text-center">
                  Showing first 10 rows of {validatedData.length} total rows
                </p>
              )}
            </div>
          )}

          {/* Processing Step */}
          {currentStep === 'processing' && (
            <div className="space-y-6 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  Processing Students...
                </h3>
                <p className="text-slate-500 mb-4">
                  Creating student accounts and enrollments
                </p>
                <Progress value={uploadProgress} className="max-w-md mx-auto" />
                <p className="text-sm text-slate-500 mt-2">
                  {Math.round(uploadProgress)}% complete
                </p>
              </div>
            </div>
          )}

          {/* Results Step */}
          {currentStep === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Upload Results</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-200"
                  >
                    {uploadResults.filter((r) => r.status === 'success').length}{' '}
                    Successful
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    {uploadResults.filter((r) => r.status === 'error').length}{' '}
                    Failed
                  </Badge>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.rowIndex}</TableCell>
                        <TableCell>{result.validated.name}</TableCell>
                        <TableCell>{result.validated.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            <Badge
                              variant="outline"
                              className={getStatusColor(result.status)}
                            >
                              {result.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {result.message}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          {currentStep === 'upload' && (
            <div className="flex gap-2">
              <Button
                className="bg-gradient-to-r mt-2 from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                 text-white transition-all duration-200"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                onClick={downloadTemplate}
                className="bg-gradient-to-r mt-2 from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                 text-white transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-1" />
                Download Template
              </Button>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('upload')}
              >
                Back
              </Button>
              <Button
                onClick={handleProcessUpload}
                disabled={validRows === 0 || isProcessing}
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                Import {validRows} Students
              </Button>
            </div>
          )}

          {currentStep === 'processing' && (
            <Button variant="outline" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </Button>
          )}

          {currentStep === 'results' && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setCurrentStep('upload');
                  setFile(null);
                  setCsvData([]);
                  setValidatedData([]);
                  setUploadResults([]);
                  setSelectedCourses([]);
                }}
                className="bg-gradient-to-r from-indigo-500 to-indigo-500 text-white"
              >
                Import More
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVUploadStudent;
