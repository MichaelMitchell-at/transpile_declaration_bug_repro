# Reproduction steps

## Setup

```sh
npm install
```

## Control

First run

```sh
node ./node_modules/.bin/tsc -b
```

Observe that `declarations/b.d.ts` contains

```ts
import { Foo } from "../projA";
export type Bar = {
  [Foo.A]: 1;
  [Foo.B]: 2;
};
```

## Test

Now run

```sh
node ./transpile.mjs tsconfig.json declarations
```

Observe that `declarations/b.d.ts` contains

```ts
export type Bar = {};
```
