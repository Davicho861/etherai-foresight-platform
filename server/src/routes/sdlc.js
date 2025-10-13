import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Utility: simple markdown parser that extracts headings and paragraphs
function parseMarkdownSections(md) {
  const lines = md.split(/\r?\n/);
  const sections = [];
  let current = { title: 'intro', content: [] };
  for (const line of lines) {
    const h = line.match(/^#{1,6}\s+(.*)/);
    if (h) {
      // start new section
      if (current) sections.push({ ...current, content: current.content.join('\n').trim() });
      current = { title: h[1].trim(), content: [] };
    } else {
      current.content.push(line);
    }
  }
  if (current) sections.push({ ...current, content: current.content.join('\n').trim() });
  return sections.filter(s => s.content || s.title);
}

router.get('/full-state', async (req, res) => {
  try {
    const repoRoot = path.resolve(process.cwd());
    const docsDir = path.join(repoRoot, 'docs', 'sdlc');
    const kanbanPathCandidates = [
      path.join(repoRoot, 'PROJECT_KANBAN.md'),
      path.join(repoRoot, 'docs', 'PROJECT_KANBAN.md'),
    ];

    // Read SDLC markdown files
    let sdlcFiles = [];
    try {
      const names = await fs.readdir(docsDir);
      sdlcFiles = await Promise.all(names.filter(n => n.endsWith('.md')).map(async (n) => {
        const abs = path.join(docsDir, n);
        const raw = await fs.readFile(abs, 'utf8');
        return { filename: n, content: raw, sections: parseMarkdownSections(raw) };
      }));
    } catch (err) {
      // ignore if docs dir not present
      sdlcFiles = [];
    }

    // Read PROJECT_KANBAN.md
    let kanbanRaw = '';
    for (const p of kanbanPathCandidates) {
      try {
        kanbanRaw = await fs.readFile(p, 'utf8');
        break;
      } catch (e) {
        // try next
      }
    }

    // Parse simple Kanban: columns are H2 headings (##) and tasks are list items
    function parseKanban(md) {
      if (!md) return { columns: [] };
      const lines = md.split(/\r?\n/);
      const columns = [];
      let current = null;
      for (const line of lines) {
        const col = line.match(/^##\s+(.*)/);
        if (col) {
          if (current) columns.push(current);
          current = { name: col[1].trim(), tasks: [] };
          continue;
        }
        const task = line.match(/^[-*]\s+(.*)/);
        if (task && current) {
          current.tasks.push(task[1].trim());
        }
      }
      if (current) columns.push(current);
      return { columns };
    }

    const kanban = parseKanban(kanbanRaw);

    res.json({
      success: true,
      sdlc: sdlcFiles,
      kanban,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[SDLC] error building full-state:', error && error.message ? error.message : error);
    res.status(500).json({ error: 'failed to build sdlc state' });
  }
});

export default router;
