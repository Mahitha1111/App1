import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';

const PDFExtractor = () => {
  const [pdfData, setPdfData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const teamMembers = [
    'Bharvad Bahadur', 'Chauhan Tejashkumar Revadas', 'Chetan Tadvi',
    'Dinbandhu Tadvi', 'Kanchan Vasava', 'Kiranbhai', 'Manishbhau',
    'Nikita Chauhan', 'Nimisha Tadvi', 'Nitin Vasava',
    'Tadvi Rajnishbhai Prabhubhai', 'Tadvi Aruna', 'Tadvi Saurabh Bhai',
    'Tadvi Tejal', 'Tadvichetan', 'Vasava Charlesh Kumar', 'Yuvraj Vasava'
  ];

  const [formData, setFormData] = useState({
    teamMember: teamMembers[0],
    formDate: new Date().toISOString().split('T')[0],
    beneficiaryName: '',
    dob: '',
    gender: '',
    area: '',
    phoneNumber: ''
  });

  const handleFileUpload = async (event) => {
    setLoading(true);
    const files = Array.from(event.target.files);
    
    // Here you would normally send files to your backend
    // For now, we'll simulate the response
    const mockData = files.map(() => ({
      "Benficiary Name": "Sample Name",
      "DOB": "01/01/1990",
      "Gender": "Male",
      "Area": "Sample Area",
      "Phone Number": "1234567890"
    }));

    setPdfData(mockData);
    setCurrentIndex(0);
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const updatedData = [...pdfData];
    updatedData[currentIndex] = {
      "Benficiary Name": formData.beneficiaryName,
      "DOB": formData.dob,
      "Gender": formData.gender,
      "Area": formData.area,
      "Phone Number": formData.phoneNumber
    };
    setPdfData(updatedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>PDF Data Extraction Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* File Upload Section */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload PDFs</span>
                  </p>
                </div>
                <Input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {/* Navigation */}
            {pdfData.length > 0 && (
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  disabled={currentIndex <= 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <span>
                  Card {currentIndex + 1} of {pdfData.length}
                </span>
                <Button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  disabled={currentIndex >= pdfData.length - 1}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Form Fields */}
            {pdfData.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Team Member
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={formData.teamMember}
                      onChange={(e) => handleInputChange('teamMember', e.target.value)}
                    >
                      {teamMembers.map(member => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Form Date
                    </label>
                    <Input
                      type="date"
                      value={formData.formDate}
                      onChange={(e) => handleInputChange('formDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Beneficiary Name
                  </label>
                  <Input
                    value={formData.beneficiaryName}
                    onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <Input
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <Input
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Area
                  </label>
                  <Input
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFExtractor;
