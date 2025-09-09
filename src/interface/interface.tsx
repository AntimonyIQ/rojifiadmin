import { AccountTier, AffiliationStatus, BiometricType, BlockchainNetwork, BooleanString, Coin, Engine, Fiat, PaymentRail, RequestStatus, Role, SenderStatus, Status, TeamRole, TeamStatus, TransactionStatus, TransactionType, UserType, WalletStatus, WalletType, WhichDocument } from "@/enums/enums";


export interface IHandshakeClient {
    publicKey: string;
    privateKey: string;
}

export interface IRequestAccess {
    _id: string;
    rojifiId: string;
    firstname: string;
    lastname: string;
    middlename: string;
    email: string;
    businessName: string;
    businessWebsite: string;
    message: string;
    weeklyVolume: number;
    phoneCode: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    agreement: boolean;
    approved: boolean;
    deleted: boolean;
    archived: boolean;
    approvedAt: Date | null;
    approvedBy: IUser | null;
    rejectedAt: Date | null;
    rejectedBy: IUser | null;
    deletedAt: Date | null;
    archivedAt: Date | null;
    metadata: Record<string, any>;
    offRampService: boolean;
    fiatService: boolean;
    virtualCardService: boolean;
    otcdeskService: boolean;
    apiIntegrationService: boolean;

    // Service customization fields
    services?: {
        onRamp?: {
            enabled: boolean;
            supportedFiats: string[]; // Array of supported fiat currencies
        };
        offRamp?: {
            enabled: boolean;
            supportedFiats: string[]; // Array of supported fiat currencies
        };
        lastUpdated?: Date;
        updatedBy?: string; // Admin who last updated the services
    };
}

export interface IResponse<Data = any, Error = any> {
    code: number;
    status: Status;
    message: string;
    data?: Data;
    error?: Error;
    pagination?: IPagination;
    timestamp: string;
    requestId: string;
    copyright: ICopyright;
    help: Array<string>;
    docs: string;
    version: string;
    handshake?: string;
}

export interface IPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ICopyright {
    year: string;
    holder: string;
    license: string;
    licenseUrl: string;
}

export interface IWallet {
    _id?: string;
    currency: Fiat | Coin;
    userId: IUser;
    type: WalletType;
    walletId: string; // Unique wallet identifier
    balance: number; // Current available balance
    pending_payment_balance: number; // Pending payments
    status: WalletStatus; // Wallet status
    isPrimary: boolean; // Is this the user's primary wallet?
    icon: string; // Icon representing the wallet
    symbol: "₦" | "$" | "€" | "£";
    activated: boolean;
    name: string;
    deposit: Array<{
        currency: Coin | Fiat;
        icon: string;
        timestamp: Date;
        active: boolean;
        address: string;
        privateKey: string;
        publicKey: string;
        accountNumber: string; // Optional account number
        institution: string; // Optional financial institution name
        network: BlockchainNetwork;
    }>;
    requested: Array<{
        currency: Fiat;
        status: RequestStatus;
        senderId: IUser;
        userId: IUser;
    }>;
    uniqueFee: Array<{
        currency: Coin | Fiat;
        amount: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
};

export interface IProvider extends IWallet {
    wxfee: number;
    rojifiFee: number;
    cryptofee: number;
    sellrate: number;
    buyrate: number;
    active: boolean;
    price: number;
    mnemonic: string;
    engine: Engine;
    threshold: number;
    tier0: number;
    tier1: number;
    tier2: number;
    tier3: number;
    tier4: number;
}

export interface IContactUs {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string;
    businessName: string;
    businessWebsite: string;
    phoneCode: string;
    phoneNumber: string;
    message: string;
    agreement: boolean;
    responded: boolean;
    responseMessage: string;
    deleted: boolean;
    archived: boolean;
    respondedAt: Date | null;
    deletedAt: Date | null;
    ArchivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    metadata: Record<string, any>;
}

export interface IRequestAccess {
    _id: string;
    rojifiId: string;
    firstname: string;
    lastname: string;
    middlename: string;
    email: string;
    businessName: string;
    businessWebsite: string;
    message: string;
    weeklyVolume: number;
    phoneCode: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    agreement: boolean;
    approved: boolean;
    deleted: boolean;
    archived: boolean;
    approvedAt: Date | null;
    deletedAt: Date | null;
    archivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    metadata: Record<string, any>;

