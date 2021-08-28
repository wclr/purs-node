# purs-node

> Runs purescript output without hassle.

*NB! This tool doesn't compile your purs sources. It is just a simple wrapper around node/[`node-dev`](https://github.com/fgnass/node-dev) to run compiled output in dev mode. It works like [spago run](https://github.com/purescript/spago) but without compilation.*

## install

```
npm install purs-node [-g]
```

Run compiled `App.Main` module:

```
purs-node [options] App.Main [args] --- [node args]
```

Options:

- `--output` - output dir, default is `output`
- `--fn` - function to run, default is `main`

## dev/watch mode

You need to install additionally:

```
npm install node-dev [-g]
```

Then run with watching for changes of required files:

```
purs-node-dev [options] App.Main [args] --- [node-dev args]
```

Dev options:

- `--cls` - clear screen on restart, default `false`
- `--deps` - watch `node_modules` dependencies, default `false`
- `--poll` - for fs polling, when normal fs watching doesn't work, default `false`
- `--interval` - interval for polling in milliseconds (default: 1000)
- `--script` - run this relay script instead of directly running the target purs output module. Absolute path to script running purs output will be passed as the first argument to the relay script, the rest arguments will follow.

## upstream

If you want to pass options upstream to `node` or [`node-dev`](https://github.com/fgnass/node-dev) put them after `---`. In case of `node-dev` it will override preset defaults.


## licence

MEAT.