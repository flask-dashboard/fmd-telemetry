export interface DatabasePruning {
    _id: string;
    _created_at: { $date: string };
    _updated_at: { $date: string };
    fmd_id: string;
    session: number;
    delete_custom_graphs: boolean;
    age_threshold_weeks: number;
    time_initialized: string;
  }