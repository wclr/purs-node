# purs-node

> Runs purescript output without hassle.

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
- `--node-dev`, - if you want to override our *beautiful and smart defaults* with [node-dev's native options](https://github.com/fgnass/node-dev#command-line-options), for example: `--node-dev '--clear,--respawn'`



## licence

I LOVE MEAT.