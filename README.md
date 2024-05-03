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
import { type Type } from "./a";

export const foo = (_: Type): void => {};
export const bar = (_: import("./a").Type): void => {};
```

## Test

Now run

```sh
node ./transpile.mjs tsconfig.json declarations
```

Observe that `declarations/b.d.ts` contains

```ts
export declare const foo: (_: Type) => void;
export declare const bar: (_: any) => void;
```
