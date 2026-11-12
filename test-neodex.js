// lancé par le test « local » de NeoDex : tape des mots de passe de plus en plus complets et vérifie que les règles apparaissent une à une
// (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const type = p => pj(`(() => { const i = document.querySelector('.sxIn'); i.value = ${JSON.stringify(p)}; i.dispatchEvent(new Event('input', {bubbles: true})); return 0; })()`);
  const label = () => pj(`document.getElementById('sxCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('sxCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'sesame-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const rule = async () => { const l = await label(), m = /règle (\d+) sur/.exec(l); if (!m) throw new Error('règles illisibles : « ' + l + ' »'); return +m[1]; };
  await sleep(500);
  await type('abc'); await sleep(400); await shot('0-depart');
  if (await rule() !== 1) throw new Error('une seule règle attendue au départ : « ' + (await label()) + ' »');
  await type('Abcdefg1!'); await sleep(400);
  if (await rule() !== 5) throw new Error('5 règles attendues : « ' + (await label()) + ' »');
  await type('Abcdfg99!2lundi'); await sleep(400);
  await type('Abcdfg99!2lundi42'); await sleep(500); await shot('1-conflit');
  const n = await rule(), l = await label();
  if (n !== 7 || !/Les chiffres font 20/.test(l)) throw new Error('le calcul doit casser la somme des chiffres : « ' + l + ' »');
  if (process.env.NEO_SHOTS) {  // jusqu'au bout : lit la capitale et la devinette demandées dans le code du jeu, construit le mot de passe et valide
    const src = require('fs').readFileSync(require('path').join(process.env.NEO_LOCAL || __dirname, 'index.js'), 'utf8');
    const caps = [...src.split('\n').find(x => x.startsWith('const SX_CAPS')).matchAll(/\['([^']+)', '([a-z]+)'\]/g)];
    const rids = [...src.split('\n').find(x => x.startsWith('const SX_RIDDLES')).matchAll(/\['([^']+)', \[([^\]]+)\]\]/g)].map(m => [m[1], m[2].split(', ').map(a => a.slice(1, -1))]);
    const sum = p => [...p].filter(c => c >= '0' && c <= '9').reduce((a, c) => a + +c, 0), prime = k => { for (let i = 2; i * i <= k; i++) if (k % i === 0) return false; return k > 1; };
    const build = core => { core += new Date().getHours() + 'h🐱'; const left = 20 - sum(core); core += '9'.repeat(Math.floor(left / 9)) + (left % 9 ? String(left % 9) : ''); let p = '!' + core + '!'; while (!prime([...p].length)) p = p.slice(0, -1) + 'x!'; return p; };
    await type(build('LAlundicantal42')); await sleep(400);
    const l1 = await label(), c1 = caps.find(m => l1.includes('La capitale ' + m[1]));
    if (!c1) throw new Error('capitale non lue : « ' + l1 + ' »');
    await type(build('LAlundicantal42' + c1[2])); await sleep(400);
    const l2 = await label(), r1 = rids.find(r => l2.includes(r[0]));
    if (!r1) throw new Error('devinette non lue : « ' + l2 + ' »');
    const ans = r1[1].reduce((a, b) => (a.split('e').length <= b.split('e').length ? a : b));
    await type(build('LAlundicantal42' + c1[2] + ans)); await sleep(500); await shot('2-tout-vert');
    await pj(`document.querySelector('.sxIn').dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true})), 0`); await sleep(600); await shot('3-gagne');
    if (!/gagné/.test(await label())) throw new Error('mot de passe refusé : « ' + (await label()) + ' »');
  }
  return l;
};
