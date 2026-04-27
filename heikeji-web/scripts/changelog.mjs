#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

interface ChangelogEntry {
  version: string
  date: string
  type: 'major' | 'minor' | 'patch'
  changes: {
    added?: string[]
    changed?: string[]
    deprecated?: string[]
    removed?: string[]
    fixed?: string[]
    security?: string[]
  }
}

function getCurrentVersion(): string {
  try {
    const pkgContent = fs.readFileSync('package.json', 'utf-8')
    const pkg = JSON.parse(pkgContent)
    return pkg.version || '0.0.1'
  } catch {
    return '0.0.1'
  }
}

function getGitLog(since?: string): string[] {
  try {
    const sinceTag = since ? `${since}..` : ''
    const log = execSync(`git log ${sinceTag}--pretty=format:"%s" --no-merges`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    })
    return log.split('\n').filter(Boolean)
  } catch {
    return []
  }
}

function parseCommitMessages(commits: string[]): ChangelogEntry['changes'] {
  const changes: ChangelogEntry['changes'] = {
    added: [],
    changed: [],
    deprecated: [],
    removed: [],
    fixed: [],
    security: []
  }

  const patterns = {
    added: /^(feat|add|new|feature)(\(.+\))?\s*:\s*(.+)/i,
    changed: /^(change|update|modify|refactor)(\(.+\))?\s*:\s*(.+)/i,
    deprecated: /^(deprecate)(\(.+\))?\s*:\s*(.+)/i,
    removed: /^(remove|delete)(\(.+\))?\s*:\s*(.+)/i,
    fixed: /^(fix|bug|patch|hotfix)(\(.+\))?\s*:\s*(.+)/i,
    security: /^(security|sec)(\(.+\))?\s*:\s*(.+)/i
  }

  commits.forEach((commit) => {
    for (const [type, pattern] of Object.entries(patterns)) {
      const match = commit.match(pattern)
      if (match) {
        const category = type as keyof typeof changes
        if (changes[category]) {
          changes[category]!.push(match[3].trim())
        }
        break
      }
    }
  })

  return changes
}

function bumpVersion(current: string, type: ChangelogEntry['type']): string {
  const parts = current.split('.').map(Number)

  switch (type) {
    case 'major':
      return `${parts[0] + 1}.0.0`
    case 'minor':
      return `${parts[0]}.${parts[1] + 1}.0`
    case 'patch':
      return `${parts[0]}.${parts[1]}.${parts[2] + 1}`
    default:
      return current
  }
}

function generateChangelog(): void {
  const args = process.argv.slice(2)
  const versionType = (args.find((arg) => arg.startsWith('--type='))?.split('=')[1] || 'patch') as ChangelogEntry['type']
  const dryRun = args.includes('--dry-run')

  const currentVersion = getCurrentVersion()
  const newVersion = bumpVersion(currentVersion, versionType)
  const commits = getGitLog()
  const changes = parseCommitMessages(commits)

  if (Object.values(changes).every((arr) => arr.length === 0)) {
    console.log('ℹ️  No changes detected since last release')
    return
  }

  const entry: ChangelogEntry = {
    version: newVersion,
    date: new Date().toISOString().split('T')[0],
    type: versionType,
    changes
  }

  const markdown = formatChangelog(entry)

  if (dryRun) {
    console.log('\n📋 Generated Changelog:\n')
    console.log(markdown)
    console.log(`\n🔢 Version: ${currentVersion} → ${newVersion}`)
    return
  }

  let existingContent = ''

  if (fs.existsSync('CHANGELOG.md')) {
    existingContent = fs.readFileSync('CHANGELOG.md', 'utf-8')
  }

  const header = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`

  const content = header + markdown + '\n\n' + existingContent.replace(header, '')

  fs.writeFileSync('CHANGELOG.md', content.trim() + '\n')

  console.log(`✅ CHANGELOG.md updated (${currentVersion} → ${newVersion})`)

  if (!dryRun) {
    updatePackageVersion(newVersion)
    createGitTag(newVersion)
  }
}

function formatChangelog(entry: ChangelogEntry): string {
  const sections: { key: keyof typeof entry.changes; emoji: string; title: string }[] = [
    { key: 'added', emoji: '✨', title: 'Added' },
    { key: 'changed', emoji: '🔄', title: 'Changed' },
    { key: 'deprecated', emoji: '⚠️', title: 'Deprecated' },
    { key: 'removed', emoji: '❌', title: 'Removed' },
    { key: 'fixed', emoji: '🐛', title: 'Fixed' },
    { key: 'security', emoji: '🔒', title: 'Security' }
  ]

  let md = `## [${entry.version}] - ${entry.date}\n\n`

  sections.forEach(({ key, emoji, title }) => {
    const items = entry.changes[key]
    if (items && items.length > 0) {
      md += `### ${emoji} ${title}\n\n`
      items.forEach((item) => {
        md += `- ${item}\n`
      })
      md += '\n'
    }
  })

  return md.trim()
}

function updatePackageVersion(version: string): void {
  try {
    const pkgPath = 'package.json'
    const pkgContent = fs.readFileSync(pkgPath, 'utf-8')
    const pkg = JSON.parse(pkgContent)
    pkg.version = version
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
    console.log(`📦 package.json updated to v${version}`)
  } catch (error) {
    console.error('❌ Failed to update package.json:', error)
  }
}

function createGitTag(version: string): void {
  try {
    execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'pipe' })
    console.log(`🏷️  Git tag created: v${version}`)
  } catch (error) {
    console.warn('⚠️  Failed to create git tag:', error)
  }
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📝 Changelog Generator - Automated changelog management

Usage:
  node scripts/changelog.js [options]

Options:
  --type=<type>     Version bump type (major|minor|patch) [default: patch]
  --dry-run         Preview without writing files
  --help, -h        Show this help message

Examples:
  # Generate changelog for patch release
  node scripts/changelog.js

  # Generate for minor release
  node scripts/changelog.js --type=minor

  # Preview without saving
  node scripts/changelog.js --dry-run
`)
  process.exit(0)
}

generateChangelog()
