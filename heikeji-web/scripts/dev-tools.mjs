#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const COMMANDS = {
  clean: {
    description: 'Clean build artifacts and caches',
    handler: cleanProject
  },
  'check-deps': {
    description: 'Check for outdated dependencies',
    handler: checkDependencies
  },
  'analyze-bundle': {
    description: 'Analyze bundle size and composition',
    handler: analyzeBundle
  },
  'gen-types': {
    description: 'Generate TypeScript declaration files',
    handler: generateTypes
  },
  'lint-fix': {
    description: 'Run ESLint with auto-fix',
    handler: lintFix
  },
  'format-all': {
    description: 'Format all source files with Prettier',
    handler: formatAll
  },
  'test-coverage': {
    description: 'Run tests with coverage report',
    handler: testCoverage
  },
  'health-check': {
    description: 'Run comprehensive project health check',
    handler: healthCheck
  }
}

function cleanProject(): void {
  const dirs = ['dist', 'node_modules/.cache', 'node_modules/.vite', '.turbo', 'coverage']
  const files = ['*.tsbuildinfo']

  console.log('🧹 Cleaning project...\n')

  dirs.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir)
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true })
      console.log(`  ✅ Removed: ${dir}`)
    }
  })

  console.log('\n✨ Clean complete!')
}

function checkDependencies(): void {
  console.log('📦 Checking dependencies...\n')

  try {
    const outdated = execSync('npm outdated --json', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    })

    const deps = JSON.parse(outdated)

    if (Object.keys(deps).length === 0) {
      console.log('✅ All dependencies are up to date!')
      return
    }

    console.log('📋 Outdated dependencies:\n')
    Object.entries(deps).forEach(([name, info]: [string, any]) => {
      console.log(`  ${name}`)
      console.log(`    Current: ${info.current}  Latest: ${info.latest}\n`)
    })

    console.log('💡 Run "npm update" to update dependencies')
  } catch (error: any) {
    if (error.status === 1) {
      console.log('✅ All dependencies are up to date!')
    } else {
      console.error('❌ Failed to check dependencies:', error.message)
    }
  }
}

function analyzeBundle(): void {
  console.log('📊 Analyzing bundle...\n')

  if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
    console.log('⚠️  No build found. Running build first...')
    execSync('npm run build', { stdio: 'inherit' })
  }

  const distPath = path.join(process.cwd(), 'dist')
  const assets = getDirectorySize(distPath)

  console.log('📦 Bundle Analysis:\n')
  console.log(`  Total Size: ${(assets.totalSize / 1024).toFixed(2)} KB`)
  console.log(`  Files: ${assets.fileCount}\n')

  console.log('  Largest files:')
  assets.largestFiles.slice(0, 10).forEach((file: any) => {
    console.log(`    ${(file.size / 1024).toFixed(2)} KB  ${file.name}`)
  })

  console.log('\n💡 For detailed analysis, run: npm run analyze')
}

function generateTypes(): void {
  console.log('🔧 Generating type declarations...\n')

  try {
    execSync('npx vue-tsc --declaration --emitDeclarationOnly', {
      stdio: 'inherit'
    })
    console.log('\n✅ Type declarations generated successfully!')
  } catch (error) {
    console.error('\n❌ Failed to generate types:', error)
  }
}

function lintFix(): void {
  console.log('🔍 Running ESLint with auto-fix...\n')

  try {
    execSync('npx eslint . --fix --ext .ts,.vue,.js', {
      stdio: 'inherit'
    })
    console.log('\n✅ Linting complete!')
  } catch (error) {
    console.error('\n❌ Linting failed:', error)
  }
}

function formatAll(): void {
  console.log('🎨 Formatting all files...\n')

  try {
    execSync('npx prettier --write "src/**/*.{ts,vue,js,css,scss}"', {
      stdio: 'inherit'
    })
    console.log('\n✅ Formatting complete!')
  } catch (error) {
    console.error('\n❌ Formatting failed:', error)
  }
}

function testCoverage(): void {
  console.log('🧪 Running tests with coverage...\n')

  try {
    execSync('vitest run --coverage', {
      stdio: 'inherit'
    })
  } catch (error) {
    console.error('\n❌ Tests failed:', error)
    process.exit(1)
  }
}

function healthCheck(): void {
  console.log('🏥 Running project health check...\n\n')

  const checks = [
    { name: 'TypeScript', command: 'npx vue-tsc --noEmit' },
    { name: 'ESLint', command: 'npx eslint src --ext .ts,.vue --max-warnings=0' },
    { name: 'Unit Tests', command: 'vitest run --reporter=verbose' },
    { name: 'Build', command: 'npm run build' }
  ]

  let passed = 0
  let failed = 0

  checks.forEach(({ name, command }) => {
    process.stdout.write(`  ${name}... `)

    try {
      execSync(command, {
        stdio: ['pipe', 'pipe', 'ignore'],
        timeout: 60000
      })
      console.log('✅ PASS')
      passed++
    } catch {
      console.log('❌ FAIL')
      failed++
    }
  })

  console.log(`\n📊 Results: ${passed}/${checks.length} passed`)

  if (failed > 0) {
    console.log('\n⚠️  Some checks failed. Please review the output above.')
    process.exit(1)
  }

  console.log('\n🎉 All checks passed! Project is healthy.')
}

function getDirectorySize(dirPath: string): any {
  let totalSize = 0
  let fileCount = 0
  const largestFiles: Array<{ name: string; size: number }> = []

  function walkDir(currentPath: string): void {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })

    entries.forEach((entry) => {
      const fullPath = path.join(currentPath, entry.name)

      if (entry.isDirectory()) {
        walkDir(fullPath)
      } else {
        const stat = fs.statSync(fullPath)
        totalSize += stat.size
        fileCount++

        largestFiles.push({ name: path.relative(dirPath, fullPath), size: stat.size })
        largestFiles.sort((a, b) => b.size - a.size)

        if (largestFiles.length > 20) {
          largestFiles.pop()
        }
      }
    })
  }

  walkDir(dirPath)

  return { totalSize, fileCount, largestFiles }
}

const args = process.argv.slice(2)

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printHelp()
  process.exit(0)
}

const commandName = args[0]
const command = COMMANDS[commandName as keyof typeof COMMANDS]

if (!command) {
  console.error(`❌ Unknown command: ${commandName}`)
  console.log('\nAvailable commands:')
  Object.entries(COMMANDS).forEach(([name, cmd]) => {
    console.log(`  ${name.padEnd(15)} ${cmd.description}`)
  })
  process.exit(1)
}

command.handler()

function printHelp(): void {
  console.log(`
🛠️  Dev Tools - Development utility commands

Usage:
  node scripts/dev-tools.js <command> [options]

Commands:
${Object.entries(COMMANDS)
  .map(
    ([name, cmd]) =>
      `  ${name.padEnd(15)} ${cmd.description}`
  )
  .join('\n')}

Examples:
  node scripts/dev-tools.js clean
  node scripts/dev-tools.js health-check
  node scripts/dev-tools.js lint-fix
`)
}
