import { toKebabCase } from "@std/text";
import type { StudySet } from "../lib/studysets.ts";

export function save(editingSet: StudySet | undefined) {
  if (!editingSet) return;
  const content = JSON.stringify(editingSet);
  const element = document.createElement("a");

  element.href = "data:text/json," + encodeURI(content);
  element.target = "_blank";
  element.download = toKebabCase(editingSet.name) + ".json";
  element.click();
}
