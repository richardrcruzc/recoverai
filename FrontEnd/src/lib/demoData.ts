export const demoMetrics = {
  overdueBalance: 84250,
  collectedThisMonth: 18430,
  openInvoices: 46,
  priorityAccounts: 12,
  collectionRate: 68.4
};

export const demoInvoices = [
  {
    invoiceNumber: 'INV-1001',
    customer: 'Acme Studio',
    amount: 6800,
    balance: 6800,
    status: 'Overdue',
    daysOverdue: 32,
    priority: 'Critical',
    score: 88
  },
  {
    invoiceNumber: 'INV-1002',
    customer: 'NorthPeak IT',
    amount: 3200,
    balance: 1900,
    status: 'PartiallyPaid',
    daysOverdue: 18,
    priority: 'High',
    score: 71
  },
  {
    invoiceNumber: 'INV-1003',
    customer: 'Blue Harbor',
    amount: 1450,
    balance: 1450,
    status: 'Overdue',
    daysOverdue: 7,
    priority: 'Medium',
    score: 49
  }
];

export const demoReminders = [
  {
    invoice: 'INV-1001',
    customer: 'Acme Studio',
    status: 'Sent',
    channel: 'Email',
    subject: 'Payment reminder: Invoice INV-1001 is overdue'
  },
  {
    invoice: 'INV-1002',
    customer: 'NorthPeak IT',
    status: 'Skipped',
    channel: 'Email',
    subject: 'Reminder skipped because payment was recently received'
  },
  {
    invoice: 'INV-1003',
    customer: 'Blue Harbor',
    status: 'Pending',
    channel: 'Email',
    subject: 'Friendly payment reminder'
  }
];