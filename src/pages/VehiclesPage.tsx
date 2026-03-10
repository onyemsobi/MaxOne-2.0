import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import type { DateRange } from "react-day-picker"

import {
  PageLayout,
  Sidebar,
  TopBar,
  PageHeader,
  StatusTabs,
  FilterBar,
  DataTable,
  StatusBadge,
  Pagination,
  type SidebarItem,
  type SidebarUser,
  type StatusTab,
  type FilterState,
} from "@/components/max"

export interface Vehicle {
  id: string
  assetType: string
  assetId: string
  plateNumber: string | null
  batchNumber: string
  location: string
  championStatus: "Active" | "Inactive" | null
  contractStatus: "Active" | "Inactive" | null
  lifecycleState: "3rd Party Check-In" | "Asset Checkout" | "HP Completed" | "Inbound"
  driverSafetyScore: number | null
  contractRisk: "Low" | "Medium" | "High" | null
  collectionPercent: number | null
  daysInState: number
  dateCreated: string
}

const baseMockVehicles: Vehicle[] = [
  {
    id: "1",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "LAG-234-XY",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Inactive",
    lifecycleState: "3rd Party Check-In",
    driverSafetyScore: 92,
    contractRisk: "Low",
    collectionPercent: 98,
    daysInState: 45,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "2",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-203",
    plateNumber: "ABJ-891-KL",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    lifecycleState: "Asset Checkout",
    driverSafetyScore: 78,
    contractRisk: "Low",
    collectionPercent: 85,
    daysInState: 120,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "3",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "KAN-456-MN",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Inactive",
    lifecycleState: "3rd Party Check-In",
    driverSafetyScore: 55,
    contractRisk: "Medium",
    collectionPercent: 72,
    daysInState: 8,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "4",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "OYO-123-AB",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    lifecycleState: "HP Completed",
    driverSafetyScore: 88,
    contractRisk: "Low",
    collectionPercent: 100,
    daysInState: 30,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "5",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: null,
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: null,
    contractStatus: null,
    lifecycleState: "Inbound",
    driverSafetyScore: null,
    contractRisk: null,
    collectionPercent: null,
    daysInState: 3,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "6",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "EKI-789-CD",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    lifecycleState: "HP Completed",
    driverSafetyScore: 35,
    contractRisk: "High",
    collectionPercent: 45,
    daysInState: 200,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "7",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "LAG-567-EF",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    lifecycleState: "HP Completed",
    driverSafetyScore: 65,
    contractRisk: "Medium",
    collectionPercent: 60,
    daysInState: 15,
    dateCreated: "3 Dec 2023",
  },
]

export const mockVehicles: Vehicle[] = Array.from({ length: 25 }, (_, i) => ({
  ...baseMockVehicles[i % baseMockVehicles.length],
  id: String(i + 1),
}))

export const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "/images/dashboard_menu.svg",
    href: "/dashboard",
  },
  {
    id: "fleet",
    label: "Fleet",
    icon: "/images/fleet_menu.svg",
    children: [
      {
        id: "vehicles",
        label: "Vehicles",
        badge: "24K",
        isActive: true,
      },
      {
        id: "maintenance",
        label: "Maintenance",
      },
      {
        id: "refurbishment",
        label: "Refurbishment",
      },
      {
        id: "mcp-management",
        label: "MCP Management",
      },
      {
        id: "deactivation",
        label: "Deactivation",
      },
    ],
  },
  {
    id: "issues",
    label: "Issues",
    icon: "/images/issues_menu.svg",
    badge: 13,
    badgeVariant: "notification",
  },
  {
    id: "configurations",
    label: "Configurations",
    icon: "/images/config_menu.svg",
    children: [
      {
        id: "model",
        label: "Model",
      },
      {
        id: "trim",
        label: "Trim",
      },
      {
        id: "platform",
        label: "Platform",
      },
    ],
  },
  {
    id: "agent-activities",
    label: "Agent Activities",
    icon: "/images/agent_menu.svg",
  },
]

export const sidebarUser: SidebarUser = {
  name: "Desmond Nsogbuwa",
  role: "Fleet Manager",
}

const statusTabs: StatusTab[] = [
  { id: "all", label: "All", count: 24340 },
  { id: "yard-check-in", label: "Yard Check-In", count: 4953 },
  { id: "3rd-party-check-in", label: "3rd Party Check-In", count: 4953 },
  { id: "asset-checkout", label: "Asset Checkout", count: 10450 },
  { id: "hp-completed", label: "HP Completed", count: 456 },
  { id: "inbound", label: "Inbound", count: 456 },
  { id: "stolen", label: "Stolen", count: 0 },
]