    // Service customization fields
    services?: {
        onRamp?: {
            enabled: boolean;
            supportedFiats: string[]; // Array of supported fiat currencies
        };
        offRamp?: {
            enabled: boolean;
            supportedFiats: string[]; // Array of supported fiat currencies
        };
        lastUpdated?: Date;
        updatedBy?: string; // Admin who last updated the services
    };
}

export interface IUser extends IRequestAccess {
    post_no_debit: string;
    address_line_one: string;
    address_line_two: string;
    username: string;
    fullName: string;
    isEmailVerified: boolean;
    key: string;
    phoneNumberHash: string;
    isPhoneNumberVerified: boolean;
    dateOfBirth: string;
    pin: string;
    mnemonic: string;
    referralCode: string;
    password: string;
    //////////////////////////////////

    cacCertOfIncoporation: string,
    memorandumArticlesOfAssociation: string,
    cacStatusReport: string,
    proofOfAddress: string,

    cacCertOfIncoporationIsVerified: boolean,
    memorandumArticlesOfAssociationIsVerified: boolean,
    cacStatusReportIsVerified: boolean,
    proofOfAddressIsVerified: boolean,

    cacCertOfIncoporationVerifiedAt: Date | null,
    memorandumArticlesOfAssociationVerifiedAt: Date | null,
    cacStatusReportVerifiedAt: Date | null,
    proofOfAddressVerifiedAt: Date | null,

    requested: {
        otcdesk: RequestStatus;
        virtualCard: RequestStatus;
    }

