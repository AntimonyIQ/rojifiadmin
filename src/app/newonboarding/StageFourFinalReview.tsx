import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Building2, Eye, FileText, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ISender, IDirectorAndShareholder, ISenderDocument } from '@/interface/interface';
import { WhichDocument } from '@/enums/enums';

interface StageFourFinalReviewProps {
    selectedSender: ISender | null;
    editableFormData: Partial<ISender>;
    handleFormInputChange: (field: keyof ISender, value: any) => void;
    viewDocument: (document: any) => void;
}

// Form options from StageOne
const anticipatedSourceOptions = [
    { value: "sales_revenue_business_earnings", label: "Sales Revenue/Business Earnings" },
    { value: "customer_funds", label: "Customer Funds" },
    { value: "investors_funds", label: "Investors Funds" },
    { value: "company_treasury", label: "Company Treasury" },
    { value: "crowdfunding", label: "Crowdfunding" },
    { value: "investment_returns", label: "Investment Returns" },
    { value: "loan_debt_financing", label: "Loan/Debt Financing" },
    { value: "ico", label: "ICO (Initial Coin Offering)" },
    { value: "grant", label: "Grant" },
    { value: "other", label: "Other" }
];

const sourceOfWealthOptions = [
    { value: "sales_revenue_business_earnings", label: "Sales Revenue/Business Earnings" },
    { value: "investors_funds", label: "Investors Funds" },
    { value: "company_treasury", label: "Company Treasury" },
    { value: "crowdfunding", label: "Crowdfunding" },
    { value: "investment_returns", label: "Investment Returns" },
    { value: "loan_debt_financing", label: "Loan/Debt Financing" },
    { value: "ico", label: "ICO (Initial Coin Offering)" },
    { value: "grant", label: "Grant" },
    { value: "other", label: "Other" }
];

