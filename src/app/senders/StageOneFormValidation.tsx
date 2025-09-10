import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit } from 'lucide-react';
import { ISender } from '@/interface/interface';

interface StageOneFormValidationProps {
    editableFormData: Partial<ISender>;
    handleFormInputChange: (field: keyof ISender, value: any) => void;
}

export default function StageOneFormValidation({
    editableFormData,
    handleFormInputChange
}: StageOneFormValidationProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Form Input Validation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Company Basic Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Company Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="businessName">Business Name</Label>
                                <Input
                                    id="businessName"
                                    value={editableFormData.businessName || ''}
                                    onChange={(e) => handleFormInputChange('businessName', e.target.value)}
                                    placeholder="Enter business name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="name">Company Name</Label>
                                <Input
                                    id="name"
                                    value={editableFormData.name || ''}
                                    onChange={(e) => handleFormInputChange('name', e.target.value)}
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="tradingName">Trading Name</Label>
                                <Input
                                    id="tradingName"
                                    value={editableFormData.tradingName || ''}
                                    onChange={(e) => handleFormInputChange('tradingName', e.target.value)}
                                    placeholder="Enter trading name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="businessRegistrationNumber">Registration Number</Label>
                                <Input
                                    id="businessRegistrationNumber"
                                    value={editableFormData.businessRegistrationNumber || ''}
                                    onChange={(e) => handleFormInputChange('businessRegistrationNumber', e.target.value)}
                                    placeholder="Enter registration number"
                                />
                            </div>
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={editableFormData.website || ''}
                                    onChange={(e) => handleFormInputChange('website', e.target.value)}
                                    placeholder="Enter website URL"
                                />
                            </div>
                            <div>
                                <Label htmlFor="legalForm">Legal Form</Label>
                                <Select
                                    value={editableFormData.legalForm || ''}
                                    onValueChange={(value) => handleFormInputChange('legalForm', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select legal form" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SARL">SARL (Limited Liability Company)</SelectItem>
                                        <SelectItem value="SA">SA (Public Limited Company)</SelectItem>
                                        <SelectItem value="SAS">SAS (Simplified Joint Stock Company)</SelectItem>
                                        <SelectItem value="LLC">LLC (Limited Liability Company)</SelectItem>
                                        <SelectItem value="Corporation">Corporation</SelectItem>
                                        <SelectItem value="Partnership">Partnership</SelectItem>
                                        <SelectItem value="LTD">LTD (Private Limited Company)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="companyActivity">Company Activity</Label>
                                <Select
                                    value={editableFormData.companyActivity || ''}
                                    onValueChange={(value) => handleFormInputChange('companyActivity', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select company activity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="agriculture_forestry_and_fishing">Agriculture, Forestry and Fishing</SelectItem>
                                        <SelectItem value="mining_and_quarrying">Mining and Quarrying</SelectItem>
                                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                        <SelectItem value="financial_insurance">Financial and Insurance Activities</SelectItem>
                                        <SelectItem value="information_communication">Information and Communication</SelectItem>
                                        <SelectItem value="professional_scientific">Professional, Scientific and Technical Activities</SelectItem>
                                        <SelectItem value="wholesale_retail_trade">Wholesale and Retail Trade</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="country">Country</Label>
                                <Select
                                    value={editableFormData.country || ''}
                                    onValueChange={(value) => handleFormInputChange('country', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                                        <SelectItem value="Kenya">Kenya</SelectItem>
                                        <SelectItem value="Ghana">Ghana</SelectItem>
                                        <SelectItem value="South Africa">South Africa</SelectItem>
                                        <SelectItem value="France">France</SelectItem>
                                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                        <SelectItem value="United States">United States</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

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
                                />
                            </div>
                            <div>
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    value={editableFormData.phoneNumber || ''}
                                    onChange={(e) => handleFormInputChange('phoneNumber', e.target.value)}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div>
                                <Label htmlFor="volume">Volume</Label>
                                <Input
                                    id="volume"
                                    type="number"
                                    value={editableFormData.volume || ''}
                                    onChange={(e) => handleFormInputChange('volume', parseInt(e.target.value))}
                                    placeholder="Enter volume"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Address Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="streetAddress">Street Address</Label>
                                <Input
                                    id="streetAddress"
                                    value={editableFormData.streetAddress || ''}
                                    onChange={(e) => handleFormInputChange('streetAddress', e.target.value)}
                                    placeholder="Enter street address"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="streetAddress2">Street Address 2 (Optional)</Label>
                                <Input
                                    id="streetAddress2"
                                    value={editableFormData.streetAddress2 || ''}
                                    onChange={(e) => handleFormInputChange('streetAddress2', e.target.value)}
                                    placeholder="Apartment, suite, unit, etc."
                                />
                            </div>
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={editableFormData.city || ''}
                                    onChange={(e) => handleFormInputChange('city', e.target.value)}
                                    placeholder="Enter city"
                                />
                            </div>
                            <div>
                                <Label htmlFor="state">State/Province</Label>
                                <Input
                                    id="state"
                                    value={editableFormData.state || ''}
                                    onChange={(e) => handleFormInputChange('state', e.target.value)}
                                    placeholder="Enter state"
                                />
                            </div>
                            <div>
                                <Label htmlFor="region">Region</Label>
                                <Input
                                    id="region"
                                    value={editableFormData.region || ''}
                                    onChange={(e) => handleFormInputChange('region', e.target.value)}
                                    placeholder="Enter region"
                                />
                            </div>
                            <div>
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    value={editableFormData.postalCode || ''}
                                    onChange={(e) => handleFormInputChange('postalCode', e.target.value)}
                                    placeholder="Enter postal code"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="businessAddress">Business Address (Legacy)</Label>
                                <Textarea
                                    id="businessAddress"
                                    value={editableFormData.businessAddress || ''}
                                    onChange={(e) => handleFormInputChange('businessAddress', e.target.value)}
                                    placeholder="Enter full business address"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Financial Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="shareCapital">Share Capital</Label>
                                <Input
                                    id="shareCapital"
                                    type="number"
                                    value={editableFormData.shareCapital || ''}
                                    onChange={(e) => handleFormInputChange('shareCapital', parseInt(e.target.value))}
                                    placeholder="Enter share capital"
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastYearTurnover">Last Year Turnover</Label>
                                <Input
                                    id="lastYearTurnover"
                                    type="number"
                                    value={editableFormData.lastYearTurnover || ''}
                                    onChange={(e) => handleFormInputChange('lastYearTurnover', parseInt(e.target.value))}
                                    placeholder="Enter last year turnover"
                                />
                            </div>
                            <div>
                                <Label htmlFor="companyAssets">Company Assets</Label>
                                <Input
                                    id="companyAssets"
                                    type="number"
                                    value={editableFormData.companyAssets || ''}
                                    onChange={(e) => handleFormInputChange('companyAssets', parseInt(e.target.value))}
                                    placeholder="Enter company assets"
                                />
                            </div>
                            <div>
                                <Label htmlFor="expectedMonthlyInboundCryptoPayments">Monthly Inbound Crypto</Label>
                                <Input
                                    id="expectedMonthlyInboundCryptoPayments"
                                    type="number"
                                    value={editableFormData.expectedMonthlyInboundCryptoPayments || ''}
                                    onChange={(e) => handleFormInputChange('expectedMonthlyInboundCryptoPayments', parseInt(e.target.value))}
                                    placeholder="Expected monthly inbound crypto"
                                />
                            </div>
                            <div>
                                <Label htmlFor="expectedMonthlyOutboundCryptoPayments">Monthly Outbound Crypto</Label>
                                <Input
                                    id="expectedMonthlyOutboundCryptoPayments"
                                    type="number"
                                    value={editableFormData.expectedMonthlyOutboundCryptoPayments || ''}
                                    onChange={(e) => handleFormInputChange('expectedMonthlyOutboundCryptoPayments', parseInt(e.target.value))}
                                    placeholder="Expected monthly outbound crypto"
                                />
                            </div>
                            <div>
                                <Label htmlFor="expectedMonthlyInboundFiatPayments">Monthly Inbound Fiat</Label>
                                <Input
                                    id="expectedMonthlyInboundFiatPayments"
                                    type="number"
                                    value={editableFormData.expectedMonthlyInboundFiatPayments || ''}
                                    onChange={(e) => handleFormInputChange('expectedMonthlyInboundFiatPayments', parseInt(e.target.value))}
                                    placeholder="Expected monthly inbound fiat"
                                />
                            </div>
                            <div>
                                <Label htmlFor="expectedMonthlyOutboundFiatPayments">Monthly Outbound Fiat</Label>
                                <Input
                                    id="expectedMonthlyOutboundFiatPayments"
                                    type="number"
                                    value={editableFormData.expectedMonthlyOutboundFiatPayments || ''}
                                    onChange={(e) => handleFormInputChange('expectedMonthlyOutboundFiatPayments', parseInt(e.target.value))}
                                    placeholder="Expected monthly outbound fiat"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Creator Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Creator Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="creatorFirstName">First Name</Label>
                                <Input
                                    id="creatorFirstName"
                                    value={editableFormData.creatorFirstName || ''}
                                    onChange={(e) => handleFormInputChange('creatorFirstName', e.target.value)}
                                    placeholder="Enter creator first name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="creatorLastName">Last Name</Label>
                                <Input
                                    id="creatorLastName"
                                    value={editableFormData.creatorLastName || ''}
                                    onChange={(e) => handleFormInputChange('creatorLastName', e.target.value)}
                                    placeholder="Enter creator last name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="creatorPosition">Position</Label>
                                <Input
                                    id="creatorPosition"
                                    value={editableFormData.creatorPosition || ''}
                                    onChange={(e) => handleFormInputChange('creatorPosition', e.target.value)}
                                    placeholder="Enter creator position"
                                />
                            </div>
                            <div>
                                <Label htmlFor="creatorEmail">Email</Label>
                                <Input
                                    id="creatorEmail"
                                    type="email"
                                    value={editableFormData.creatorEmail || ''}
                                    onChange={(e) => handleFormInputChange('creatorEmail', e.target.value)}
                                    placeholder="Enter creator email"
                                />
                            </div>
                            <div>
                                <Label htmlFor="creatorPercentageOwnership">Ownership Percentage</Label>
                                <Input
                                    id="creatorPercentageOwnership"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editableFormData.creatorPercentageOwnership || ''}
                                    onChange={(e) => handleFormInputChange('creatorPercentageOwnership', parseInt(e.target.value))}
                                    placeholder="Enter ownership percentage"
                                />
                            </div>
                            <div>
                                <Label htmlFor="creatorVotingRightPercentage">Voting Rights Percentage</Label>
                                <Input
                                    id="creatorVotingRightPercentage"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editableFormData.creatorVotingRightPercentage || ''}
                                    onChange={(e) => handleFormInputChange('creatorVotingRightPercentage', parseInt(e.target.value))}
                                    placeholder="Enter voting rights percentage"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dunamis Integration */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Dunamis Integration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="dunamisStatus">Dunamis Status</Label>
                                <Select
                                    value={editableFormData.dunamisStatus || ''}
                                    onValueChange={(value) => handleFormInputChange('dunamisStatus', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Dunamis status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="dunamisId">Dunamis ID</Label>
                                <Input
                                    id="dunamisId"
                                    value={editableFormData.dunamisId || ''}
                                    onChange={(e) => handleFormInputChange('dunamisId', e.target.value)}
                                    placeholder="Enter Dunamis ID"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Risk and Compliance */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Risk and Compliance</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="riskLevel">Risk Level</Label>
                                <Select
                                    value={editableFormData.riskLevel || ''}
                                    onValueChange={(value) => handleFormInputChange('riskLevel', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select risk level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low_risk">Low Risk</SelectItem>
                                        <SelectItem value="medium_risk">Medium Risk</SelectItem>
                                        <SelectItem value="high_risk">High Risk</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="additionalDueDiligenceConducted">Additional Due Diligence</Label>
                                <Textarea
                                    id="additionalDueDiligenceConducted"
                                    value={editableFormData.additionalDueDiligenceConducted || ''}
                                    onChange={(e) => handleFormInputChange('additionalDueDiligenceConducted', e.target.value)}
                                    placeholder="Describe any additional due diligence conducted"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Compliance Flags */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Compliance Flags</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="actualOperationsAndRegisteredAddressesMatch"
                                    checked={editableFormData.actualOperationsAndRegisteredAddressesMatch || false}
                                    onChange={(e) => handleFormInputChange('actualOperationsAndRegisteredAddressesMatch', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="actualOperationsAndRegisteredAddressesMatch">
                                    Actual operations and registered addresses match
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="companyProvideRegulatedFinancialServices"
                                    checked={editableFormData.companyProvideRegulatedFinancialServices || false}
                                    onChange={(e) => handleFormInputChange('companyProvideRegulatedFinancialServices', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="companyProvideRegulatedFinancialServices">
                                    Company provides regulated financial services
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="directorOrBeneficialOwnerIsPEPOrUSPerson"
                                    checked={editableFormData.directorOrBeneficialOwnerIsPEPOrUSPerson || false}
                                    onChange={(e) => handleFormInputChange('directorOrBeneficialOwnerIsPEPOrUSPerson', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="directorOrBeneficialOwnerIsPEPOrUSPerson">
                                    Director or beneficial owner is PEP or US person
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="immediateApprove"
                                    checked={editableFormData.immediateApprove || false}
                                    onChange={(e) => handleFormInputChange('immediateApprove', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="immediateApprove">
                                    Immediate approval
                                </Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
