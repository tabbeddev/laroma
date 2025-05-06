// deno-lint-ignore-file no-explicit-any
// This is accesible on every svelte page and accesible in ts files with: (remove one slash of the comment)
//// <reference path="./commonlib.ts" />
//
Array.prototype.equals = function (array: any[]): boolean {
  if (array === this) {
    return true;
  }
  if (this.length != array.length) {
    return false;
  }

  for (let i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) {
        return false;
      }
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

Array.prototype.toShuffled = function (): any[] {
  return this.map((v) => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);
};

Array.prototype.randomItem = function (): any {
  return this[(Math.random() * this.length) | 0];
};

// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });
Object.defineProperty(Array.prototype, "toShuffled", { enumerable: false });
Object.defineProperty(Array.prototype, "randomItem", { enumerable: false });
