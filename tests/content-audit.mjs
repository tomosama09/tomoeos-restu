import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const baseDir = path.resolve(__dirname, '..')

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    if (file === 'node_modules' || file === '.nuxt' || file === '.output' || file === '.git' || file === 'tests') continue
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList)
    } else if (file.endsWith('.vue') || file.endsWith('.ts')) {
      fileList.push(filePath)
    }
  }
  return fileList
}

const codeFiles = getAllFiles(baseDir)
let failures = 0

console.log(`[TEST] Scanning ${codeFiles.length} source files for anti-slop rules...`)

// Test 1: Zero em dash
const filesWithEmDash = []
for (const file of codeFiles) {
  const content = fs.readFileSync(file, 'utf-8')
  if (content.includes('—')) {
    filesWithEmDash.push(path.relative(baseDir, file))
  }
}
if (filesWithEmDash.length > 0) {
  console.error(`❌ FAIL: Found forbidden em dash in: ${filesWithEmDash.join(', ')}`)
  failures++
} else {
  console.log(`✅ PASS: Zero em dash characters found across all source files.`)
}

// Test 2: Prohibit RedR and PBI sections
const forbidden = ['RedR', 'PBI / ELESP', 'PBI Study Program']
const violations = []
for (const file of codeFiles) {
  if (file.includes('tests/')) continue
  const content = fs.readFileSync(file, 'utf-8')
  for (const token of forbidden) {
    if (content.includes(token)) {
      violations.push(`${path.relative(baseDir, file)} contains "${token}"`)
    }
  }
}
if (violations.length > 0) {
  console.error(`❌ FAIL: ${violations.join(', ')}`)
  failures++
} else {
  console.log(`✅ PASS: No mentions of RedR or PBI.`)
}

// Test 3: Verified metrics and titles
function findComponent(relPath) {
  const p1 = path.join(baseDir, 'app', relPath)
  if (fs.existsSync(p1)) return fs.readFileSync(p1, 'utf-8')
  return fs.readFileSync(path.join(baseDir, relPath), 'utf-8')
}

const paneAbout = findComponent('components/apps/explorer/PaneAbout.vue')
const checks = [
  ['Graphic Designer, Videographer & Photographer', 'Role Title'],
  ['500,000 views', '500,000+ views metric'],
  ['26,000 unique accounts', '26,000 unique accounts metric'],
  ['Sanata Dharma University (2026)', 'Sanata Dharma degree']
]
for (const [needle, label] of checks) {
  if (!paneAbout.includes(needle)) {
    console.error(`❌ FAIL: Missing ${label}`)
    failures++
  } else {
    console.log(`✅ PASS: Found ${label}`)
  }
}

const paneExp = findComponent('components/apps/explorer/PaneExperience.vue')
if (!paneExp.includes('Sanata Dharma University Library')) {
  console.error(`❌ FAIL: Missing USD Library in PaneExperience`)
  failures++
} else if (paneExp.includes('International Language and Language Teaching Conference') || paneExp.includes('LLTC')) {
  console.error(`❌ FAIL: Found unwanted LLTC in PaneExperience`)
  failures++
} else {
  console.log(`✅ PASS: Found USD Library and no LLTC in PaneExperience`)
}

const paneContact = findComponent('components/apps/explorer/PaneContact.vue')
if (!paneContact.includes('rstt.tomo@gmail.com')) {
  console.error(`❌ FAIL: Missing updated email rstt.tomo@gmail.com in PaneContact`)
  failures++
} else if (paneContact.includes('Open for Freelance')) {
  console.error(`❌ FAIL: Found unwanted "Open for Freelance" in PaneContact`)
  failures++
} else {
  console.log(`✅ PASS: PaneContact verified clean with updated email.`)
}

if (paneAbout.includes('Available for Commissions') || paneAbout.includes("SDU'26") || paneAbout.includes('Verified Credentials')) {
  console.error(`❌ FAIL: Found unwanted badge in PaneAbout`)
  failures++
} else {
  console.log(`✅ PASS: PaneAbout verified clean of badges.`)
}

if (failures > 0) {
  console.error(`\nTest suite FAILED with ${failures} error(s).`)
  process.exit(1)
} else {
  console.log(`\n🎉 ALL CONTENT AUDIT TESTS PASSED!`)
  process.exit(0)
}