    //////////////////////////////////
    biometricType: BiometricType;
    biometric: string;
    biometricVerified: boolean;
    biometricVerifiedAt: Date;
    biometricEnabled: boolean;
    isVerificationComplete: boolean;
    loginCount: number;
    loginLastAt: Date;
    loginLastIp: string;
    loginLastDevice: string;
    twoFactorSecret: string;
    twoFactorURL: string;
    twoFactorEnabled: boolean;
    twoFactorVerified: boolean;
    twoFactorVerifiedAt: Date;
    isSuspecious: boolean;
    isActive: boolean;
    isSuspended: boolean;
    isBanned: boolean;
    userType: UserType;
    refreshToken: string;
    deviceToken: string;
    createdAt: Date;
    updatedAt: Date;
    passkey: string;
    passkeyEnabled: boolean;
    passkeyVerified: boolean;
    passkeyVerifiedAt: Date;
    tier: AccountTier;
    firstDepositConfirmed: boolean;
    deletedBy: string | null;
    comparePassword(password: string): Promise<boolean>;
    comparePin(pin: string): Promise<boolean>;
    comparePasskey(passkey: string): Promise<boolean>;
    compareBiometric(biometric: string): Promise<boolean>;
    compareDeviceToken(deviceToken: string): Promise<boolean>;
}

export interface IDeposit {
    userId: string;
    type: "crypto" | "fiat";
    account: string;
    bankName: string;
    accountName: string;
    routingNumber: string;
    blockchainNetwork: BlockchainNetwork;
    currency: Coin | Fiat;
    privateKey: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IbankWallet {
    userId: string;
    balance: number;

    deposit: IDeposit;
    currency: Fiat;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITeamMember {
    rojifiId: string;
    userId?: string;
    email: string;
    fullName?: string;
    role: TeamRole;
    status: TeamStatus;
    joined: boolean;
    accepted: boolean;
    joinedAt: Date | null;
    invitedAt: Date | null;
    acceptedAt: Date | null;
    archived: boolean;
    archivedAt: Date | null;
    deleted: boolean;
    deletedAt: Date | null;
}

export interface ITeams {
    creator: string;
    sender: string;
    description: string;
    members: Array<ITeamMember>;
    deleted: boolean;
    deletedAt: Date | null;
    archived: boolean;
    archivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    rojifiId: string;
}

export interface ISenderDocument {
    _id?: string;
    which: WhichDocument;
    name: string;
    type: string; // file type (pdf, jpg, png, etc.)
    url: string;
    size?: number;
    uploadedAt: Date;
    
    // KYC verification
    kycVerified: boolean;
    kycVerifiedAt: Date | null;
    
    // SmileID verification with tracking IDs
    smileIdStatus: "pending" | "verified" | "failed";
    smileIdVerifiedAt: Date | null;
    smileIdJobId: string | null;
    smileIdUploadId: string | null;
    
    // Additional metadata
    description?: string;
    expiresAt?: Date;
    isRequired: boolean;
}

export interface ISender {
    _id: string;
    rojifiId: string;
    creator: string;
    teams: string;
    country: string;
    countryflag: string;
    businessRegistrationNumber: string;
    businessVerificationCompleted: boolean;
    businessVerificationCompletedAt: Date | null;
    businessName: string;
    taxIdentificationNumber: string;
    taxIdentificationNumberVerified: boolean;
    taxIdentificationNumberVerifiedAt: Date | null;
    volume: number;
    email: string;
    phoneNumber: string;
    phoneCountryCode: string;
    countryOfIncorporation: string;
    percentageOwnership: number;
    affiliationStatus: AffiliationStatus;
    dateOfIncorporation: Date;
    businessAddress: string;
    businessCity: string;
    businessState: string;
    businessPostalCode: string;
    creatorFirstName: string;
    creatorLastName: string;
    creatorMiddleName: string;
    creatorDateOfBirth: Date;
    creatorPosition: string;
    creatorBirthCountry: string;
    isBeneficialOwner: BooleanString;
    creatorRole: Role;
    creatorAddress: string;
    creatorCity: string;
    creatorState: string;
    creatorPostalCode: string;
    creatorPercentageOwnership: number;
    creatorEmail: string;
    creatorIsBusinessContact: BooleanString;
    creatorVotingRightPercentage: number;
    creatorTaxIdentificationNumber: string;
    creatorTaxIdentificationNumberVerified: boolean;
    creatorTaxIdentificationNumberVerifiedAt: Date | null;
    creatorSocialSecurityNumber: string;
    creatorSocialSecurityNumberVerified: boolean;
    creatorSocialSecurityNumberVerifiedAt: Date | null;
    deleted: boolean;
    deletedAt: Date | null;
    archived: boolean;
    archivedAt: Date | null;

    // Documents array - more efficient and expandable approach
    documents: Array<ISenderDocument>;

    // Nilos integration
    nilosStatus: "pending" | "approved" | "rejected" | "under_review";
    nilosId: string | null;
    nilosApprovedAt: Date | null;
    nilosRejectedAt: Date | null;

    status: SenderStatus;
    primary?: boolean;

    // Additional fields from business details form
    // Company basic info
    name?: string; // Company name (might be same as businessName)
    website?: string;
    legalForm?: string;
    companyActivity?: string;
    registrationDate?: Date;
    onboardingDate?: Date;
    tradingName?: string;

    // Detailed address fields (in addition to existing businessAddress)
    streetAddress?: string;
    streetAddress2?: string;
    city?: string; // More specific than businessCity
    state?: string; // More specific than businessState
    region?: string;
    postalCode?: string; // More specific than businessPostalCode

    // Financial information
    shareCapital?: number;
    lastYearTurnover?: number;
    companyAssets?: number;
    expectedMonthlyInboundCryptoPayments?: number;
    expectedMonthlyOutboundCryptoPayments?: number;
    expectedMonthlyInboundFiatPayments?: number;
    expectedMonthlyOutboundFiatPayments?: number;

    // Risk and compliance
    riskLevel?: string;
    additionalDueDiligenceConducted?: string;

    // Multi-select arrays
    requestedNilosServices?: string[];
    sourceOfWealth?: string[];
    anticipatedSourceOfFundsOnNilos?: string[];

    // Boolean compliance fields
    actualOperationsAndRegisteredAddressesMatch?: boolean;
    companyProvideRegulatedFinancialServices?: boolean;
    directorOrBeneficialOwnerIsPEPOrUSPerson?: boolean;
    immediateApprove?: boolean;

    directorsAndShareholders?: Array<IDirectorAndShareholder>;

    createdAt: Date;
    updatedAt: Date;
}

export interface IDirectorAndShareholder {
    _id?: string;
    senderId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    jobTitle?: string;
    role: string;
    isDirector: boolean;
    isShareholder: boolean;
    shareholderPercentage?: number;
    dateOfBirth: Date;
    nationality: string;
    phoneCode: string;
    phoneNumber: string;
    idType: "passport" | "drivers_license";
    idNumber: string;
    issuedCountry: string;
    issueDate: Date;
    expiryDate: Date;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    idDocument?: string; // URL to uploaded ID document
    proofOfAddress?: string; // URL to uploaded proof of address
    idDocumentVerified?: boolean;
    proofOfAddressVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IPayment {
    rojifiId: string;
    sender: string;
    senderWallet: string;
    senderName: string;
    senderCurrency: Fiat;
    status: TransactionStatus;
    swiftCode: string;
    beneficiaryAccountName: string;
    beneficiaryCountry: string;
    beneficiaryCountryCode: string;
    beneficiaryBankName: string;
    beneficiaryCurrency: string;
    beneficiaryAccountNumber: string;
    beneficiaryBankAddress: string;
    beneficiaryAmount: string;
    beneficiaryAccountType: "business" | "personal";
    beneficiaryIban: string;
    beneficiaryAddress: string;
    beneficiaryCity: string;
    beneficiaryState: string;
    beneficiaryPostalCode: string;
    beneficiaryAbaRoutingNumber: string;
    beneficiaryBankStateBranch: string;
    beneficiaryIFSC: string;
    beneficiaryInstitutionNumber: string;
    beneficiaryTransitNumber: string;
    beneficiaryRoutingCode: string;
    paymentInvoice: string;
    paymentInvoiceNumber: string;
    paymentInvoiceDate: Date;
    purposeOfPayment: string;
    paymentFor: string;
    paymentRail: PaymentRail;
    reference: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface INewsLetter {
    email: string;
    canceled: boolean;
    canceledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILocation {
    ip: string;
    city: string;
    region: string;
    country: string;
    timezone: string;
    state: string;
    org: string;
    network: string;
    version: string;
    region_code: string;
    country_name: string;
    country_code: string;
    country_code_iso3: string;
    country_capital: string;
    country_tld: string;
    continent_code: string;
    in_eu: boolean;
    postal: any,
    latitude: number;
    longitude: number;
    utc_offset: string;
    country_calling_code: string;
    currency: string;
    currency_name: string;
    languages: string;
    country_area: number;
    country_population: number;
    asn: string;
}

export interface ITransaction extends IPayment {
    _id: string;
    from: string;
    to: string;
    fromCurrency: Coin;
    toCurrency: Coin;
    userId: IUser;
    swapToAmount: number;
    hash: string;
    sendHash: string;
    nonce: string;
    confirmations: string;
    blockNumber: string;
    timestamp: string;
    network: BlockchainNetwork;
    location: ILocation;
    createdAt: Date;
    updatedAt: Date;
    ///////
    txId: string;
    type: TransactionType;
    status: TransactionStatus;
    amount: string;
    wallet: Fiat;
    receipt?: string;
    mt103?: string;
    fees: {
        amount: string;
        currency: string;
    }[];
}