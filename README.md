# purs-node

> Runs purescript output without hassle.

*NB! This tool doesn't compile your purs sources. It just a simple wrapper around node/[`node-dev`](https://github.com/fgnass/node-dev) to run compiled output in dev mode.*

## install

```
npm install purs-node (-g)
```

Run compiled `App.Main` module:

```
purs-node App.Main
```

Options:

- `--output` - output dir, default is `output`
- `--fn` - function to run, default is `main`

## dev mode

You need to Install additionally:

```
npm install node-dev (-g)
```

Then run with watching for changes of required files:

```
purs-node-dev App.Main
```

Dev options:

- `--cls` - clear screen on restart, default `false`
- `--deps` - watch node_modules dependencies, default `true` (use `--no-deps` to turn off)
- `--poll` - for fs polling, when normal fs watching doesn't work, default `false`

## upstream

if you want to pass options upstream to `node` or [`node-dev`](https://github.com/fgnass/node-dev) put them just after `--`.


## licence

I LOVE MEAT.