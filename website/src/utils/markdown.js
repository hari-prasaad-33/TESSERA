export const fetchMarkdownContent = async () => {
  const response = await fetch('/content/TESSERA_ONE_CONTENT.md');
  if (!response.ok) {
    console.error('Failed to fetch markdown content');
    return '';
  }
  return response.text();
};

export const parseMarkdownSection = (markdown, heading) => {
  const sections = markdown.split(/(?=\n##\s+)/); 
  const targetSection = sections.find(s => s.trim().startsWith(`## ${heading}`));
  if (targetSection) {
    return targetSection.substring(targetSection.indexOf(`## ${heading}`) + `## ${heading}`.length).trim();
  }
  return '';
};
