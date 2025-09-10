import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, CheckIcon, ChevronDownIcon, ChevronsUpDownIcon, Edit } from 'lucide-react';
import { ISender } from '@/interface/interface';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Calendar,
} from "@/components/ui/calendar"
import { Button } from '@/components/ui/button';
import countries from "../../data/country_state.json";
import { cn } from '@/lib/utils';
import { format } from "date-fns"
import { Checkbox } from '@/components/ui/checkbox';

interface StageOneFormValidationProps {
    editableFormData: Partial<ISender>;
    handleFormInputChange: (field: keyof ISender, value: any) => void;
}

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
]

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
]

const companyActivities = [
    { value: "agriculture_forestry_and_fishing", label: "Agriculture, Forestry and Fishing" },
    { value: "mining_and_quarrying", label: "Mining and Quarrying" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "electricity_gas_steam", label: "Electricity, Gas, Steam and Air Conditioning Supply" },
    { value: "water_supply", label: "Water Supply; Sewerage, Waste Management" },
    { value: "construction", label: "Construction" },
    { value: "wholesale_retail_trade", label: "Wholesale and Retail Trade" },
    { value: "transportation_storage", label: "Transportation and Storage" },
    { value: "accommodation_food", label: "Accommodation and Food Service Activities" },
    { value: "information_communication", label: "Information and Communication" },
    { value: "financial_insurance", label: "Financial and Insurance Activities" },
    { value: "real_estate", label: "Real Estate Activities" },
    { value: "professional_scientific", label: "Professional, Scientific and Technical Activities" },
    { value: "administrative_support", label: "Administrative and Support Service Activities" },
    { value: "public_administration", label: "Public Administration and Defence" },
    { value: "education", label: "Education" },
    { value: "health_social_work", label: "Human Health and Social Work Activities" },
    { value: "arts_entertainment", label: "Arts, Entertainment and Recreation" },
    { value: "other_service_activities", label: "Other Service Activities" }
]

const legalForms = [
    { value: "SARL", label: "SARL (Limited Liability Company)" },
    { value: "SA", label: "SA (Public Limited Company)" },
    { value: "SAS", label: "SAS (Simplified Joint Stock Company)" },
    { value: "SASU", label: "SASU (Single Shareholder SAS)" },
    { value: "EURL", label: "EURL (Single Member SARL)" },
    { value: "SNC", label: "SNC (General Partnership)" },
    { value: "LLC", label: "LLC (Limited Liability Company)" },
    { value: "Corporation", label: "Corporation" },
    { value: "Partnership", label: "Partnership, Business Name" },
    { value: "Sole_Proprietorship", label: "Sole Proprietorship, Business Name" },
    { value: "LTD", label: "LTD (Private Limited Company)" },
    { value: "PLC", label: "PLC (Public Limited Company)" },
    { value: "OTHERS", label: "Others" },
]

const yesNoOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" }
]

