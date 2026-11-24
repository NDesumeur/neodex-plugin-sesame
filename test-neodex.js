// lancé par le test « local » de NeoDex : tape des mots de passe de plus en plus complets et vérifie que les règles apparaissent une à une
// (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const type = p => pj(`(() => { const i = document.querySelector('.sxIn'); i.value = ${JSON.stringify(p)}; i.dispatchEvent(new Event('input', {bubbles: true})); return 0; })()`);
  const label = () => pj(`document.getElementById('sxCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('sxCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'sesame-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const rule = async () => { const l = await label(), m = /règle (\d+) sur/.exec(l); if (!m) throw new Error('règles illisibles : « ' + l + ' »'); return +m[1]; };
  await sleep(500);
  // le plein écran : la case et les règles remplissent l'écran ; puis la place prise dans la fenêtre
  await pj(`document.getElementById('sxFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('sxCanvas'), r = c.getBoundingClientRect(), i = document.querySelector('.sxIn').getBoundingClientRect(); return document.fullscreenElement === c.parentElement && r.bottom <= innerHeight + 1 && i.top >= -1 && r.height > innerHeight * 0.8 && document.activeElement.classList.contains('sxIn'); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l’écran');
  const L = await pj(`(() => { const r = document.getElementById('sxCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('sxCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  await type('abc'); await sleep(400); await shot('0-depart');
  if (await rule() !== 1) throw new Error('une seule règle attendue au départ : « ' + (await label()) + ' »');
  await type('Abcdefg1!'); await sleep(400);
  if (await rule() < 5) throw new Error('5 règles au moins attendues : « ' + (await label()) + ' »');
  await shot('1-regles');
  // chaque partie tire ses règles : deux parties de suite ne se ressemblent pas, la partie du jour est toujours la même
  const deal = () => pj(`(() => { const s = document.getElementById('sxCanvas').__sx.st(); return s.rules.map(R => R.t('', s)).join('|') + '#' + s.sum + '#' + s.a + 'x' + s.b; })()`);
  const d1 = await deal(); await pj(`document.getElementById('sxNew').click(), 0`); const d2 = await deal(); await pj(`document.getElementById('sxNew').click(), 0`); const d3 = await deal();
  if (d1 === d2 && d2 === d3) throw new Error('les règles devaient changer d’une partie à l’autre');
  const dd = []; for (let k = 0; k < 2; k++) { await pj(`document.getElementById('sxDaily').click(), 0`); dd.push(await deal()); } if (dd[0] !== dd[1]) throw new Error('partie du jour');
  // jusqu'au bout : un mot de passe qui respecte les 16 règles tirées, puis Entrée
  await type(await pj(`document.getElementById('sxCanvas').__sx.solve()`)); await sleep(500); await shot('2-tout-vert');
  if (await pj(`(() => { const s = document.getElementById('sxCanvas').__sx.st(); return s.shown + '/' + s.okAt.every(Boolean); })()`) !== '16/true') throw new Error('16 règles attendues : « ' + (await label()) + ' » ' + await pj(`document.querySelector('.sxIn').value + ' / ' + JSON.stringify(document.getElementById('sxCanvas').__sx.st().pw)`));
  await pj(`document.querySelector('.sxIn').dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true})), 0`); await sleep(600); await shot('3-gagne');
  const l = await label(); if (!/gagné/.test(l)) throw new Error('mot de passe refusé : « ' + l + ' »');
  if (!/Partie du jour\s*faite/.test(await pj(`document.getElementById('sxStats').textContent`))) throw new Error('partie du jour : stats');
  return l;
};
