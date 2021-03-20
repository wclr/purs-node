#!/usr/bin/env node

process.argv.splice(2, 0, "--dev")

require("./index.js")