export default function StageFourFinalReview({
    selectedSender,
    editableFormData,
    handleFormInputChange,
    viewDocument
}: StageFourFinalReviewProps) {
    // Edit mode state
    const [isEditMode, setIsEditMode] = React.useState(false);

    const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
        const currentArray = (editableFormData[field as keyof ISender] as string[]) || []
        if (checked) {
            handleFormInputChange(field as keyof ISender, [...currentArray, value])
        } else {
            handleFormInputChange(field as keyof ISender, currentArray.filter(item => item !== value))
        }
    }

    const documentTitle = (which: WhichDocument) => {
        switch (which) {
            case WhichDocument.CERTIFICATE_INCORPORATION:
                return 'CAC Certificate of Incorporation';
            case WhichDocument.MEMORANDUM_ARTICLES:
                return 'Memorandum and Articles of Association (MEMART)';
            case WhichDocument.INCORPORATION_STATUS:
                return 'CAC Status Report';
            case WhichDocument.PROOF_ADDRESS:
                return 'Business Proof of Address (Recent Utility Bill, Bank Statement, Etc...)';
            default:
                return 'Document';
        }
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header with Edit Toggle */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <FileText className="h-6 w-6 text-blue-600" />
                            Final Review & Summary
                        </CardTitle>
                        <div className="flex items-center gap-3">
                            <Label htmlFor="edit-mode" className="text-sm font-medium">
                                Edit Mode
                            </Label>
                            <Switch
                                id="edit-mode"
                                checked={isEditMode}
                                onCheckedChange={setIsEditMode}
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Stage 1: Company Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Company Basic Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Basic Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="businessName">Business Name</Label>
                                <Input
                                    id="businessName"
                                    value={editableFormData.businessName || ''}
                                    onChange={(e) => handleFormInputChange('businessName', e.target.value)}
                                    placeholder="Enter business name"
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tradingName">Trading Name</Label>
                                <Input
                                    id="tradingName"
                                    value={editableFormData.tradingName || ''}
                                    onChange={(e) => handleFormInputChange('tradingName', e.target.value)}
                                    placeholder="Enter trading name"
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div>
                                <Label htmlFor="businessRegistrationNumber">Registration Number</Label>
                                <Input
                                    id="businessRegistrationNumber"
                                    value={editableFormData.businessRegistrationNumber || ''}
                                    onChange={(e) => handleFormInputChange('businessRegistrationNumber', e.target.value)}
                                    placeholder="Enter registration number"
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={editableFormData.website || ''}
                                    onChange={(e) => handleFormInputChange('website', e.target.value)}
                                    placeholder="Enter website URL"
                                    disabled={!isEditMode}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={editableFormData.email || ''}
                                    onChange={(e) => handleFormInputChange('email', e.target.value)}
                                    placeholder="Enter email"
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    value={editableFormData.phoneNumber || ''}
                                    onChange={(e) => handleFormInputChange('phoneNumber', e.target.value)}
                                    placeholder="Enter phone number"
                                    disabled={!isEditMode}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Business Address</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="businessAddress">Street Address</Label>
                                <Input
                                    id="businessAddress"
                                    value={editableFormData.businessAddress || ''}
                                    onChange={(e) => handleFormInputChange('businessAddress', e.target.value)}
                                    placeholder="Enter street address"
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div>
                                <Label htmlFor="businessCity">City</Label>
                                <Input
                                    id="businessCity"
                                    value={editableFormData.businessCity || ''}
                                    onChange={(e) => handleFormInputChange('businessCity', e.target.value)}
                                    placeholder="Enter city"
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div>
                                <Label htmlFor="businessState">State/Province</Label>
                                <Input
                                    id="businessState"
                                    value={editableFormData.businessState || ''}
                                    onChange={(e) => handleFormInputChange('businessState', e.target.value)}
                                    placeholder="Enter state/province"
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div>
                                <Label htmlFor="businessPostalCode">Postal Code</Label>
                                <Input
                                    id="businessPostalCode"
                                    value={editableFormData.businessPostalCode || ''}
                                    onChange={(e) => handleFormInputChange('businessPostalCode', e.target.value)}
                                    placeholder="Enter postal code"
                                    disabled={!isEditMode}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Financial Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Financial Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="volume">Expected Monthly Volume</Label>
                                <Input
                                    id="volume"
                                    type="number"
                                    value={editableFormData.volume || ''}
                                    onChange={(e) => handleFormInputChange('volume', parseFloat(e.target.value))}
                                    placeholder="Enter expected volume"
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div>
                                <Label htmlFor="percentageOwnership">Percentage Ownership</Label>
                                <Input
                                    id="percentageOwnership"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editableFormData.percentageOwnership || ''}
                                    onChange={(e) => handleFormInputChange('percentageOwnership', parseFloat(e.target.value))}
                                    placeholder="Enter ownership percentage"
                                    disabled={!isEditMode}
                                />
                            </div>
                        </div>

                        {/* Source of Wealth */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-3 block">Source of Wealth</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {sourceOfWealthOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`source-wealth-${option.value}`}
                                            checked={(editableFormData.sourceOfWealth || []).includes(option.value)}
                                            onCheckedChange={(checked) => handleMultiSelectChange('sourceOfWealth', option.value, checked as boolean)}
                                            disabled={!isEditMode}
                                        />
                                        <Label
                                            htmlFor={`source-wealth-${option.value}`}
                                            className="text-xs font-normal leading-tight"
                                        >
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Anticipated Source */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-3 block">Anticipated Source of Funds</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {anticipatedSourceOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`anticipated-source-${option.value}`}
                                            checked={(editableFormData.anticipatedSourceOfFundsOnDunamis || []).includes(option.value)}
                                            onCheckedChange={(checked) => handleMultiSelectChange('anticipatedSourceOfFundsOnDunamis', option.value, checked as boolean)}
                                            disabled={!isEditMode}
                                        />
                                        <Label
                                            htmlFor={`anticipated-source-${option.value}`}
                                            className="text-xs font-normal leading-tight"
                                        >
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stage 2: Document Review */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Document Review
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedSender?.documents && selectedSender.documents.length > 0 ? (
                        selectedSender.documents.map((doc: ISenderDocument, index: number) => {
                            const smileStatus = doc.smileIdStatus;
                            return (
                                <div key={index} className={`p-4 border rounded-lg space-y-3 bg-white ${doc.issue ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {documentTitle(doc.which)}
                                                </p>
                                                <p className="text-xs text-muted-foreground break-all max-w-xs">{doc.name}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <Badge variant={doc.kycVerified ? 'default' : 'secondary'} className="text-[10px] px-2 py-0.5">
                                                        {doc.kycVerified ? 'KYC Verified' : 'Pending KYC'}
                                                    </Badge>
                                                    {smileStatus && (
                                                        <Badge
                                                            variant={smileStatus === 'verified' ? 'default' : smileStatus === 'rejected' ? 'destructive' : 'secondary'}
                                                            className="text-[10px] px-2 py-0.5"
                                                        >
                                                            Smile ID: {smileStatus}
                                                        </Badge>
                                                    )}
                                                    {doc.issue && (
                                                        <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                                                            Issue Reported
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                            <Button variant="outline" size="sm" onClick={() => viewDocument(doc)}>
                                                <Eye className="h-4 w-4 mr-1" /> View
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">No documents uploaded yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stage 3: Directors & Shareholders */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Directors & Shareholders
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {selectedSender?.directors && selectedSender.directors.length > 0 ? (
                        selectedSender.directors.map((person: IDirectorAndShareholder, index: number) => (
                            <div
                                key={index}
                                className={`p-6 border rounded-lg space-y-4 ${(person as any).issueReported ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-4 w-full">
                                        {/* Name Fields */}
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-900 mb-3 block">Personal Information</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor={`firstName-${index}`} className="text-xs">First Name</Label>
                                                    <Input
                                                        id={`firstName-${index}`}
                                                        value={person.firstName || ''}
                                                        onChange={(e) => {
                                                            const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                            updatedDirectors[index] = { ...updatedDirectors[index], firstName: e.target.value };
                                                            handleFormInputChange('directors', updatedDirectors);
                                                        }}
                                                        placeholder="First name"
                                                        className="text-sm"
                                                        disabled={!isEditMode}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`middleName-${index}`} className="text-xs">Middle Name</Label>
                                                    <Input
                                                        id={`middleName-${index}`}
                                                        value={person.middleName || ''}
                                                        onChange={(e) => {
                                                            const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                            updatedDirectors[index] = { ...updatedDirectors[index], middleName: e.target.value };
                                                            handleFormInputChange('directors', updatedDirectors);
                                                        }}
                                                        placeholder="Middle name"
                                                        className="text-sm"
                                                        disabled={!isEditMode}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`lastName-${index}`} className="text-xs">Last Name</Label>
                                                    <Input
                                                        id={`lastName-${index}`}
                                                        value={person.lastName || ''}
                                                        onChange={(e) => {
                                                            const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                            updatedDirectors[index] = { ...updatedDirectors[index], lastName: e.target.value };
                                                            handleFormInputChange('directors', updatedDirectors);
                                                        }}
                                                        placeholder="Last name"
                                                        className="text-sm"
                                                        disabled={!isEditMode}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Role and Shareholding */}
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-900 mb-3 block">Role & Shareholding</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor={`role-${index}`} className="text-xs">Role</Label>
                                                    <select
                                                        id={`role-${index}`}
                                                        value={person.role || 'Director'}
                                                        onChange={(e) => {
                                                            const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                            updatedDirectors[index] = { ...updatedDirectors[index], role: e.target.value };
                                                            handleFormInputChange('directors', updatedDirectors);
                                                        }}
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        disabled={!isEditMode}
                                                    >
                                                        <option value="Director">Director</option>
                                                        <option value="CEO">CEO</option>
                                                        <option value="CFO">CFO</option>
                                                        <option value="CTO">CTO</option>
                                                        <option value="Secretary">Secretary</option>
                                                        <option value="Chairman">Chairman</option>
                                                        <option value="Manager">Manager</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`isShareholder-${index}`}
                                                            checked={person.isShareholder || false}
                                                            onCheckedChange={(checked) => {
                                                                const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                                updatedDirectors[index] = { ...updatedDirectors[index], isShareholder: checked as boolean };
                                                                handleFormInputChange('directors', updatedDirectors);
                                                            }}
                                                            disabled={!isEditMode}
                                                        />
                                                        <Label htmlFor={`isShareholder-${index}`} className="text-xs">
                                                            Is Shareholder
                                                        </Label>
                                                    </div>
                                                    {person.isShareholder && (
                                                        <div>
                                                            <Label htmlFor={`shareholderPercentage-${index}`} className="text-xs">Share Percentage (%)</Label>
                                                            <Input
                                                                id={`shareholderPercentage-${index}`}
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                value={person.shareholderPercentage || ''}
                                                                onChange={(e) => {
                                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                                    updatedDirectors[index] = { ...updatedDirectors[index], shareholderPercentage: parseFloat(e.target.value) };
                                                                    handleFormInputChange('directors', updatedDirectors);
                                                                }}
                                                                placeholder="Percentage"
                                                                className="text-sm"
                                                                disabled={!isEditMode}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Status Badges */}
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <Badge variant="outline" className="text-xs">
                                                    {person.role}
                                                </Badge>
                                                {person.isShareholder && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {person.shareholderPercentage}% Shares
                                                    </Badge>
                                                )}
                                                {(person as any).issueReported && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Issue Reported
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div>
                                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">Personal Information</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`email-${index}`} className="text-xs">Email</Label>
                                            <Input
                                                id={`email-${index}`}
                                                type="email"
                                                value={person.email || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], email: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="Email address"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`jobTitle-${index}`} className="text-xs">Job Title</Label>
                                            <Input
                                                id={`jobTitle-${index}`}
                                                value={person.jobTitle || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], jobTitle: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="Job title"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`dateOfBirth-${index}`} className="text-xs">Date of Birth</Label>
                                            <Input
                                                id={`dateOfBirth-${index}`}
                                                type="date"
                                                value={person.dateOfBirth ? new Date(person.dateOfBirth).toISOString().split('T')[0] : ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], dateOfBirth: new Date(e.target.value) };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`nationality-${index}`} className="text-xs">Nationality</Label>
                                            <Input
                                                id={`nationality-${index}`}
                                                value={person.nationality || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], nationality: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="Nationality"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone Information */}
                                <div>
                                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">Phone Information</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs">Phone Code</Label>
                                            <Input
                                                value={person.phoneCode || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], phoneCode: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="Country code"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Phone Number</Label>
                                            <Input
                                                value={person.phoneNumber || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], phoneNumber: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="Phone number"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ID Information */}
                                <div>
                                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">ID Information</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`idType-${index}`} className="text-xs">ID Type</Label>
                                            <select
                                                id={`idType-${index}`}
                                                value={person.idType || 'passport'}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], idType: e.target.value as 'passport' | 'drivers_license' };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                disabled={!isEditMode}
                                            >
                                                <option value="passport">Passport</option>
                                                <option value="drivers_license">Driver's License</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor={`idNumber-${index}`} className="text-xs">ID Number</Label>
                                            <Input
                                                id={`idNumber-${index}`}
                                                value={person.idNumber || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], idNumber: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="ID number"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div>
                                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">Address Information</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`streetAddress-${index}`} className="text-xs">Street Address</Label>
                                            <Input
                                                id={`streetAddress-${index}`}
                                                value={person.streetAddress || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], streetAddress: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="Street address"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`city-${index}`} className="text-xs">City</Label>
                                            <Input
                                                id={`city-${index}`}
                                                value={person.city || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], city: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="City"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`state-${index}`} className="text-xs">State/Province</Label>
                                            <Input
                                                id={`state-${index}`}
                                                value={person.state || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], state: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="State/Province"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`postalCode-${index}`} className="text-xs">Postal Code</Label>
                                            <Input
                                                id={`postalCode-${index}`}
                                                value={person.postalCode || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], postalCode: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="Postal code"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`country-${index}`} className="text-xs">Country</Label>
                                            <Input
                                                id={`country-${index}`}
                                                value={person.country || ''}
                                                onChange={(e) => {
                                                    const updatedDirectors = [...(editableFormData.directors || selectedSender?.directors || [])];
                                                    updatedDirectors[index] = { ...updatedDirectors[index], country: e.target.value };
                                                    handleFormInputChange('directors', updatedDirectors);
                                                }}
                                                placeholder="Country"
                                                className="text-sm"
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-700 text-sm">Documents</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* ID Document */}
                                        <div className="p-3 border rounded-md bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">ID Document</p>
                                                    <p className="text-xs text-gray-500">{person.idDocument?.name || 'Not uploaded'}</p>
                                                    {person.idDocument?.smileIdStatus && (
                                                        <Badge
                                                            variant={person.idDocument.smileIdStatus === 'verified' ? 'default' :
                                                                person.idDocument.smileIdStatus === 'rejected' ? 'destructive' : 'secondary'}
                                                            className="text-[10px] px-1 py-0.5 mt-1"
                                                        >
                                                            {person.idDocument.smileIdStatus}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {person.idDocument && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => viewDocument({
                                                            ...person.idDocument,
                                                            personName: `${person.firstName} ${person.lastName}`,
                                                            documentType: 'ID Document'
                                                        })}
                                                    >
                                                        <Eye className="h-3 w-3 mr-1" /> View
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Proof of Address */}
                                        <div className="p-3 border rounded-md bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">Proof of Address</p>
                                                    <p className="text-xs text-gray-500">{person.proofOfAddress?.name || 'Not uploaded'}</p>
                                                    {person.proofOfAddress?.smileIdStatus && (
                                                        <Badge
                                                            variant={person.proofOfAddress.smileIdStatus === 'verified' ? 'default' :
                                                                person.proofOfAddress.smileIdStatus === 'rejected' ? 'destructive' : 'secondary'}
                                                            className="text-[10px] px-1 py-0.5 mt-1"
                                                        >
                                                            {person.proofOfAddress.smileIdStatus}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {person.proofOfAddress && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => viewDocument({
                                                            ...person.proofOfAddress,
                                                            personName: `${person.firstName} ${person.lastName}`,
                                                            documentType: 'Proof of Address'
                                                        })}
                                                    >
                                                        <Eye className="h-3 w-3 mr-1" /> View
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm text-gray-500">No directors or shareholders added yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
