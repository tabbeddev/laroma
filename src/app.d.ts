// deno-lint-ignore-file no-explicit-any
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
  interface Array<T> {
    equals: (array: any[]) => boolean;
    toShuffled: () => this;
    randomItem: () => this[0];
  }
}

export {};
