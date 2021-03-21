#!/usr/bin/env node

const minimist = require("minimist")
const os = require("os")
const crypto = require("crypto")
const fs = require("fs")
const ch = require("child_process")
const path = require("path")

const argv = process.argv.slice(2)

const upstreamSplit = argv.indexOf("---")
const upstreamArgs = upstreamSplit > 0 ? argv.slice(upstreamSplit + 1) : []
const mArgs = upstreamSplit > 0 ? argv.slice(0, upstreamSplit) : argv

const args = minimist(mArgs, {
  boolean: ["dev", "poll", "cls", "deps", "help", "debug"],
  string: ["output", "fn", "tmp"],
  stopEarly: true,
})

const logMsg = (msg) => {
  console.log(msg)
  process.exit(0)
}

if (args.help) {
  logMsg(
    [
      "----",
      "Runs purescript compiled output files.",
      "",
      "Usage:",
      "\tpurs-node [options] App.Main [args] --- [node args]",
      "",
      "Options:",
      "\t--output - output dir, default is `output`",
      "\t--fn - function to run, default is `main`",
      "",
      "Usage watch mode (node-dev should be installed):",
      "\tpurs-node-dev [options] App.Main [args] --- [node-dev args]",
      "",
      "Dev options:",
      "--cls - clear screen on restart, default `false`",
      "--deps - watch `node_modules` dependencies, default `false`",
      "--poll - for fs polling, when normal fs watching doesn't work, default `false`",
      "",
      "To pass options upstream options to `node` or `node-dev` put them after `---`.",
      "In case of `node-dev` it will override preset defaults.",
      "",
    ]
      .map((s) => s.replace("\t", "  "))
      .join("\n")
  )
}

const getHash = (str) =>
  crypto.createHash("md5").update(str).digest("hex").slice(0, 16)

const output = args.output || "output"
const fn = args.fn || "main"
const main = args._[0]
const mainArgs = args._.slice(1).join(" ")

if (!main) {
  logMsg('You need to provide main purescript module like "App.Main"')
}

const dir = process.cwd()

const nodeDevBin = () => {
  const local = path.join(dir, "node_modules/node-dev/bin/node-dev")
  return fs.existsSync(local) ? "node " + local : "node-dev"
}

const nodeDevArgs = () => {
  return upstreamArgs.length
    ? upstreamArgs.join(" ")
    : [
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
  ? [nodeDevBin(), nodeDevArgs(), entryPath, mainArgs].join(" ")
  : ["node", ...upstreamArgs, entryPath, mainArgs].join(" ")

if (args.debug) {
  console.log("Running:", cmd)
}

ch.execSync(cmd, { stdio: "inherit" })
