const fs = require('fs');
const { JSDOM } = require('jsdom');

// Read old data for language mapping
const oldData = JSON.parse(fs.readFileSync('../src/data/cctlds.json', 'utf8'));
const langMap = {};
oldData.forEach(item => {
    langMap[item.code] = item.language;
});

const html = fs.readFileSync('../cctlds_wiki.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const tables = Array.from(document.querySelectorAll('table.wikitable'));
const targetTable = tables.find(t => {
    const header = t.querySelector('tr')?.textContent || '';
    return header.includes('Name') && header.includes('Entity');
});

if (!targetTable) {
    console.error('Table not found');
    process.exit(1);
}

const rows = Array.from(targetTable.querySelectorAll('tr')).slice(1);
const results = [];

const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
};

rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('td, th'));
    if (cells.length < 4) return;

    const code = cells[0].textContent.trim().toLowerCase();
    if (!code.startsWith('.') || code.length > 5 || code.includes(' ')) return;

    const entityCell = cells[1];
    const country = entityCell.textContent.replace(/\[.*?\]/g, '').trim();

    let flag = '';
    const flagImg = entityCell.querySelector('img');
    if (flagImg) {
        flag = flagImg.src;
        if (flag.startsWith('//')) flag = 'https:' + flag;
    }

    const explanationCell = cells[2];
    // Strip links but keep contents
    explanationCell.querySelectorAll('a').forEach(a => {
        a.replaceWith(...a.childNodes);
    });
    const explanation = explanationCell.innerHTML.trim();

    const notes = cells[3].textContent.trim();

    let language = langMap[code] || 'English';
    language = toTitleCase(language);

    results.push({
        code,
        country,
        flag,
        explanation,
        notes,
        language
    });
});

fs.writeFileSync('../src/data/cctlds_enhanced.json', JSON.stringify(results));
console.log(`Successfully extracted ${results.length} entries to src/data/cctlds_enhanced.json`);
