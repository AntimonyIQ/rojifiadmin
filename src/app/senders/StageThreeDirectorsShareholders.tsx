import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, User, FileText, MapPin, Eye, Send, AlertTriangle, Calendar, Mail, Phone, CreditCard } from 'lucide-react';
import { ISender, IDirectorAndShareholder } from '@/interface/interface';

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

                                        {/* Personal Information Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">Email:</span>
                                                <span>{person.email || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">Phone:</span>
                                                <span>+{person.phoneCode} {person.phoneNumber}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">DOB:</span>
                                                <span>{formatDate(person.dateOfBirth)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">Nationality:</span>
                                                <span>{person.nationality}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <CreditCard className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">ID Type:</span>
                                                <span>{person.idType === 'passport' ? 'Passport' : 'Driver\'s License'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium">ID Number:</span>
                                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{person.idNumber}</span>
                                            </div>
                                        </div>

                                        {/* Address Information */}
                                        <div className="bg-white rounded-lg p-4 mb-6">
                                            <h6 className="font-medium text-sm mb-3 flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Address Information
                                            </h6>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="font-medium">Street:</span> {person.streetAddress}
                                                </div>
                                                <div>
                                                    <span className="font-medium">City:</span> {person.city}
                                                </div>
                                                <div>
                                                    <span className="font-medium">State:</span> {person.state}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Country:</span> {person.country}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Postal Code:</span> {person.postalCode}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Issued Country:</span> {person.issuedCountry}
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
