import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Building2,
    Send,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    Shield,
    Users,
    FileText,
    Globe,
    Calendar,
    User,
    CreditCard,
    Target,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    Info,
    TrendingUp,
    Lock,
    Briefcase
} from 'lucide-react';
import { ISender, IDirectorAndShareholder } from '@/interface/interface';

interface StageFourFinalReviewProps {
    selectedSender: ISender | null;
    editableFormData: Partial<ISender>;
}

export default function StageFourFinalReview({
    selectedSender,
    editableFormData
}: StageFourFinalReviewProps) {
    const formatCurrency = (amount: number | undefined | null) => {
        if (!amount) return 'Not specified';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: Date | string | undefined | null) => {
        if (!date) return 'Not specified';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusIcon = (verified: boolean | undefined) => {
        return verified ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
            <Clock className="h-4 w-4 text-amber-600" />
        );
    };

    const getComplianceIcon = (compliant: boolean | undefined) => {
        if (compliant === true) return <CheckCircle className="h-4 w-4 text-green-600" />;
        if (compliant === false) return <XCircle className="h-4 w-4 text-red-600" />;
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    };

    const InfoItem = ({ icon: Icon, label, value, className = "" }: {
        icon: any,
        label: string,
        value: string | number | undefined | null,
        className?: string
    }) => (
        <div className={`flex items-start gap-3 ${className}`}>
            <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <Icon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <p className="text-sm text-gray-900 break-words">{value || 'Not specified'}</p>
            </div>
        </div>
    );

    const VerificationItem = ({ label, verified, verifiedAt }: {
        label: string,
        verified: boolean | undefined,
        verifiedAt?: Date | string | null
    }) => (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
                {getStatusIcon(verified)}
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant={verified ? "default" : "secondary"}>
                    {verified ? 'Verified' : 'Pending'}
                </Badge>
                {verified && verifiedAt && (
                    <span className="text-xs text-gray-500">
                        {formatDate(verifiedAt)}
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Send className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Final Review & Bank Submission</h2>
                            <p className="text-sm text-gray-600 font-normal">
                                Comprehensive review of {editableFormData.businessName || selectedSender?.businessName || 'sender'} application
                            </p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Rojifi ID</p>
                                <p className="text-sm text-gray-900 font-mono">{selectedSender?.rojifiId || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Created</p>
                                <p className="text-sm text-gray-900">{formatDate(selectedSender?.createdAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Status</p>
                                <Badge variant="default" className="bg-blue-100 text-blue-800">
                                    {selectedSender?.status || 'pending'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Information */}
                <Card className="h-fit">
                    <CardHeader className="bg-gray-50 rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            Company Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <InfoItem icon={Building2} label="Business Name" value={editableFormData.businessName} />
                        <InfoItem icon={Building2} label="Company Name" value={editableFormData.name} />
                        <InfoItem icon={Building2} label="Trading Name" value={editableFormData.tradingName} />
                        <InfoItem icon={CreditCard} label="Registration Number" value={editableFormData.businessRegistrationNumber} />
                        <InfoItem icon={Globe} label="Website" value={editableFormData.website} />
                        <InfoItem icon={Briefcase} label="Legal Form" value={editableFormData.legalForm} />
                        <InfoItem icon={Target} label="Company Activity" value={editableFormData.companyActivity} />
                        <InfoItem icon={MapPin} label="Country of Incorporation" value={editableFormData.country || editableFormData.countryOfIncorporation} />
                        <InfoItem icon={Calendar} label="Date of Incorporation" value={formatDate(editableFormData.dateOfIncorporation)} />
                        <InfoItem icon={Calendar} label="Registration Date" value={formatDate(editableFormData.registrationDate)} />

                        <Separator className="my-4" />

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Tax Information
                            </h5>
                            <InfoItem icon={CreditCard} label="Tax ID Number" value={editableFormData.taxIdentificationNumber} />
                            <VerificationItem
                                label="Tax ID Verification"
                                verified={editableFormData.taxIdentificationNumberVerified}
                                verifiedAt={editableFormData.taxIdentificationNumberVerifiedAt}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact & Address Information */}
                <Card className="h-fit">
                    <CardHeader className="bg-gray-50 rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Mail className="h-5 w-5 text-green-600" />
                            Contact & Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Contact Information
                            </h5>
                            <InfoItem icon={Mail} label="Email" value={editableFormData.email} />
                            <InfoItem icon={Phone} label="Phone" value={`+${editableFormData.phoneCountryCode || ''} ${editableFormData.phoneNumber || ''}`} />
                            <InfoItem icon={TrendingUp} label="Expected Volume" value={editableFormData.volume?.toLocaleString()} />
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Business Address
                            </h5>
                            <InfoItem icon={MapPin} label="Street Address" value={editableFormData.streetAddress || editableFormData.businessAddress} />
                            <InfoItem icon={MapPin} label="Street Address 2" value={editableFormData.streetAddress2} />
                            <InfoItem icon={MapPin} label="City" value={editableFormData.city || editableFormData.businessCity} />
                            <InfoItem icon={MapPin} label="State/Province" value={editableFormData.state || editableFormData.businessState} />
                            <InfoItem icon={MapPin} label="Region" value={editableFormData.region} />
                            <InfoItem icon={MapPin} label="Postal Code" value={editableFormData.postalCode || editableFormData.businessPostalCode} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Creator Information */}
            <Card>
                <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5 text-purple-600" />
                        Creator Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Personal Details</h5>
                            <InfoItem icon={User} label="Full Name" value={`${editableFormData.creatorFirstName || ''} ${editableFormData.creatorMiddleName ? editableFormData.creatorMiddleName + ' ' : ''}${editableFormData.creatorLastName || ''}`} />
                            <InfoItem icon={Briefcase} label="Position" value={editableFormData.creatorPosition} />
                            <InfoItem icon={Calendar} label="Date of Birth" value={formatDate(editableFormData.creatorDateOfBirth)} />
                            <InfoItem icon={MapPin} label="Birth Country" value={editableFormData.creatorBirthCountry} />
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Contact & Role</h5>
                            <InfoItem icon={Mail} label="Email" value={editableFormData.creatorEmail} />
                            <InfoItem icon={User} label="Role" value={editableFormData.creatorRole} />
                            <InfoItem icon={Shield} label="Beneficial Owner" value={editableFormData.isBeneficialOwner} />
                            <InfoItem icon={Mail} label="Business Contact" value={editableFormData.creatorIsBusinessContact} />
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Ownership & Rights</h5>
                            <InfoItem icon={TrendingUp} label="Ownership %" value={`${editableFormData.creatorPercentageOwnership || 0}%`} />
                            <InfoItem icon={TrendingUp} label="Voting Rights %" value={`${editableFormData.creatorVotingRightPercentage || 0}%`} />
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Creator Address
                            </h5>
                            <InfoItem icon={MapPin} label="Address" value={editableFormData.creatorAddress} />
                            <InfoItem icon={MapPin} label="City" value={editableFormData.creatorCity} />
                            <InfoItem icon={MapPin} label="State" value={editableFormData.creatorState} />
                            <InfoItem icon={MapPin} label="Postal Code" value={editableFormData.creatorPostalCode} />
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Creator Verification
                            </h5>
                            <VerificationItem
                                label="Tax ID Verification"
                                verified={editableFormData.creatorTaxIdentificationNumberVerified}
                                verifiedAt={editableFormData.creatorTaxIdentificationNumberVerifiedAt}
                            />
                            <VerificationItem
                                label="SSN Verification"
                                verified={editableFormData.creatorSocialSecurityNumberVerified}
                                verifiedAt={editableFormData.creatorSocialSecurityNumberVerifiedAt}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
                <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Financial Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Company Financials</h5>
                            <InfoItem icon={DollarSign} label="Share Capital" value={formatCurrency(editableFormData.shareCapital)} />
                            <InfoItem icon={TrendingUp} label="Last Year Turnover" value={formatCurrency(editableFormData.lastYearTurnover)} />
                            <InfoItem icon={Building2} label="Company Assets" value={formatCurrency(editableFormData.companyAssets)} />
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Monthly Crypto Payments</h5>
                            <InfoItem icon={TrendingUp} label="Inbound Crypto" value={formatCurrency(editableFormData.expectedMonthlyInboundCryptoPayments)} />
                            <InfoItem icon={TrendingUp} label="Outbound Crypto" value={formatCurrency(editableFormData.expectedMonthlyOutboundCryptoPayments)} />
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Monthly Fiat Payments</h5>
                            <InfoItem icon={DollarSign} label="Inbound Fiat" value={formatCurrency(editableFormData.expectedMonthlyInboundFiatPayments)} />
                            <InfoItem icon={DollarSign} label="Outbound Fiat" value={formatCurrency(editableFormData.expectedMonthlyOutboundFiatPayments)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dunamis Integration */}
                <Card className="h-fit">
                    <CardHeader className="bg-gray-50 rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Lock className="h-5 w-5 text-indigo-600" />
                            Dunamis Integration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Integration Status</span>
                            <Badge
                                variant={
                                    editableFormData.dunamisStatus === 'approved' ? 'default' :
                                        editableFormData.dunamisStatus === 'rejected' ? 'destructive' :
                                            'secondary'
                                }
                                className="capitalize"
                            >
                                {editableFormData.dunamisStatus || 'pending'}
                            </Badge>
                        </div>
                        <InfoItem icon={CreditCard} label="Dunamis ID" value={editableFormData.dunamisId} />
                        <InfoItem icon={Calendar} label="Approved At" value={formatDate(editableFormData.dunamisApprovedAt)} />
                        <InfoItem icon={Calendar} label="Rejected At" value={formatDate(editableFormData.dunamisRejectedAt)} />

                        <Separator className="my-4" />

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Requested Services</h5>
                            <div className="flex flex-wrap gap-2">
                                {editableFormData.requestedDunamisServices?.map((service, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {service}
                                    </Badge>
                                )) || <span className="text-sm text-gray-500">None specified</span>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Risk & Compliance */}
                <Card className="h-fit">
                    <CardHeader className="bg-gray-50 rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="h-5 w-5 text-red-600" />
                            Risk & Compliance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <InfoItem icon={Shield} label="Risk Level" value={editableFormData.riskLevel} />
                        <InfoItem icon={Shield} label="Additional Due Diligence" value={editableFormData.additionalDueDiligenceConducted} />

                        <Separator className="my-4" />

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Compliance Flags</h5>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getComplianceIcon(editableFormData.actualOperationsAndRegisteredAddressesMatch)}
                                        <span className="text-sm">Operations & addresses match</span>
                                    </div>
                                    <Badge variant={editableFormData.actualOperationsAndRegisteredAddressesMatch ? "default" : "destructive"}>
                                        {editableFormData.actualOperationsAndRegisteredAddressesMatch ? "Yes" : "No"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getComplianceIcon(!editableFormData.companyProvideRegulatedFinancialServices)}
                                        <span className="text-sm">Regulated financial services</span>
                                    </div>
                                    <Badge variant={editableFormData.companyProvideRegulatedFinancialServices ? "destructive" : "default"}>
                                        {editableFormData.companyProvideRegulatedFinancialServices ? "Yes" : "No"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getComplianceIcon(!editableFormData.directorOrBeneficialOwnerIsPEPOrUSPerson)}
                                        <span className="text-sm">PEP or US person</span>
                                    </div>
                                    <Badge variant={editableFormData.directorOrBeneficialOwnerIsPEPOrUSPerson ? "destructive" : "default"}>
                                        {editableFormData.directorOrBeneficialOwnerIsPEPOrUSPerson ? "Yes" : "No"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getComplianceIcon(editableFormData.immediateApprove)}
                                        <span className="text-sm">Immediate approval eligible</span>
                                    </div>
                                    <Badge variant={editableFormData.immediateApprove ? "default" : "secondary"}>
                                        {editableFormData.immediateApprove ? "Yes" : "No"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Source Information */}
            <Card>
                <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Source Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Source of Wealth</h5>
                            <div className="space-y-2">
                                {editableFormData.sourceOfWealth?.map((source, index) => (
                                    <Badge key={index} variant="outline" className="text-xs block w-fit">
                                        {source}
                                    </Badge>
                                )) || <span className="text-sm text-gray-500">None specified</span>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Anticipated Source of Funds</h5>
                            <div className="space-y-2">
                                {editableFormData.anticipatedSourceOfFundsOnDunamis?.map((source, index) => (
                                    <Badge key={index} variant="outline" className="text-xs block w-fit">
                                        {source}
                                    </Badge>
                                )) || <span className="text-sm text-gray-500">None specified</span>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Affiliation Status</h5>
                            <Badge variant="outline" className="text-sm">
                                {editableFormData.affiliationStatus || selectedSender?.affiliationStatus || 'Not specified'}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Document Verification */}
            <Card>
                <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-green-600" />
                        Document Verification Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {selectedSender?.documents && selectedSender.documents.length > 0 ? (
                        <div className="space-y-3">
                            {selectedSender.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-sm">
                                                {doc.which?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </p>
                                            <p className="text-xs text-gray-500">{doc.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={doc.kycVerified ? "default" : "secondary"}>
                                            {doc.kycVerified ? 'Verified' : 'Pending'}
                                        </Badge>
                                        <Badge
                                            variant={
                                                doc.smileIdStatus === 'verified' ? "default" :
                                                    doc.smileIdStatus === 'rejected' ? "destructive" :
                                                        "secondary"
                                            }
                                            className="text-xs"
                                        >
                                            Smile ID: {doc.smileIdStatus || 'Not submitted'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No documents uploaded yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Directors & Shareholders */}
            <Card>
                <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-purple-600" />
                        Directors & Shareholders
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {selectedSender?.directors && selectedSender.directors.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-medium">Total Added: {selectedSender.directors.length} {selectedSender.directors.length === 1 ? 'Person' : 'People'}</span>
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    {selectedSender.directors.filter((p: IDirectorAndShareholder) => p.idDocumentVerified && p.proofOfAddressVerified).length} / {selectedSender.directors.length} Verified
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                {selectedSender.directors.map((person: IDirectorAndShareholder, index: number) => (
                                    <div key={index} className="border rounded-lg p-4 bg-gray-50/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h5 className="font-medium">
                                                        {person.firstName} {person.middleName && `${person.middleName} `}{person.lastName}
                                                    </h5>
                                                    <p className="text-sm text-gray-600">{person.jobTitle}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {person.isDirector && (
                                                    <Badge variant="outline" className="text-xs">Director</Badge>
                                                )}
                                                {person.isShareholder && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {person.shareholderPercentage}% Share
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <InfoItem icon={Mail} label="Email" value={person.email} className="text-xs" />
                                            <InfoItem icon={Phone} label="Phone" value={`+${person.phoneCode} ${person.phoneNumber}`} className="text-xs" />
                                            <InfoItem icon={MapPin} label="Nationality" value={person.nationality} className="text-xs" />
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(person.idDocumentVerified)}
                                                    <span className="text-sm">ID Document</span>
                                                </div>
                                                <Badge variant={person.idDocumentVerified ? "default" : "secondary"}>
                                                    {person.idDocumentVerified ? 'Verified' : 'Pending'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(person.proofOfAddressVerified)}
                                                    <span className="text-sm">Proof of Address</span>
                                                </div>
                                                <Badge variant={person.proofOfAddressVerified ? "default" : "secondary"}>
                                                    {person.proofOfAddressVerified ? 'Verified' : 'Pending'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="h-8 w-8 text-amber-600" />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">No Directors & Shareholders Found</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Directors and shareholders information has not been added to the system.
                            </p>
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg max-w-md mx-auto">
                                <p className="text-sm text-amber-800">
                                    <strong>⚠️ Action Required:</strong> Request the sender to complete their Directors & Shareholders information before proceeding.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Business Verification Status */}
            <Card>
                <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Business Verification Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <VerificationItem
                            label="Business Verification"
                            verified={editableFormData.businessVerificationCompleted || selectedSender?.businessVerificationCompleted}
                            verifiedAt={editableFormData.businessVerificationCompletedAt || selectedSender?.businessVerificationCompletedAt}
                        />
                        <VerificationItem
                            label="Tax ID Verification"
                            verified={editableFormData.taxIdentificationNumberVerified || selectedSender?.taxIdentificationNumberVerified}
                            verifiedAt={editableFormData.taxIdentificationNumberVerifiedAt || selectedSender?.taxIdentificationNumberVerifiedAt}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Final Submission Warning */}
            <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Info className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-amber-900 mb-2">Ready for Bank Submission</h4>
                            <p className="text-sm text-amber-800 mb-4">
                                Please review all information carefully before submitting to the bank. Once submitted, this application will be processed for final approval and certain details cannot be modified.
                            </p>
                            <div className="bg-white rounded-lg p-4 border border-amber-200">
                                <h5 className="font-medium text-gray-900 mb-2">Pre-submission Checklist:</h5>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li className="flex items-center gap-2">
                                        {(selectedSender?.documents?.length || 0) > 0 ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                                        Documents uploaded and verified
                                    </li>
                                    <li className="flex items-center gap-2">
                                        {(selectedSender?.directors?.length || 0) > 0 ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                                        Directors & shareholders information complete
                                    </li>
                                    <li className="flex items-center gap-2">
                                        {editableFormData.businessVerificationCompleted ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-amber-600" />}
                                        Business verification completed
                                    </li>
                                    <li className="flex items-center gap-2">
                                        {editableFormData.actualOperationsAndRegisteredAddressesMatch ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
                                        Compliance requirements met
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
