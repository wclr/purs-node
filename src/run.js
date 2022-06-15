const [path, fn] = process.argv.splice(2, 2)

import("file://" + path).then((m) => {
  if (typeof m[fn] === "function") {
    m[fn]()
  } else {
    console.error("Module", path, "has no", "`" + fn + "`", "function export.")
  }
})
