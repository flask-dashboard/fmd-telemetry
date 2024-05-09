export interface DatabasePruning {
    _id: string;
    createdAt: { $date: string };
    updatedAt: { $date: string };
    fmd_id: string;
    session: number;
    delete_custom_graphs: boolean;
    age_threshold_weeks: number;
    time_initialized: string;
  }