function getVehicleIcon(assetType: string) {
  if (assetType.includes("2")) return "/images/2_wheeler.svg"
  if (assetType.includes("3")) return "/images/3_wheeler.svg"
  if (assetType.includes("4")) return "/images/4_wheeler.svg"
  return "/images/2_wheeler.svg"
}

function VehicleIcon({ assetType }: { assetType: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
      <img src={getVehicleIcon(assetType)} alt={assetType} className="h-5 w-5" />
    </div>
  )
}

function getSafetyScoreColor(score: number): string {
  if (score >= 70) return "#16B04F"
  if (score >= 50) return "#E88E15"
  return "#DC2626"
}

function SafetyScoreRing({ score }: { score: number }) {
  const color = getSafetyScoreColor(score)
  const circumference = 2 * Math.PI * 14
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="4"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{score}</span>
    </div>
  )
}

function CollectionBar({ percent }: { percent: number }) {
  const color = percent >= 70 ? "#16B04F" : percent >= 50 ? "#E88E15" : "#DC2626"

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{percent}%</span>
    </div>
  )
}

const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "asset",
    header: "Asset",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <VehicleIcon assetType={row.original.assetType} />
        <div>
          <p className="font-medium text-table-text-primary" style={{ fontSize: '14px' }}>{row.original.assetType}</p>
          <p className="font-medium text-table-text-warning" style={{ fontSize: '11px' }}>{row.original.assetId}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => {
      const plateNumber = row.original.plateNumber
      if (!plateNumber || row.original.lifecycleState === "Inbound") {
        return <span className="text-muted-foreground">-</span>
      }
      return (
        <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{plateNumber}</span>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.location}</span>
    ),
  },
  {
    accessorKey: "driverSafetyScore",
    header: "Driver Safety Score",
    cell: ({ row }) => {
      const score = row.original.driverSafetyScore
      if (score === null) return <span className="text-muted-foreground">-</span>
      return <SafetyScoreRing score={score} />
    },
  },
  {
    accessorKey: "contractRisk",
    header: "Contract Risk",
    cell: ({ row }) => {
      const risk = row.original.contractRisk
      if (!risk) return <span className="text-muted-foreground">-</span>
      const variant = risk === "Low" ? "success" : risk === "Medium" ? "warning" : "danger"
      return <StatusBadge variant={variant}>{risk}</StatusBadge>
    },
  },
  {
    accessorKey: "collectionPercent",
    header: "Collection %",
    cell: ({ row }) => {
      const percent = row.original.collectionPercent
      if (percent === null) return <span className="text-muted-foreground">-</span>
      return <CollectionBar percent={percent} />
    },
  },
  {
    accessorKey: "daysInState",
    header: "Days in State",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.daysInState}d</span>
    ),
  },
  {
    accessorKey: "lifecycleState",
    header: "Lifecycle State",
    cell: ({ row }) => {
      const status = row.original.lifecycleState
      const variant =
        status === "HP Completed"
          ? "success"
          : status === "Inbound"
            ? "info"
            : "warning"
      return <StatusBadge variant={variant}>{status}</StatusBadge>
    },
  },
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.dateCreated}</span>
    ),
  },
]

export default function VehiclesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 11, 10),
    to: new Date(2026, 9, 11),
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<FilterState>({
    championStatus: [],
    contractStatus: [],
    locations: [],
  })

  return (
    <PageLayout
      sidebar={({ isCollapsed, onToggleCollapse }) => (
        <Sidebar
          items={sidebarItems}
          user={sidebarUser}
          onItemClick={(item) => console.log("Clicked:", item.label)}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      )}
    >
      <TopBar
        breadcrumbs={[{ label: "Fleet" }, { label: "Vehicles" }]}
      />
      <PageHeader
        title="Vehicles"
        subtitle="Keep full visibility and control over your vehicle fleet in one place."
        className="shrink-0"
      />

      <StatusTabs
        tabs={statusTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="shrink-0"
      />

      <div className="mx-6 mt-2 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <FilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={(query) => console.log("Search:", query)}
          secondaryAction={{
            label: "Bulk Update Vehicles",
            onClick: () => console.log("Bulk update"),
            icon: "/images/bulk_update.svg",
          }}
          primaryAction={{
            label: "Add Vehicles",
            onClick: () => console.log("Add vehicle"),
            icon: Plus,
          }}
          className="shrink-0"
        />

        <div className="flex-1 overflow-y-auto">
          <DataTable
            columns={columns}
            data={mockVehicles}
            onRowClick={(row) => navigate(`/vehicles/${row.id}`)}
          />
        </div>
      </div>

      <div className="shrink-0 mx-6 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={49}
          totalItems={20340}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="vehicles"
        />
      </div>
    </PageLayout>
  )
}
