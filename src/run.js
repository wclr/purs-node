const [path, fn] = process.argv.splice(2, 2)

const m = require(path)

if (typeof m[fn] === "function") {
  m[fn]()
} else {
  console.error("Module", path, "has no", fn, "function export.")
}
