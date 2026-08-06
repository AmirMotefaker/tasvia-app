import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const trackedFiles = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);

const excludedFiles = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lock",
  "bun.lockb",
]);

const textExtensions = new Set([
  ".cjs",
  ".conf",
  ".ini",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mjs",
  ".prisma",
  ".sql",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const patterns = [
  {
    name: "credential-bearing database URL",
    regex: /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^/\s:@]+:[^@\s/]+@/i,
  },
  {
    name: "private key",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  },
  {
    name: "GitHub token",
    regex: /gh[pousr]_[A-Za-z0-9_]{20,}/,
  },
  {
    name: "AWS access key",
    regex: /AKIA[0-9A-Z]{16}/,
  },
  {
    name: "OpenAI-style key",
    regex: /sk-[A-Za-z0-9_-]{20,}/,
  },
  {
    name: "Stripe live key",
    regex: /(?:sk|rk)_live_[A-Za-z0-9]{16,}/,
  },
];

const placeholderPattern =
  /(YOUR_DATABASE_PASSWORD|PROJECT_REF|CI_ONLY_PLACEHOLDER|example|placeholder|changeme)/i;

const findings = [];

for (const file of trackedFiles) {
  if (excludedFiles.has(file)) {
    continue;
  }

  const lower = file.toLowerCase();
  const dotIndex = lower.lastIndexOf(".");
  const extension = dotIndex >= 0 ? lower.slice(dotIndex) : "";

  if (
    !textExtensions.has(extension) &&
    !lower.endsWith(".env.example") &&
    !lower.endsWith(".env.sample")
  ) {
    continue;
  }

  let content;

  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  const lines = content.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (placeholderPattern.test(line)) {
      continue;
    }

    for (const pattern of patterns) {
      if (pattern.regex.test(line)) {
        findings.push({
          file,
          line: index + 1,
          pattern: pattern.name,
        });
      }
    }
  }
}

if (findings.length > 0) {
  console.error("Potential secrets found. Values are not displayed.");

  for (const finding of findings) {
    console.error(
      `${finding.file}:${finding.line} | ${finding.pattern}`,
    );
  }

  process.exit(1);
}

console.log(
  `SECRET_SCAN_PASS | tracked_files=${trackedFiles.length}`,
);
