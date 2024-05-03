import {Foo} from './a';

export type Bar = {
  [Foo.A]: 1;
  [Foo.B]: 2;
}
