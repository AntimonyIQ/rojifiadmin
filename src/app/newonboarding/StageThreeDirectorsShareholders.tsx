import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, User, FileText, Eye, Send, AlertTriangle } from 'lucide-react';
import { ISender, IDirectorAndShareholder } from '@/interface/interface';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StageThreeDirectorsShareholdersProps {
    selectedSender: ISender | null;
    viewDocument?: (document: any) => void;
}

export default function StageThreeDirectorsShareholders({
    selectedSender,
    viewDocument
}: StageThreeDirectorsShareholdersProps) {
    const handleViewDocument = (document: any, person: IDirectorAndShareholder, docType: 'id' | 'address') => {
        if (viewDocument) {
            // Add additional context for the document viewer
            const docWithContext = {
                ...document,
                personName: `${person.firstName} ${person.lastName}`,
                documentType: docType === 'id' ? 'ID Document' : 'Proof of Address',
                personId: person._id
            };
            viewDocument(docWithContext);
        }
    };

    const handleSubmitToSmileId = async (person: IDirectorAndShareholder, docType: 'id' | 'address') => {
        try {
            const document = docType === 'id' ? person.idDocument : person.proofOfAddress;
            console.log(`Submitting ${docType} document to Smile ID for:`, person.firstName, person.lastName);
            console.log('Document details:', document);
            alert(`${person.firstName} ${person.lastName}'s ${docType === 'id' ? 'ID document' : 'proof of address'} submitted to Smile ID for verification.`);
        } catch (error) {
            console.error('Error sending to Smile ID:', error);
            alert('Failed to send to Smile ID. Please try again.');
        }
    };

    const handleReportIssue = (person: IDirectorAndShareholder, docType: 'id' | 'address') => {
        const document = docType === 'id' ? person.idDocument : person.proofOfAddress;
        console.log(`Reporting issue with ${docType} document for:`, person.firstName, person.lastName);
        console.log('Document details:', document);
        alert(`Issue reported for ${person.firstName} ${person.lastName}'s ${docType === 'id' ? 'ID document' : 'proof of address'}.`);
    };

    const getSmileIdBadgeVariant = (status: string) => {
        switch (status) {
            case 'verified': return 'default';
            case 'rejected': return 'destructive';
            case 'under_review': return 'secondary';
            default: return 'outline';
        }
    };

    const formatDate = (date: Date | string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Directors & Shareholders Management
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {selectedSender?.directors && selectedSender.directors.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-lg">
                                    Total: {selectedSender.directors.length} {selectedSender.directors.length === 1 ? 'Person' : 'People'}
                                </h4>
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    {selectedSender.directors.filter(p => p.idDocumentVerified && p.proofOfAddressVerified).length} Fully Verified
                                </Badge>
                            </div>

                            <Separator />

                            {selectedSender.directors.map((person: IDirectorAndShareholder, index: number) => (
                                <div key={person._id || index} className="space-y-4">
                                    <div className="border rounded-lg p-6 bg-gray-50/50">
                                        {/* Header with name and roles */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h5 className="text-lg font-semibold">
                                                        {person.firstName} {person.middleName && `${person.middleName} `}{person.lastName}
                                                    </h5>
                                                    <p className="text-sm text-gray-600 font-medium">{person.jobTitle}</p>
                                                    <p className="text-xs text-gray-500">{person.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {person.isDirector && (
                                                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                                                        Director
                                                    </Badge>
                                                )}
                                                {person.isShareholder && (
                                                    <Badge variant="default" className="bg-purple-100 text-purple-800">
                                                        Shareholder ({person.shareholderPercentage}%)
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Company Basic Information */}
                                        <div className="space-y-4">
                                            <h4 className="text-md font-semibold text-gray-900">Personal Information</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="firstName">First Name</Label>
                                                    <Input
                                                        id="firstName"
                                                        value={person.firstName || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter first name"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="middleName">Middle Name</Label>
                                                    <Input
                                                        id="middleName"
                                                        value={person.middleName || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter middle name"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="lastName">Last Name</Label>
                                                    <Input
                                                        id="lastName"
                                                        value={person.lastName || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter last name"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="jobTitle">Job Title</Label>
                                                    <Input
                                                        id="jobTitle"
                                                        value={person.jobTitle || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter job title"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="role">Role</Label>
                                                    <Input
                                                        id="role"
                                                        value={person.role || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter role"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="shareholderPercentage">Shareholder Percentage (in %)</Label>
                                                    <Input
                                                        id="shareholderPercentage"
                                                        value={person.shareholderPercentage || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter shareholder percentage"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                                    <Input
                                                        id="phoneNumber"
                                                        value={person.phoneNumber || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter phone number"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                                    <Input
                                                        id="dateOfBirth"
                                                        value={new Date(person.dateOfBirth).toDateString() || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter date of birth"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="nationality">Nationality</Label>
                                                    <Input
                                                        id="nationality"
                                                        value={person.nationality || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter nationality"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="idNumber">ID Number</Label>
                                                    <Input
                                                        id="idNumber"
                                                        value={person.idNumber || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter ID number"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="issuedCountry">ID issued Country</Label>
                                                    <Input
                                                        id="issuedCountry"
                                                        value={person.issuedCountry || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter ID issued Country"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="issueDate">ID Issue Date</Label>
                                                    <Input
                                                        id="issueDate"
                                                        value={new Date(person.issueDate).toDateString() || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter ID Issue Date"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="expiryDate">ID Expiry Date</Label>
                                                    <Input
                                                        id="expiryDate"
                                                        value={new Date(person.expiryDate).toDateString() || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter ID expiry date"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="streetAddress">Street Address</Label>
                                                    <Input
                                                        id="streetAddress"
                                                        value={person.streetAddress || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter street address"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="city">City</Label>
                                                    <Input
                                                        id="city"
                                                        value={person.city || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter city"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="postalCode">Postal Code</Label>
                                                    <Input
                                                        id="postalCode"
                                                        value={person.postalCode || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter postal code"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="state">State</Label>
                                                    <Input
                                                        id="state"
                                                        value={person.state || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter state"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div className='pb-5'>
                                                    <Label htmlFor="country">Country</Label>
                                                    <Input
                                                        id="country"
                                                        value={person.country || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter country"
                                                        disabled={true}
                                                    />
                                                </div>


                                            </div>
                                        </div>

                                        {/* Document Verification Section */}
                                        <div className="space-y-4">
                                            <h6 className="font-medium text-sm mb-3 flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Document Verification
                                            </h6>

                                            {/* ID Document */}
                                            <div className="bg-white rounded-lg p-4 border">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h6 className="font-medium text-sm">ID Document</h6>
                                                        <p className="text-xs text-gray-500">{person.idDocument?.name || 'No document uploaded'}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Badge variant={person.idDocumentVerified ? "default" : "secondary"}>
                                                            {person.idDocumentVerified ? 'Verified' : 'Pending'}
                                                        </Badge>
                                                        <Badge variant={getSmileIdBadgeVariant(person.idDocument?.smileIdStatus || 'not_submitted')}>
                                                            Smile ID: {person.idDocument?.smileIdStatus || 'Not Submitted'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {person.idDocument?.url && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewDocument(person.idDocument, person, 'id')}
                                                        >
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={person.idDocument.smileIdStatus === 'verified'}
                                                            onClick={() => handleSubmitToSmileId(person, 'id')}
                                                            className={person.idDocument.smileIdStatus === 'verified' ?
                                                                'bg-green-600 hover:bg-green-700 text-white' : ''}
                                                        >
                                                            <Send className="h-3 w-3 mr-1" />
                                                            {person.idDocument.smileIdStatus === 'verified' ? 'Verified' : 'Submit to Smile ID'}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleReportIssue(person, 'id')}
                                                            className="text-red-600 border-red-300 hover:bg-red-50"
                                                        >
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Report Issue
                                                        </Button>
                                                    </div>
                                                )}
                                                {person.idDocument?.smileIdVerifiedAt && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Verified: {formatDate(person.idDocument.smileIdVerifiedAt)}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Proof of Address */}
                                            <div className="bg-white rounded-lg p-4 border">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h6 className="font-medium text-sm">Proof of Address</h6>
                                                        <p className="text-xs text-gray-500">{person.proofOfAddress?.name || 'No document uploaded'}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Badge variant={person.proofOfAddressVerified ? "default" : "secondary"}>
                                                            {person.proofOfAddressVerified ? 'Verified' : 'Pending'}
                                                        </Badge>
                                                        <Badge variant={getSmileIdBadgeVariant(person.proofOfAddress?.smileIdStatus || 'not_submitted')}>
                                                            Smile ID: {person.proofOfAddress?.smileIdStatus || 'Not Submitted'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {person.proofOfAddress?.url && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewDocument(person.proofOfAddress, person, 'address')}
                                                        >
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={person.proofOfAddress.smileIdStatus === 'verified'}
                                                            onClick={() => handleSubmitToSmileId(person, 'address')}
                                                            className={person.proofOfAddress.smileIdStatus === 'verified' ?
                                                                'bg-green-600 hover:bg-green-700 text-white' : ''}
                                                        >
                                                            <Send className="h-3 w-3 mr-1" />
                                                            {person.proofOfAddress.smileIdStatus === 'verified' ? 'Verified' : 'Submit to Smile ID'}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleReportIssue(person, 'address')}
                                                            className="text-red-600 border-red-300 hover:bg-red-50"
                                                        >
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Report Issue
                                                        </Button>
                                                    </div>
                                                )}
                                                {person.proofOfAddress?.smileIdVerifiedAt && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Verified: {formatDate(person.proofOfAddress.smileIdVerifiedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add separator between directors except for the last one */}
                                    {index < selectedSender.directors.length - 1 && (
                                        <Separator className="my-6" />
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="h-10 w-10 text-gray-400" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-3 text-lg">No Directors & Shareholders Found</h4>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Directors and shareholders information has not been added to the system for this sender yet.
                            </p>
                            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg max-w-lg mx-auto">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-amber-900 mb-1">Action Required</p>
                                        <p className="text-sm text-amber-800">
                                            Request the sender to complete their Directors & Shareholders information before proceeding with the verification process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
