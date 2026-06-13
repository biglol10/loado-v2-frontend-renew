#!/usr/bin/env node
// @ts-check
/**
 * i18n 로케일 검증 스크립트 (의존성 없음, Node 18+).
 *
 *  검사 항목
 *   1. 정렬   : 각 로케일 JSON의 키가 알파벳순인지 검사. --fix 시 자동 정렬 후 git add.
 *   2. 정합성 : ko / en 사이에 누락된 키가 있는지 양방향 검사 (에러 → 커밋 차단).
 *   3. 미사용 : 소스에서 한 번도 t()로 참조되지 않는 키 탐지 (경고만, 차단 안 함).
 *
 *  동적 키(`t(`prefix.${x}`)`)는 정적 prefix를 추출해 해당 네임스페이스 전체를 사용 처리한다.
 *
 *  사용법:  node scripts/i18n-validate.mjs [--fix]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');

const FIX = process.argv.includes('--fix');

// 로케일별 병합 대상 파일들 (locales/{lang}/index.ts에서 스프레드 병합되는 것과 동일)
const LOCALES = {
  ko: ['src/locales/ko/ko.json', 'src/locales/ko/validation.json'],
  en: ['src/locales/en/en.json', 'src/locales/en/validation.json'],
};

const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

let hasError = false;

/** 객체 키를 재귀적으로 알파벳순 정렬한 새 객체 반환 */
function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, key) => {
        acc[key] = sortDeep(value[key]);
        return acc;
      }, {});
  }
  return value;
}

/** 리프(문자열 값) 키 경로를 점 표기로 수집 */
function collectLeafKeys(obj, prefix = '', out = new Set()) {
  for (const [key, val] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      collectLeafKeys(val, full, out);
    } else {
      out.add(full);
    }
  }
  return out;
}

/** 한 로케일의 모든 파일을 병합한 객체 반환 */
function loadMergedLocale(files) {
  return files.reduce((merged, rel) => {
    const json = JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
    return { ...merged, ...json };
  }, {});
}

/** src 하위 .ts/.tsx 파일 경로 전부 수집 */
function collectSourceFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      collectSourceFiles(full, out);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

// ─────────────────────────────────────────────
// 1. 정렬 검사 / 자동 수정
// ─────────────────────────────────────────────
function checkSorting() {
  const unsorted = [];
  const fixedFiles = [];

  for (const rel of [...LOCALES.ko, ...LOCALES.en]) {
    const abs = path.join(ROOT, rel);
    const raw = fs.readFileSync(abs, 'utf8');
    const parsed = JSON.parse(raw);
    const sorted = `${JSON.stringify(sortDeep(parsed), null, 2)}\n`;

    if (raw === sorted) continue;

    if (FIX) {
      fs.writeFileSync(abs, sorted, 'utf8');
      fixedFiles.push(rel);
    } else {
      unsorted.push(rel);
    }
  }

  if (fixedFiles.length) {
    console.log(c.green('✔ 정렬 자동 수정:'));
    fixedFiles.forEach((f) => console.log(`    ${c.dim(f)}`));
    try {
      execFileSync('git', ['add', ...fixedFiles], { cwd: ROOT, stdio: 'ignore' });
      console.log(c.dim('    (수정된 파일을 다시 git add 했습니다)'));
    } catch {
      console.log(c.yellow('    ⚠ git add 실패 — 수동으로 add 해주세요.'));
    }
  }

  if (unsorted.length) {
    hasError = true;
    console.log(c.red('✘ 정렬 안 됨 (알파벳순 아님):'));
    unsorted.forEach((f) => console.log(`    ${f}`));
    console.log(c.dim('    → `node scripts/i18n-validate.mjs --fix` 로 자동 정렬'));
  }
}

// ─────────────────────────────────────────────
// 2. ko ↔ en 정합성 (양방향 누락)
// ─────────────────────────────────────────────
function checkParity() {
  const ko = collectLeafKeys(loadMergedLocale(LOCALES.ko));
  const en = collectLeafKeys(loadMergedLocale(LOCALES.en));

  const missingInEn = [...ko].filter((k) => !en.has(k)).sort();
  const missingInKo = [...en].filter((k) => !ko.has(k)).sort();

  if (missingInEn.length) {
    hasError = true;
    console.log(c.red(`✘ en에 누락된 키 (${missingInEn.length}개) — ko에는 있음:`));
    missingInEn.forEach((k) => console.log(`    ${k}`));
  }
  if (missingInKo.length) {
    hasError = true;
    console.log(c.red(`✘ ko에 누락된 키 (${missingInKo.length}개) — en에는 있음:`));
    missingInKo.forEach((k) => console.log(`    ${k}`));
  }
  if (!missingInEn.length && !missingInKo.length) {
    console.log(c.green('✔ ko ↔ en 키 정합성 일치'));
  }

  // 사용 여부 검사는 두 로케일 키의 합집합 기준으로 수행
  return new Set([...ko, ...en]);
}

// ─────────────────────────────────────────────
// 3. 미사용 키 (경고만)
// ─────────────────────────────────────────────
function checkUnused(allKeys) {
  const files = collectSourceFiles(SRC_DIR);

  const staticKeys = new Set();
  const dynamicPrefixes = new Set();

  // 정적:  t('a.b.c')  /  i18n.t("a.b")
  const staticRe = /\bt\(\s*['"]([^'"]+)['"]/g;
  // 동적:  t(`a.b.${x}`)  → 정적 prefix "a.b." 추출
  const dynamicRe = /\bt\(\s*`([^`$]*)\$\{/g;

  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = staticRe.exec(code))) staticKeys.add(m[1]);
    while ((m = dynamicRe.exec(code))) {
      if (m[1]) dynamicPrefixes.add(m[1]); // 예: "simulation.materials."
    }
  }

  const isUsed = (key) =>
    staticKeys.has(key) || [...dynamicPrefixes].some((p) => key.startsWith(p));

  const unused = [...allKeys].filter((k) => !isUsed(k)).sort();

  if (unused.length) {
    console.log(
      c.yellow(`⚠ 소스에서 사용되지 않는 키 (${unused.length}개) — 경고:`)
    );
    unused.forEach((k) => console.log(`    ${c.dim(k)}`));
    console.log(
      c.dim('    (동적 키는 prefix 화이트리스트로 처리됨. 의도된 키면 무시해도 됩니다)')
    );
  } else {
    console.log(c.green('✔ 미사용 키 없음'));
  }
}

// ─────────────────────────────────────────────
console.log(c.bold(c.cyan('\n🌐 i18n 로케일 검증\n')));

checkSorting();
const allKeys = checkParity();
checkUnused(allKeys);

console.log('');
if (hasError) {
  console.log(c.red(c.bold('✘ i18n 검증 실패 — 위 에러를 해결해야 커밋됩니다.\n')));
  process.exit(1);
}
console.log(c.green(c.bold('✔ i18n 검증 통과\n')));
process.exit(0);
