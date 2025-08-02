'use client';

import React, { useState, useCallback } from 'react';
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
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Loader2,
  Users,
} from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { addStudent, getCourses } from '@/lib/actions/students';
import { useQuery } from '@tanstack/react-query';

const CSVUploadStudent = ({ onUploadComplete }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState([]);
  const [currentStep, setCurrentStep] = useState('upload');

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setCsvData([]);
    setValidatedData([]);
    setUploadProgress(0);
    setUploadResults([]);
    setCurrentStep('upload');
    setIsProcessing(false);
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

      let courseIds = [];
      // const coursesField = row.courses || row.course_ids || row.courseIds || '';

      // if (coursesField) {
      //   try {
      //     let courseList = [];

      //     if (coursesField.startsWith('[') && coursesField.endsWith(']')) {
      //       courseList = JSON.parse(coursesField);
      //     } else {
      //       courseList = coursesField.split(',').map(c => c.trim());
      //     }

      //     courseIds = courseList.map(courseIdentifier => {
      //       const courseById = courses.find(c => c.id.toString() === courseIdentifier.toString());
      //       if (courseById) return courseById.id;

      //       const courseByTitle = courses.find(c =>
      //         c.title.toLowerCase() === courseIdentifier.toLowerCase()
      //       );
      //       if (courseByTitle) return courseByTitle.id;

      //       warnings.push(`Course "${courseIdentifier}" not found`);
      //       return null;
      //     }).filter(Boolean);

      //   } catch (e) {
      //     warnings.push('Invalid course format');
      //   }
      // }

      return {
        rowIndex: index + 1,
        original: row,
        validated: {
          name,
          email,
          password: 'Student123!',
          // courseIds
        },
        errors,
        warnings,
        isValid: errors.length === 0,
      };
    });

    setValidatedData(validated);
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
        await addStudent(row.validated);
        results.push({
          ...row,
          status: 'success',
          message: 'Student created successfully',
        });
        toast.success(`Created student: ${row.validated.name}`);
      } catch (error) {
        results.push({
          ...row,
          status: 'error',
          message: error.message || 'Failed to create student',
        });
        toast.error(`Failed to create ${row.validated.name}: ${error.message}`);
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
        // courses: '1,2,3'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'AnotherPass456',
        // courses: '1,2,3'
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
                    • <strong>courses</strong>: Talha Jab IDs hongi tb hum isko uncomment kryn gy
                    {/* Course titles or IDs,
                    comma-separated (optional) */}
                  </li>
                </ul>
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
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      {/* <TableHead>Courses</TableHead> */}
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
                        {/* <TableCell>
                          {row.validated.courseIds.length > 0 ? (
                            <span className="text-sm text-slate-600">
                              {row.validated.courseIds.length} course(s)
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">None</span>
                          )}
                        </TableCell> */}
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
