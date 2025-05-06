/// <reference lib="dom" />

import type { StudySet } from "./studysets.ts";
import { decrypt } from "jsr:@mogeko/aes-gcm";

interface URLSettings {
  url: string;
  key: string | null;
}

export type Sets = Record<string, StudySet>;
export type Urls = URLSettings[];

export class SetManager {
  sets: Sets = $state({});
  urls: Urls = [];
  invalid_urls: [URLSettings, "invalid" | "failed" | "notaset"][] = $state([]);

  constructor(urls?: Urls) {
    if (urls) {
      this.urls = urls;
    }
  }

  save(): void {
    localStorage.setItem("urls", JSON.stringify(this.urls));
  }

  _rmInv(url: string) {
    for (const inv of this.invalid_urls) {
      if (inv[0].url === url) {
        this.invalid_urls.splice(this.invalid_urls.indexOf(inv), 1);
        break;
      }
    }
  }

  async load(url: URLSettings): Promise<void> {
    this._rmInv(url.url);

    console.log("Loading: " + url.url);
    try {
      const response = await fetch(url.url);
      if (response.ok) {
        let content: string = await response.text();

        try {
          if (url.key) {
            content = await decrypt(content, url.key);
          }
          const set: StudySet = JSON.parse(content);

          if (!set.name || !set.description || !set.author || !set.version) {
            this.invalid_urls.push([url, "notaset"]);
            return console.warn(
              "Failed to load: " + url.url + " - Invalid Set",
            );
          }

          this.sets[set.name] = set;
          this.sets[set.name].url = url.url;
        } catch {
          this.invalid_urls.push([url, "invalid"]);
          console.warn("Failed to load: " + url.url + " - Invalid JSON!");
        }
      } else {
        this.invalid_urls.push([url, "failed"]);
        console.warn("Failed to download: " + url.url);
      }
    } catch {
      this.invalid_urls.push([url, "failed"]);
    }
  }

  async loadAll(): Promise<void> {
    await Promise.all([this.urls.map((e) => this.load(e))]);
  }

  addUrl(settings: URLSettings) {
    this.urls.push(settings);
    this.save();
    this.load(settings);
  }

  removeUrl(url: string) {
    this._rmInv(url);
    for (const entry of this.urls) {
      if (entry.url === url) this.urls.splice(this.urls.indexOf(entry), 1);
    }
    for (const [key, entry] of Object.entries(this.sets)) {
      if (entry.url === url) delete this.sets[key];
    }
    this.save();
  }
}

export default function getSetManager(): SetManager {
  const storage = localStorage.getItem("urls");
  if (storage) {
    return new SetManager(JSON.parse(storage));
  } else {
    return new SetManager();
  }
}
