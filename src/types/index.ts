// ─── Company ───────────────────────────────────────────────────────────────
export interface Company {
  id: string;
  customerCode: string;
  companyName: string;
  customerStatus: 'Active' | 'Prospect' | 'Blocked';
  customerClass: string;
  region: string;
  bdmName: string;
  lastInvoiceDate: string;
  groupName: string;
  groupStatus: string;
  isConvertToCustomer: boolean;
  district: string;
  country: string;
  street: string;
  city: string;
  industry: string;
  lastVisitDate: string;
  lastFollowUpDate: string;
  hasAlert: boolean;
}

// ─── Group Company ──────────────────────────────────────────────────────────
export interface GroupCompany {
  id: string;
  groupCode: string;
  groupName: string;
  groupStatus: 'Active' | 'Inactive' | 'Prospect';
  memberCount: number;
  primaryRegion: string;
  bdmName: string;
  members: string[];
  hasAlert: boolean;
}

// ─── Associated Company ─────────────────────────────────────────────────────
export interface AssociatedCompany {
  id: string;
  companyName: string;
  relationType: 'OEM' | 'Brand Owner' | '加工廠' | 'Others';
  associatedCompany: string;
  status: 'Active' | 'Inactive';
  hasAlert: boolean;
}

// ─── Contact ────────────────────────────────────────────────────────────────
export interface Contact {
  id: string;
  contactName: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  decisionWeight: 'High' | 'Medium' | 'Low';
  lastVisit: string;
  hasAlert: boolean;
}

// ─── Project / RFQ ──────────────────────────────────────────────────────────
export interface ProjectRFQ {
  id: string;
  rfqNo: string;
  projectDate: string;
  customerCode: string;
  customerEngName: string;
  customerChiName: string;
  manufacturer: string;
  brand: string;
  type: string;
  grade: string;
  shade: string;
  colorCode: string;
  colorDescription: string;
  rfqCompletedDate: string;
  modifiedDate: string;
  createdDate: string;
  endUserName: string;
  projectIndustry: string;
  projectOutcome: 'Win' | 'Loss' | 'Ongoing' | 'Pending';
  projectLevel: 'A' | 'B' | 'C' | 'D';
  hasAlert: boolean;
}

// ─── Report ─────────────────────────────────────────────────────────────────
export interface Report {
  id: string;
  reportNo: string;
  reportType: 'Customer Visit' | 'Plant Assessment' | 'Technical Service';
  companyName: string;
  visitDate: string;
  reporter: string;
  summary: string;
  status: 'Completed' | 'Draft' | 'Pending Review';
  hasAlert: boolean;
}

// ─── Order ──────────────────────────────────────────────────────────────────
export interface Order {
  id: string;
  soNo: string;
  companyName: string;
  material: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  deliveryDate: string;
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Overdue';
  hasAlert: boolean;
}

// ─── Delivery ───────────────────────────────────────────────────────────────
export interface Delivery {
  id: string;
  invoiceNo: string;
  soNo: string;
  companyName: string;
  shipDate: string;
  trackingNo: string;
  deliveryStatus: 'Delivered' | 'In Transit' | 'Pending' | 'Returned';
  remarks: string;
  hasAlert: boolean;
}

// ─── Credit Limit ───────────────────────────────────────────────────────────
export interface CreditLimit {
  id: string;
  companyName: string;
  creditLimit: number;
  availableCredit: number;
  totalAR: number;
  externalDueDate: string;
  internalDueDate: string;
  overdueAmount: number;
  lastPaymentDate: string;
  currency: 'HKD' | 'USD' | 'CNY';
  hasAlert: boolean;
}

// ─── Filter types ───────────────────────────────────────────────────────────
export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface ActiveFilters {
  [key: string]: string;
}

// ─── Table column ───────────────────────────────────────────────────────────
export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

// ─── Chart data ─────────────────────────────────────────────────────────────
export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  filterKey?: string;
  filterValue?: string;
}
