import { DepartmentQualityRanking } from "./department-quality-ranking";
import { QualityMetricsGrid } from "./quality-metrics-grid";
import { QualityRadarChart } from "./quality-radar-chart";

interface QualityOverviewTabProps {
  qualityMetrics: any;
  departmentQuality: any[];
}

export function QualityOverviewTab({
  qualityMetrics,
  departmentQuality,
}: QualityOverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QualityRadarChart qualityMetrics={qualityMetrics} />
        <DepartmentQualityRanking departmentQuality={departmentQuality} />
      </div>
      <QualityMetricsGrid departmentQuality={departmentQuality} />
    </div>
  );
}
