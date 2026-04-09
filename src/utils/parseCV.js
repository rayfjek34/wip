// Client-side CV parsing — returns a partial CV object from uploaded file

export async function parseCV(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return parsePDF(file);
  if (ext === 'docx') return parseDOCX(file);
  throw new Error('Unsupported file type. Please upload a PDF or DOCX.');
}

async function parsePDF(file) {
  const { default: pdfjsLib } = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(' ') + '\n';
  }
  return extractStructure(fullText);
}

async function parseDOCX(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return extractStructure(result.value);
}

function extractStructure(text) {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const cv = { personal: {}, experience: [], education: [], skills: [], languages: [], certifications: [], interests: [], customSections: [] };

  // Extract email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  if (emailMatch) cv.personal.email = emailMatch[0];

  // Extract phone
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  if (phoneMatch) cv.personal.phone = phoneMatch[0].trim();

  // Extract website
  const webMatch = text.match(/https?:\/\/[^\s]+|www\.[^\s]+/i);
  if (webMatch) cv.personal.website = webMatch[0];

  // First non-email, non-phone line is likely the name
  const nameLine = lines.find(l => !l.includes('@') && !/\d{4}/.test(l) && l.split(' ').length <= 5 && l.length > 3);
  if (nameLine) {
    const parts = nameLine.trim().split(/\s+/);
    cv.personal.firstName = parts[0] || '';
    cv.personal.lastName = parts[parts.length - 1] || '';
    if (parts.length > 2) cv.personal.middleName = parts.slice(1, -1).join(' ');
  }

  // Try to find summary block
  const summaryIdx = lines.findIndex(l => /summary|profile|objective|about/i.test(l));
  if (summaryIdx !== -1 && lines[summaryIdx + 1]) {
    let summary = '';
    for (let i = summaryIdx + 1; i < Math.min(summaryIdx + 5, lines.length); i++) {
      if (/experience|education|skills|work|employment/i.test(lines[i])) break;
      summary += lines[i] + ' ';
    }
    cv.personal.summary = summary.trim();
  }

  // Skills extraction
  const skillsIdx = lines.findIndex(l => /^skills?$/i.test(l));
  if (skillsIdx !== -1) {
    for (let i = skillsIdx + 1; i < Math.min(skillsIdx + 10, lines.length); i++) {
      if (/experience|education|certification|language/i.test(lines[i])) break;
      const skillItems = lines[i].split(/[,•·|]+/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 50);
      skillItems.forEach(name => cv.skills.push({ id: Math.random().toString(36).slice(2), name, level: 'Intermediate' }));
    }
  }

  return cv;
}
