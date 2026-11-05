// Stack técnico que se muestra en la sección "Habilidades".
// Alineado con el CV (20261105_CV_JARO_ATS). Para actualizarlo, edita solo este
// archivo. Los nombres de cada categoría están en translations.ts → skills.categories.

export const skillData = {
  languages: ['C#', 'TypeScript', 'JavaScript', 'PHP', 'SQL (T-SQL)', 'HTML5', 'CSS3', 'Google Apps Script', 'VBA'],
  backend: ['.NET 10', 'ASP.NET Core', 'Blazor Server', 'EF Core', 'NestJS', 'Node.js', 'Express', 'CodeIgniter 3', 'Laravel'],
  frontend: ['React', 'Angular', 'Next.js', 'SvelteKit', 'MudBlazor', 'Tailwind CSS', 'Bootstrap', 'jQuery / Ajax'],
  mobile: ['Capacitor (Android)', 'Electron'],
  databases: ['SQL Server', 'PostgreSQL', 'SQLite / Cloudflare D1', 'FoxPro DBF', 'Supabase'],
  ai: ['OpenAI API', 'Gemini API', 'Structured JSON prompting', 'Claude Code', 'MCP', 'n8n'],
  integrations: ['Microsoft Graph', 'Azure AD / OAuth2', 'Google Maps Platform', 'Firmamex e-signature', 'WhatsApp', 'Socket.IO'],
  geospatial: ['GeoJSON', 'Turf.js', 'Leaflet', 'Mapbox GL'],
  reporting: ['PhpSpreadsheet', 'mPDF', 'TCPDF', 'PDFKit', 'ECharts', 'Chart.js', 'Power BI'],
  testing: ['xUnit', 'Jest', 'Vitest'],
  devops: ['Git', 'GitLab CI', 'GitHub', 'Docker', 'Docker Compose', 'PM2', 'Windows Services', 'Cloudflare Workers', 'XAMPP'],
  architecture: ['Clean Architecture', 'Layered Architecture', 'MVC', 'SOLID', 'ADRs', 'Microservices', 'Scrum', 'ISO/IEC 17025', 'LIMS'],
  tools: ['SAP', 'Microsoft Dynamics', 'WordPress', 'Excel'],
} as const;

export type SkillCategory = keyof typeof skillData;

/** Orden en que se muestran las categorías. */
// Los iconos de cada categoría están en components/SkillIcon.tsx.
export const skillCategoryOrder: { key: SkillCategory }[] = [
  { key: 'languages' },
  { key: 'backend' },
  { key: 'frontend' },
  { key: 'databases' },
  { key: 'ai' },
  { key: 'integrations' },
  { key: 'geospatial' },
  { key: 'reporting' },
  { key: 'devops' },
  { key: 'architecture' },
  { key: 'testing' },
  { key: 'mobile' },
  { key: 'tools' },
];

/** Total de tecnologías listadas (para el contador del hero). */
export const skillCount = Object.values(skillData).reduce((n, list) => n + list.length, 0);
