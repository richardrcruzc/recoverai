export type RunLeadScrapeRequest = {
  sourceName: string;
  searchQuery: string;
  location: string;
  limit: number;
};

export type RunLeadScrapeResponse = {
  jobId: string;
  companiesFound: number;
  contactsCreated: number;
  contactsSkipped: number;
};