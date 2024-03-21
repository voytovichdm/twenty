export type IndexSubtopic = {
  title: string;
  url: string;
};

export type IndexHeading = {
  [heading: string]: IndexSubtopic[];
};

export const USER_GUIDE_INDEX = {
  'Getting Started': [
    { title: 'What is Twenty', url: 'what-is-twenty' },
    { title: 'Create a Workspace', url: 'create-workspace' },
    { title: 'Import/Export data', url: 'import-data' },
  ],
  Objects: [
    { title: 'People', url: 'people' },
    { title: 'Companies', url: 'companies' },
    { title: 'Opportunities', url: 'opportunities' },
    { title: 'Custom Objects', url: 'custom-objects' },
  ],
  Functions: [
    { title: 'Emails', url: 'emails' },
    { title: 'Notes', url: 'notes' },
    { title: 'Tasks', url: 'tasks' },
    { title: 'Integrations', url: 'integrations'},
    { title: 'API and Webhooks', url: 'api-webhooks'},
    { title: 'Glossary', url: 'glossary'},
    { title: 'Tips', url: 'tips'}
  ],
};
