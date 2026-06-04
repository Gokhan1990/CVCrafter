import { useMemo } from 'react';

const PAGE_PX = 297 * 3.78;
const PAGE_PAD_T = 12;
const viewH = PAGE_PX - PAGE_PAD_T * 2;
const BUF = 12;
const CAT_ORDER = ['languages', 'frameworks', 'tools', 'databases', 'other'];

function est(data) {
  const e = x => x || 0;
  const hdrH = 150;
  const secH = 50;
  const av = viewH - hdrH - BUF;

  const sumH = data.summary ? secH + 95 : 0;

  const expHs = (data.experience || []).map(exp => {
    const lines = Math.ceil(e(exp.description || '').length / 72) || 1;
    return secH + 55 + lines * 28;
  });
  const eduHs = (data.education || []).map(() => secH + 55);

  const withName = (arr) => (arr || []).filter(x => x && x.name);
  const allSkills = withName(data.skills);

  // Skill groups: estimate height per category
  const skGroups = CAT_ORDER.map((cat, gi) => {
    const items = allSkills.filter(s => s.category === cat);
    if (items.length === 0) return null;
    const totalH = 22 + items.length * 25; // 22 = category label + group margin, 25 per skill
    return { type: 'skill-group', h: totalH, gi, cat, indices: items.map(s => data.skills.indexOf(s)).filter(i => i >= 0) };
  }).filter(Boolean);

  const langHs = withName(data.languages).map(() => 55 + 8);
  const certHs = withName(data.certifications).map(() => 44 + 8);

  const skGroupOverhead = 22;

  const mainItems = [];
  if (data.summary) mainItems.push({ type: 'summary', h: sumH });
  expHs.forEach((h, i) => mainItems.push({ type: 'experience', h, idx: i }));
  eduHs.forEach((h, i) => mainItems.push({ type: 'education', h, idx: i }));

  const sideItems = [];
  skGroups.forEach(g => sideItems.push(g));
  langHs.forEach((h, i) => {
    let orig = -1, c = 0;
    (data.languages || []).some((l, li) => {
      if (l && l.name) { if (c === i) { orig = li; return true; } c++; }
      return false;
    });
    sideItems.push({ type: 'language', h, idx: orig });
  });
  certHs.forEach((h, i) => {
    let orig = -1, c = 0;
    (data.certifications || []).some((crt, ci) => {
      if (crt && crt.name) { if (c === i) { orig = ci; return true; } c++; }
      return false;
    });
    sideItems.push({ type: 'certification', h, idx: orig });
  });

  const pages = [];
  let mi = 0, si = 0;

  while (mi < mainItems.length || si < sideItems.length) {
    const isFirstPage = pages.length === 0;
    const effectiveAv = isFirstPage ? av : viewH - BUF;
    let mh = 0, sh = 0;
    const ms = mi, ss = si;
    const pm = [], ps = [];
    let anyM = false, anyS = false;

    while (mi < mainItems.length) {
      const item = mainItems[mi];
      if (mh + item.h > effectiveAv && anyM) break;
      mh += item.h; anyM = true; pm.push(item); mi++;
    }
    // If first item on new page doesn't fit, force it
    if (pm.length === 0 && mi < mainItems.length) {
      pm.push(mainItems[mi]); mi++; anyM = true;
    }

    while (si < sideItems.length) {
      const item = sideItems[si];
      const sideAvail = anyM ? Math.min(mh, effectiveAv * 0.65) : effectiveAv;
      if (sh + item.h > sideAvail && anyS) break;
      sh += item.h; anyS = true; ps.push(item); si++;
    }
    if (ps.length === 0 && si < sideItems.length) {
      ps.push(sideItems[si]); si++; anyS = true;
    }

    if (!anyM && !anyS) break;
    pages.push({ pm, ps });
    if (pages.length >= 10) break;
  }

  return pages.map((p, pi) => {
    const fi = (arr, type) => {
      const ids = p.pm.filter(i => i.type === type).map(i => i.idx);
      if (!ids.length) return [];
      const m = {}; ids.forEach(i => { m[i] = true; });
      return arr.filter((_, i) => m[i]);
    };
    const fs = (arr, type) => {
      if (type === 'skill') {
        const cats = {};
        p.ps.filter(i => i.type === 'skill-group').forEach(g => {
          g.indices.forEach(idx => { cats[idx] = true; });
        });
        return arr.filter((_, i) => cats[i]);
      }
      const ids = p.ps.filter(i => i.type === type).map(i => i.idx);
      if (!ids.length) return [];
      const m = {}; ids.forEach(i => { m[i] = true; });
      return arr.filter((_, i) => m[i]);
    };

    return {
      ...data,
      personal: pi === 0 ? data.personal : null,
      summary: pi === 0 ? data.summary : '',
      experience: fi(data.experience || [], 'experience'),
      education: fi(data.education || [], 'education'),
      skills: fs(data.skills || [], 'skill'),
      languages: fs(data.languages || [], 'language'),
      certifications: fs(data.certifications || [], 'certification'),
    };
  });
}

export default function MultiPagePreview({ Template, data }) {
  const pageDataList = useMemo(() => est(data), [data]);

  const noData = !data || !data.experience || data.experience.length === 0;
  if (!Template) return <div style={{ padding: 20, color: '#999' }}>Template seçilmedi</div>;
  if (noData) return <div style={{ padding: 20, color: '#999' }}>CV verisi bulunamadı</div>;

  return (
    <div>
      {pageDataList.map((pd, i) => (
        <div key={i} className="mpPage" style={{
          width: '210mm', height: PAGE_PX + 'px',
          overflow: 'hidden', background: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: i < pageDataList.length - 1 ? 30 : 0,
          position: 'relative',
          padding: `${PAGE_PAD_T}px 0`,
          boxSizing: 'border-box',
        }}>
          <Template data={pd} />
          <div style={{ position: 'absolute', bottom: 20, right: 30, fontSize: 10, color: '#ccc' }}>
            {i + 1}
          </div>
        </div>
      ))}
      {pageDataList.length > 0 && (
        <div style={{ textAlign: 'center', fontSize: 13, color: '#999', marginTop: 8 }}>
          Toplam {pageDataList.length} sayfa
        </div>
      )}
    </div>
  );
}
