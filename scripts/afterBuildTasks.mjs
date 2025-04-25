import fs from 'node:fs'

const netlifyConfigFile = './.netlify/functions-internal/server/server.mjs'
if (!fs.existsSync(netlifyConfigFile)) {
	console.log(`Error: File "${netlifyConfigFile}" does not exist.`)
	process.exit(1)
}
let netlifyConfigFileContents = fs.readFileSync(netlifyConfigFile, 'utf8')
netlifyConfigFileContents = netlifyConfigFileContents.replace(
	'path: "/*"',
	'path: "/api/*"'
)
fs.writeFileSync(netlifyConfigFile, netlifyConfigFileContents, (error) => {
	if (error) {
		throw error
	}
})