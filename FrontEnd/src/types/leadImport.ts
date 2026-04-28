export type ImportLeadsResponse = {
  totalRows: number;
  imported: number;
  skipped: number;
  failed: number;
  errors: string[];
};