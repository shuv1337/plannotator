import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { getDataDirForRead, getDataDirForWrite } from "@plannotator/shared/data-dir";

export type SubmissionMode = "plan" | "review" | "annotate" | "goal-setup";

export interface PlannotatorSubmission {
  id: string;
  createdAt: string;
  mode: SubmissionMode;
  origin: string;
  cwd: string;
  project?: string;
  label?: string;
  decision?: string;
  feedback?: string;
  savedPath?: string;
  payload?: unknown;
}

function getSubmissionsDir(): string {
  return getDataDirForWrite("submissions");
}

function getSubmissionsReadDir(): string {
  return getDataDirForRead("submissions");
}

function latestPath(mode: "read" | "write" = "read"): string {
  return join(mode === "write" ? getSubmissionsDir() : getSubmissionsReadDir(), "latest.json");
}

function safeSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "submission";
}

function submissionPath(submission: PlannotatorSubmission): string {
  const stamp = submission.createdAt.replace(/[:.]/g, "-");
  return join(
    getSubmissionsDir(),
    `${stamp}-${safeSegment(submission.mode)}-${safeSegment(submission.project || submission.label || submission.id)}.json`,
  );
}

export function recordSubmission(
  input: Omit<PlannotatorSubmission, "id" | "createdAt" | "cwd"> & {
    cwd?: string;
    createdAt?: string;
  },
): PlannotatorSubmission {
  const submission: PlannotatorSubmission = {
    id: crypto.randomUUID(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    cwd: input.cwd ?? process.cwd(),
    mode: input.mode,
    origin: input.origin,
    project: input.project,
    label: input.label,
    decision: input.decision,
    feedback: input.feedback,
    savedPath: input.savedPath,
    payload: input.payload,
  };
  const json = JSON.stringify(submission, null, 2) + "\n";
  writeFileSync(submissionPath(submission), json);
  writeFileSync(latestPath("write"), json);
  return submission;
}

function readSubmission(path: string): PlannotatorSubmission | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as PlannotatorSubmission;
  } catch {
    return null;
  }
}

export function listSubmissions(limit = 10): PlannotatorSubmission[] {
  const submissionsDir = getSubmissionsReadDir();
  if (!existsSync(submissionsDir)) return [];
  return readdirSync(submissionsDir)
    .filter((name) => name.endsWith(".json") && name !== "latest.json")
    .sort()
    .reverse()
    .slice(0, limit)
    .map((name) => readSubmission(join(submissionsDir, name)))
    .filter((submission): submission is PlannotatorSubmission => submission !== null);
}

export function getLatestSubmission(): PlannotatorSubmission | null {
  const path = latestPath("read");
  if (existsSync(path)) return readSubmission(path);
  return listSubmissions(1)[0] ?? null;
}

export function formatSubmissionForCli(submission: PlannotatorSubmission): string {
  const lines = [
    `shuvplan submission: ${submission.mode} ${submission.decision || ""}`.trim(),
    `createdAt: ${submission.createdAt}`,
    `origin: ${submission.origin}`,
    `cwd: ${submission.cwd}`,
  ];
  if (submission.project) lines.push(`project: ${submission.project}`);
  if (submission.label) lines.push(`label: ${submission.label}`);
  if (submission.savedPath) lines.push(`savedPath: ${submission.savedPath}`);
  if (submission.feedback) {
    lines.push("", submission.feedback);
  } else if (submission.payload !== undefined) {
    lines.push("", JSON.stringify(submission.payload, null, 2));
  }
  return lines.join("\n");
}

export function formatSubmissionList(submissions: PlannotatorSubmission[]): string {
  if (submissions.length === 0) return "No shuvplan submissions found.";
  return submissions
    .map((submission, index) => {
      const firstFeedbackLine = submission.feedback?.split(/\r?\n/).find(Boolean);
      const summary = firstFeedbackLine ? ` - ${firstFeedbackLine.slice(0, 90)}` : "";
      return `${index + 1}. ${submission.createdAt} ${submission.mode} ${submission.decision || ""} ${submission.project || submission.label || ""}${summary}`.trim();
    })
    .join("\n");
}