export default function StageOneFormValidation({
    editableFormData,
    handleFormInputChange
}: StageOneFormValidationProps) {
    const [countryPopover, setCountryPopover] = React.useState(false);
    const [regulatedServicesPopover, setRegulatedServicesPopover] = React.useState(false);
    const [pepPersonPopover, setPepPersonPopover] = React.useState(false);
    const [legalFormPopover, setLegalFormPopover] = React.useState(false);
    const [registrationDatePopover, setRegistrationDatePopover] = React.useState(false);

    const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
        const currentArray = (editableFormData[field as keyof ISender] as string[]) || []
        if (checked) {
            handleFormInputChange(field as keyof ISender, [...currentArray, value])
        } else {
            handleFormInputChange(field as keyof ISender, currentArray.filter(item => item !== value))
        }
    }

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
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tradingName">Trading Name</Label>
                                <Input
                                    id="tradingName"
                                    value={editableFormData.tradingName || ''}
                                    onChange={(e) => handleFormInputChange('tradingName', e.target.value)}
                                    placeholder="Enter trading name"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <Label htmlFor="businessRegistrationNumber">Registration Number</Label>
                                <Input
                                    id="businessRegistrationNumber"
                                    value={editableFormData.businessRegistrationNumber || ''}
                                    onChange={(e) => handleFormInputChange('businessRegistrationNumber', e.target.value)}
                                    placeholder="Enter registration number"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={editableFormData.website || ''}
                                    onChange={(e) => handleFormInputChange('website', e.target.value)}
                                    placeholder="Enter website URL"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <Label htmlFor="legalForm">Legal Form</Label>
                                <Popover open={legalFormPopover} onOpenChange={setLegalFormPopover}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full h-12 justify-between"
                                            disabled={true}
                                        >
                                            {editableFormData.legalForm
                                                ? legalForms.find((form) => form.value === editableFormData.legalForm)?.label
                                                : "Select legal form..."}
                                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search legal form..." />
                                            <CommandList>
                                                <CommandEmpty>No legal form found.</CommandEmpty>
                                                <CommandGroup>
                                                    {legalForms
                                                        .filter(form => ['Partnership', 'Sole_Proprietorship', 'LTD', 'OTHERS'].includes(form.value))
                                                        .map((form) => (
                                                            <CommandItem
                                                                key={form.value}
                                                                value={form.label}
                                                                onSelect={() => {
                                                                    handleFormInputChange("legalForm", form.value)
                                                                    setLegalFormPopover(false)
                                                                }}
                                                            >
                                                                <CheckIcon
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        editableFormData.legalForm === form.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {form.label}
                                                            </CommandItem>
                                                        ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <Label htmlFor="companyActivity">Company Activity</Label>
                                <Select
                                    value={editableFormData.companyActivity || ''}
                                    onValueChange={(value) => handleFormInputChange('companyActivity', value)}
                                    disabled={true}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select company activity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companyActivities.map((activity) => (
                                            <SelectItem key={activity.value} value={activity.value}>
                                                {activity.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="country">Country</Label>
                                <Popover open={countryPopover} onOpenChange={() => setCountryPopover(!countryPopover)}>
                                    <PopoverTrigger className='w-full' asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            size="md"
                                            aria-expanded={countryPopover}
                                            className="w-full h-12 justify-between"
                                            disabled={true}
                                        >
                                            <div className="flex flex-row items-center gap-2">
                                                <img src={`https://flagcdn.com/w320/${countries.find((country) => country.name === editableFormData.country)?.iso2.toLowerCase()}.png`} alt="" width={18} height={18} />
                                                {editableFormData.country
                                                    ? countries.find((country) => country.name === editableFormData.country)?.name
                                                    : "Select country..."}
                                            </div>
                                            <ChevronsUpDownIcon className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search country..." />
                                            <CommandList>
                                                <CommandEmpty>No country found.</CommandEmpty>
                                                <CommandGroup>
                                                    {countries.map((country, index) => (
                                                        <CommandItem
                                                            key={`${country.name}-${index}`}
                                                            value={country.name}
                                                            onSelect={(currentValue) => {
                                                                // handleInputChange("country", currentValue)
                                                                handleFormInputChange('country', currentValue)
                                                                setCountryPopover(false)
                                                            }}
                                                        >
                                                            <CheckIcon
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    editableFormData.country === country.name ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <img src={`https://flagcdn.com/w320/${country.iso2.toLowerCase()}.png`} alt="" width={18} height={18} />
                                                            {country.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Registration Date <span className="text-red-500">*</span>
                                </Label>
                                <Popover open={registrationDatePopover} onOpenChange={setRegistrationDatePopover}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 justify-start text-left font-normal"
                                            disabled={true}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {editableFormData.dateOfIncorporation ? format(editableFormData.dateOfIncorporation, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            selected={editableFormData.dateOfIncorporation ? new Date(editableFormData.dateOfIncorporation) : undefined}
                                            onSelect={(date) => {
                                                handleFormInputChange("dateOfIncorporation", date!)
                                                setRegistrationDatePopover(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
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
                                    disabled={true}
                                />
                            </div>
                            {/* 
                            <div>
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    value={editableFormData.phoneNumber || ''}
                                    onChange={(e) => handleFormInputChange('phoneNumber', e.target.value)}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            */}
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Business Address Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="streetAddress">Street Address</Label>
                                <Input
                                    id="streetAddress"
                                    value={editableFormData.streetAddress || ''}
                                    onChange={(e) => handleFormInputChange('streetAddress', e.target.value)}
                                    placeholder="Enter street address"
                                    disabled={true}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="streetAddress2">Street Address 2 (Optional)</Label>
                                <Input
                                    id="streetAddress2"
                                    value={editableFormData.streetAddress2 || ''}
                                    onChange={(e) => handleFormInputChange('streetAddress2', e.target.value)}
                                    placeholder="Apartment, suite, unit, etc."
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={editableFormData.city || ''}
                                    onChange={(e) => handleFormInputChange('city', e.target.value)}
                                    placeholder="Enter city"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <Label htmlFor="state">State/Province</Label>
                                <Input
                                    id="state"
                                    value={editableFormData.state || ''}
                                    onChange={(e) => handleFormInputChange('state', e.target.value)}
                                    placeholder="Enter state"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <Label htmlFor="region">Region</Label>
                                <Input
                                    id="region"
                                    value={editableFormData.region || ''}
                                    onChange={(e) => handleFormInputChange('region', e.target.value)}
                                    placeholder="Enter region"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    value={editableFormData.postalCode || ''}
                                    onChange={(e) => handleFormInputChange('postalCode', e.target.value)}
                                    placeholder="Enter postal code"
                                    disabled={true}
                                />
                            </div>
                            {/*
                            <div className="md:col-span-2">
                                <Label htmlFor="businessAddress">Business Address (Legacy)</Label>
                                <Textarea
                                    id="businessAddress"
                                    value={editableFormData.businessAddress || ''}
                                    onChange={(e) => handleFormInputChange('businessAddress', e.target.value)}
                                    placeholder="Enter full business address"
                                    rows={3}
                                    disabled={true}
                                />
                            </div>
                            */}
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
                                    disabled={true}
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
                                    disabled={true}
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
                                    disabled={true}
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
                                    disabled={true}
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
                                    disabled={true}
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
                                    disabled={true}
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
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-2">
                                    Does your company provide regulated financial services?
                                </Label>
                                <Popover open={regulatedServicesPopover} onOpenChange={setRegulatedServicesPopover}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full h-12 justify-between"
                                            disabled={true}
                                        >
                                            {editableFormData.companyProvideRegulatedFinancialServices !== null
                                                ? yesNoOptions.find((option) => option.value === editableFormData.companyProvideRegulatedFinancialServices)?.label
                                                : "Select answer..."}
                                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {yesNoOptions.map((option) => (
                                                        <CommandItem
                                                            key={option.value.toString()} className="w-full"
                                                            value={option.label}
                                                            onSelect={() => {
                                                                handleFormInputChange("companyProvideRegulatedFinancialServices", option.value)
                                                                setRegulatedServicesPopover(false)
                                                            }}
                                                        >
                                                            <CheckIcon
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    editableFormData.companyProvideRegulatedFinancialServices === option.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {option.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-2">
                                    Is any director or beneficial owner a PEP (Politically Exposed Person) or US person?
                                </Label>
                                <Popover open={pepPersonPopover} onOpenChange={setPepPersonPopover}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full h-12 justify-between"
                                            disabled={true}
                                        >
                                            {editableFormData.directorOrBeneficialOwnerIsPEPOrUSPerson !== null
                                                ? yesNoOptions.find((option) => option.value === editableFormData.directorOrBeneficialOwnerIsPEPOrUSPerson)?.label
                                                : "Select answer..."}
                                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {yesNoOptions.map((option) => (
                                                        <CommandItem
                                                            key={option.value.toString()}
                                                            value={option.label}
                                                            onSelect={() => {
                                                                handleFormInputChange("directorOrBeneficialOwnerIsPEPOrUSPerson", option.value)
                                                                setPepPersonPopover(false)
                                                            }}
                                                        >
                                                            <CheckIcon
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    editableFormData.directorOrBeneficialOwnerIsPEPOrUSPerson === option.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {option.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Source of Wealth */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Source of Wealth <span className="text-red-500">*</span></h3>
                                <div className="space-y-3">
                                    {sourceOfWealthOptions.map((source) => (
                                        <div key={source.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={source.value}
                                                checked={(editableFormData.sourceOfWealth || []).includes(source.value)}
                                                onCheckedChange={(checked) =>
                                                    handleMultiSelectChange("sourceOfWealth", source.value, checked as boolean)
                                                }
                                                disabled={true}
                                            />
                                            <Label htmlFor={source.value} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {source.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Anticipated Source of Funds */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Anticipated Source of Funds <span className="text-red-500">*</span></h3>
                                <div className="space-y-3">
                                    {anticipatedSourceOptions.map((source) => (
                                        <div key={source.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`anticipated-${source.value}`}
                                                checked={(editableFormData.anticipatedSourceOfFundsOnDunamis || []).includes(source.value)}
                                                onCheckedChange={(checked) =>
                                                    handleMultiSelectChange("anticipatedSourceOfFundsOnDunamis", source.value, checked as boolean)
                                                }
                                                disabled={true}
                                            />
                                            <Label htmlFor={`anticipated-${source.value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {source.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Creator Information
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
                    */}

                    {/* Dunamis Integration */}
                    {/*
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
                    */}

                    {/* Risk and Compliance */}
                    {/*
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
                    */}

                    {/* Compliance Flags */}
                    {/*
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
                    */}
                </CardContent>
            </Card>
        </div>
    );
}
