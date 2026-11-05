// Stack técnico que se muestra en la sección "Habilidades".
// Para actualizarlo, edita solo este archivo. Los nombres de cada categoría
// están en translations.ts → skills.categories.

export const skillData = {
  languages: ['JavaScript', 'TypeScript', 'C#', 'PHP', 'HTML5', 'CSS3', 'SQL', 'VBA'],
  frameworks: ['Angular', 'React', 'Next.js', 'NestJS', 'Node.js', 'Express', 'ASP.NET', 'Tailwind', 'Bootstrap', 'jQuery', 'Laravel'],
  databases: ['PostgreSQL', 'SQL Server', 'Supabase'],
  devops: ['Docker', 'PM2', 'XAMPP', 'Git', 'GitHub', 'GitLab'],
  architecture: ['Microservices', 'MVC / MVVC', 'SOLID', 'Scrum', 'ISO 17025', 'LIMS'],
  tools: ['Power BI', 'WordPress', 'Excel Avanzado', 'SAP', 'Microsoft Dynamics', 'n8n'],
} as const;

export type SkillCategory = keyof typeof skillData;
