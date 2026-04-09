import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export async function exportPDF(elementId, filename = 'resume.pdf') {
  const { default: html2pdf } = await import('html2pdf.js');
  const element = document.getElementById(elementId);
  if (!element) return;
  const opt = {
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };
  await html2pdf().set(opt).from(element).save();
}

function makeHeading(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
    border: { bottom: { color: '333333', space: 1, style: BorderStyle.SINGLE, size: 6 } },
  });
}

function makeText(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text: text || '', ...opts })],
    spacing: { after: 80 },
  });
}

export async function exportDOCX(cv, filename = 'resume.docx') {
  const name = [cv.personal.firstName, cv.personal.middleName, cv.personal.lastName].filter(Boolean).join(' ');
  const children = [];

  // Header
  children.push(new Paragraph({
    children: [new TextRun({ text: name, bold: true, size: 48 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }));

  const contact = [cv.personal.email, cv.personal.phone, cv.personal.website].filter(Boolean).join(' | ');
  if (contact) children.push(new Paragraph({ text: contact, alignment: AlignmentType.CENTER, spacing: { after: 200 } }));

  // Summary
  if (cv.personal.summary) {
    children.push(makeHeading('Professional Summary'));
    children.push(makeText(cv.personal.summary));
  }

  // Experience
  if (cv.experience?.length) {
    children.push(makeHeading('Work Experience'));
    cv.experience.forEach(e => {
      children.push(new Paragraph({ children: [new TextRun({ text: e.title || '', bold: true }), new TextRun({ text: e.company ? ` — ${e.company}` : '' })], spacing: { after: 60 } }));
      const dates = [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ');
      if (dates) children.push(makeText(dates, { italics: true, color: '666666' }));
      if (e.description) children.push(makeText(e.description));
    });
  }

  // Education
  if (cv.education?.length) {
    children.push(makeHeading('Education'));
    cv.education.forEach(e => {
      children.push(new Paragraph({ children: [new TextRun({ text: e.degree || '', bold: true }), new TextRun({ text: e.institution ? ` — ${e.institution}` : '' })], spacing: { after: 60 } }));
      const dates = [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ');
      if (dates) children.push(makeText(dates, { italics: true, color: '666666' }));
      if (e.description) children.push(makeText(e.description));
    });
  }

  // Skills
  if (cv.skills?.length) {
    children.push(makeHeading('Skills'));
    children.push(makeText(cv.skills.map(s => s.level ? `${s.name} (${s.level})` : s.name).join(', ')));
  }

  // Certifications
  if (cv.certifications?.length) {
    children.push(makeHeading('Certifications'));
    cv.certifications.forEach(c => {
      children.push(new Paragraph({ children: [new TextRun({ text: c.name || '', bold: true })], spacing: { after: 60 } }));
      if (c.authority) children.push(makeText(c.authority, { italics: true }));
      if (c.description) children.push(makeText(c.description));
    });
  }

  // Languages
  if (cv.languages?.length) {
    children.push(makeHeading('Languages'));
    children.push(makeText(cv.languages.map(l => `${l.name} (${l.proficiency})`).join(', ')));
  }

  // Interests
  if (cv.interests?.length) {
    children.push(makeHeading('Interests'));
    children.push(makeText(cv.interests.map(i => i.name).join(', ')));
  }

  // Custom sections
  cv.customSections?.forEach(section => {
    if (section.title) children.push(makeHeading(section.title));
    section.entries?.forEach(e => { if (e.content) children.push(makeText(e.content)); });
  });

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
