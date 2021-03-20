#!/usr/bin/env node

const minimist = require("minimist")
const os = require("os")
const crypto = require("crypto")
const fs = require("fs")
const ch = require("child_process")
const path = require("path")

const args = minimist(process.argv.slice(2), {
  boolean: ["dev", "poll", "cls", "deps"],
  string: ["output", "fn", "tmp", "node-dev"],
  default: {
    deps: true,
  },
})

const getHash = (str) =>
  crypto.createHash("md5").update(str).digest("hex").slice(0, 16)

const logMsg = (msg) => {
  console.log(msg)
  process.exit(0)
}

const output = args.output || "output"
const fn = args.fn || "main"
const main = args._[0]

if (!main) {
  logMsg('You need to provide main purescript module like "App.Main"')
}

const dir = process.cwd()

const nodeDevBin = () => {
  const local = path.join(dir, "node_modules/node-dev/bin/node-dev")
  return fs.existsSync(local) ? "node " + local : "node-dev"
}

const nodeDevArgs = () => {
  if (typeof args["node-dev"] === "string") {
    return args["node-dev"]
      .replace(/^'/, "")
      .replace(/'$/, "")
      .split(",")
      .join(" ")
  }
  return [
    "--notify=false",
    "--respawn",
    args.poll ? "--poll" : "",
    args.cls ? "--clear" : "",
    args.deps ? "--deps -1" : "",
  ]
    .filter((_) => _)
    .join(" ")
}

const mainPath = path.join(dir, output, main, "index.js")

if (!fs.existsSync(mainPath)) {
  logMsg(["Main module", mainPath, "not found."].join(" "))
}

const code = [
  'require("',
  mainPath.replace(/\\/g, "/"),
  '").' + fn + "();",
].join("")

const entryPath = path.join(args.tmp || os.tmpdir(), getHash(code) + ".js")

fs.writeFileSync(entryPath, code)

const cmd = args.dev
  ? [nodeDevBin(), nodeDevArgs(), entryPath].join(" ")
  : ["node", entryPath].join(" ")

ch.execSync(cmd, { stdio: "inherit" })
