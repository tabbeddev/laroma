interface SRSVocab {
  step: number;
  stamp: number;
}
type SRSSet = Record<string, SRSVocab>;
type SRSData = Record<string, SRSSet>;

function calcStepSeconds(step: number): number {
  const startInterval = 24 * 60 * 60 * 1000;
  const d = new Date(Date.now() + startInterval * Math.pow(2, step - 1));
  d.setHours(0, 0, 0);
  return d.getTime();
}

export class SRS {
  data: SRSData = {};

  constructor(dt?: SRSData) {
    if (dt) {
      this.data = dt;
    }
  }

  saveSRS(): void {
    console.log("Saving SRS...");
    localStorage.setItem("vocabSRS", JSON.stringify(this.data));
  }

  initVocab(setName: string, vocab: string): void {
    if (!(setName in this.data)) this.data[setName] = {};

    if (vocab in this.data[setName]) return;
    const d = new Date();
    d.setHours(0, 0, 0);
    this.data[setName][vocab] = { step: 0, stamp: d.getTime() };
  }

  resetVocab = this.initVocab;

  progressVocab(setName: string, vocab: string): void {
    this.data[setName][vocab].step++;
    this.data[setName][vocab].stamp = calcStepSeconds(
      this.data[setName][vocab].step,
    );
    this.saveSRS();
  }

  findNextStudyTime(): [number, string] {
    let next: number = Infinity;
		let setname: string = "";
    for (const [name, set] of Object.entries(this.data)) {
      for (const vocab of Object.values(set)) {
        if (vocab.stamp < next) {
          next = vocab.stamp;
					setname = name;
        }
      }
    }
    return [next, setname];
  }

  getDueVocabs(setName: string): string[] {
    const now = Date.now();
    // @ts-ignore (should work, cause of the filter)
    return Object.entries(this.data[setName]).map(([k, v]) =>
      v.stamp < now && k
    ).filter(Boolean);
  }
}

export function getSRS(): SRS {
  const storage = localStorage.getItem("vocabSRS");
  if (storage) {
    return new SRS(JSON.parse(storage));
  } else {
    return new SRS();
  }
}
