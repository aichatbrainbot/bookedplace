import fs from 'fs'
import path from 'path'

// A simple script to find potentially unused files by searching for their base name 
// as an import string across the `src` directory.

const srcDir = path.join(process.cwd(), 'src')

function getAllFiles(dir: string, ext = ['.ts', '.tsx']): string[] {
    let results: string[] = []
    const list = fs.readdirSync(dir)
    list.forEach(file => {
        file = path.join(dir, file)
        const stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(file, ext))
        } else {
            if (ext.some(e => file.endsWith(e))) {
                results.push(file)
            }
        }
    })
    return results
}

const allFiles = getAllFiles(srcDir)
const fileContents = allFiles.map(f => ({ path: f, content: fs.readFileSync(f, 'utf8') }))

// Check components specifically
const componentDir = path.join(srcDir, 'components')
const componentFiles = getAllFiles(componentDir)

console.log("Analyzing components...")
const potentiallyUnused = []

for (const compPath of componentFiles) {
    // Ignore ui components as they are from shadcn
    if (compPath.includes('components\\ui\\') || compPath.includes('components/ui/')) continue

    const baseName = path.basename(compPath, path.extname(compPath))
    // simple heuristic: does any file import this component?
    // looking for `import ... from '.../BaseName'` or `<BaseName`

    let isUsed = false
    for (const file of fileContents) {
        if (file.path === compPath) continue // dont check self

        if (file.content.includes(baseName) || file.content.includes(`<${baseName}`)) {
            isUsed = true
            break
        }
    }

    if (!isUsed) {
        potentiallyUnused.push(compPath)
    }
}

console.log(`Found ${potentiallyUnused.length} potentially unused components:`)
potentiallyUnused.forEach(p => console.log(p.replace(process.cwd(), '')))
