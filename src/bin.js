#!/usr/bin/env node

const minimist = require("minimist")
const fs = require("fs")
const ch = require("child_process")
const path = require("path")

const argv = process.argv.slice(2)

const upstreamSplit = argv.indexOf("---")
const upstreamArgs = upstreamSplit > 0 ? argv.slice(upstreamSplit + 1) : []
const mArgs = upstreamSplit > 0 ? argv.slice(0, upstreamSplit) : argv

const unknownFlags = []

const args = minimist(mArgs, {
  boolean: ["dev", "poll", "cls", "deps", "help", "debug"],
  string: ["fn", "interval", "debounce", "output", "script", "tmp", "require"],
  alias: {
    require: ["r"],
  },
  stopEarly: true,
  unknown: (arg) => {
    if (arg.startsWith("-")) {
      unknownFlags.push(arg)
      return false
    }
    return true
  },
})

const exitWithMsg = (msg) => {
  console.log(msg)
  process.exit(0)
}

if (unknownFlags.length) {
  exitWithMsg("Unknown flags: " + JSON.stringify(unknownFlags))
}

if (args.help) {
  exitWithMsg(
    [
      "----",
      "Runs purescript compiled output files.",
      "",
      "Usage:",
      "\tpurs-node [options] App.Main [app args] --- [node args]",
      "",
      "Options:",
      "\t--output - output dir, default is `output`",
      "\t--fn - function to run, default is `main`",
      "",
      "Usage watch mode (node-dev should be installed):",
      "\tpurs-node-dev [options] App.Main [app args] --- [node-dev args]",
      "You can also pass function name (`dev` in this case) using such syntax:",
      "\tpurs-node App.Main:dev",
      "",
      "Dev options:",
      "--cls - clear screen on restart, default `false`",
      "--deps - watch `node_modules` dependencies, default `false`",
      "--poll - for fs polling, when normal fs watching doesn't work, default `false`",
      "--script - run this relay script instead of directly running the target purs output module",
      "--require/-r - preload script/module (like node's --require) before running the target",
      "",
      "To pass options upstream options to `node` or `node-dev` put them after `---`.",
      "In case of `node-dev` it will override preset defaults.",
      "",
    ]
      .map((s) => s.replace("\t", "  "))
      .join("\n")
  )
}

const output = args.output || "output"
const [moduleName, mFn] = args._[0].split(":")
const fn = mFn || args.fn || "main"
const appArgs = args._.slice(1).join(" ")

const debug = (...params) => {
  if (args.debug) {
    console.log(...params)
  }
}

debug("Location:", __dirname)
debug("Args:", args)

if (!moduleName) {
  exitWithMsg('You need to provide main purescript module like "App.Main"')
}

const dir = process.cwd()

const nodeWithPreload = () => {
  const preloadScripts = [].concat(args.require || [])
  const preload = preloadScripts.map((r) => "-r " + r).join(" ")
  return "node" + (preload ? " " + preload : "")
}

const nodeDevBin = () => {
  try {
    const resolved = require.resolve("node-dev")
    const bin = path.join(resolved, "../..", "bin/node-dev")
    if (fs.existsSync(bin)) {
      return nodeWithPreload() + " " + bin
    } else {
      exitWithMsg("Could not locate " + bin)
    }
  } catch (e) {
    exitWithMsg(
      "Could not resolve node-dev, please install it (e.g., npm i node-dev)."
    )
  }
}

const nodeDevArgs = () => {
  return upstreamArgs.length
    ? upstreamArgs.join(" ")
    : [
        !upstreamArgs.includes("--content") ? "--content=" + output : "",
        "--notify=false",
        "--respawn",
        args.poll ? "--poll" : "",
        args.interval ? "--interval=" + args.interval : "",
        args.debounce ? "--debounce=" + args.debounce : "",
        args.cls ? "--clear" : "",
        args.deps ? "--deps -1" : "",
      ]
        .filter((_) => _)
        .join(" ")
}

const mainPath = path.join(dir, output, moduleName, "index.js")

if (!fs.existsSync(mainPath)) {
  exitWithMsg(["Main module", mainPath, "not found."].join(" "))
}

const mainPathNormalized = mainPath.replace(/\\/g, "/")

const script = args.script ? args.script + " " : ""

const entryPath = script + path.join(__dirname, "run.js")
const runArgs = [mainPathNormalized, fn, appArgs].join(" ")

const cmd = args.dev
  ? [nodeDevBin(), nodeDevArgs(), entryPath, runArgs].join(" ")
  : [nodeWithPreload(), ...upstreamArgs, entryPath, runArgs].join(" ")

debug("Running:", cmd)

ch.execSync(cmd, { stdio: "inherit" })
