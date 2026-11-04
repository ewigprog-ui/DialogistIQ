// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * License policy evaluation (PROJECT_BIBLE.md §13).
 * Pure functions, no I/O — covered by license-policy.test.mjs.
 */

/** Legacy / deprecated identifiers found in package metadata → SPDX ids. */
const ALIASES = {
  "GPL-3.0": "GPL-3.0-only",
  "GPL-3.0+": "GPL-3.0-or-later",
  "GPL-2.0": "GPL-2.0-only",
  "GPL-2.0+": "GPL-2.0-or-later",
  "LGPL-2.1": "LGPL-2.1-only",
  "LGPL-2.1+": "LGPL-2.1-or-later",
  "LGPL-3.0": "LGPL-3.0-only",
  "LGPL-3.0+": "LGPL-3.0-or-later",
  "AGPL-3.0": "AGPL-3.0-only",
  "Apache 2.0": "Apache-2.0",
  "BSD": "BSD-3-Clause",
};

/** Splits an SPDX expression into tokens; legacy "A/B" is treated as "A OR B". */
export function tokenize(expression) {
  return expression
    .replace(/\s*\/\s*/g, " OR ")
    .replace(/([()])/g, " $1 ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => ALIASES[t] ?? t);
}

/** Recursive-descent parser: or := and ("OR" and)* ; and := with ("AND" with)* ; with := atom ("WITH" id)? */
export function parse(expression) {
  const tokens = tokenize(expression);
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseOr() {
    const nodes = [parseAnd()];
    while (peek() === "OR") {
      next();
      nodes.push(parseAnd());
    }
    return nodes.length === 1 ? nodes[0] : { op: "OR", nodes };
  }
  function parseAnd() {
    const nodes = [parseWith()];
    while (peek() === "AND") {
      next();
      nodes.push(parseWith());
    }
    return nodes.length === 1 ? nodes[0] : { op: "AND", nodes };
  }
  function parseWith() {
    const atom = parseAtom();
    if (peek() === "WITH") {
      next();
      const exception = next();
      if (!exception) throw new Error(`Missing exception after WITH in "${expression}"`);
      return { op: "WITH", license: atom, exception };
    }
    return atom;
  }
  function parseAtom() {
    const token = next();
    if (token === undefined) throw new Error(`Unexpected end of "${expression}"`);
    if (token === "(") {
      const inner = parseOr();
      if (next() !== ")") throw new Error(`Missing ")" in "${expression}"`);
      return inner;
    }
    if (["AND", "OR", "WITH", ")"].includes(token)) throw new Error(`Unexpected "${token}" in "${expression}"`);
    return { id: token };
  }

  const tree = parseOr();
  if (pos !== tokens.length) throw new Error(`Unexpected "${tokens[pos]}" in "${expression}"`);
  return tree;
}

/**
 * @returns {{ ok: boolean, reason?: string }}
 */
export function evaluate(expression, policy) {
  if (!expression || /^(unknown|none|see license in .*)$/i.test(expression.trim())) {
    return { ok: false, reason: "no SPDX licence declared" };
  }
  let tree;
  try {
    tree = parse(expression);
  } catch (error) {
    return { ok: false, reason: `unparsable licence expression: ${error.message}` };
  }
  return check(tree, policy);
}

function check(node, policy) {
  if (node.id) {
    if (policy.allowed.includes(node.id)) return { ok: true };
    if (policy.requiresAdr?.includes(node.id)) return { ok: false, reason: `${node.id} requires an ADR decision (§13.2)` };
    const why = policy.knownForbidden?.[node.id];
    return { ok: false, reason: why ? `${node.id} is forbidden: ${why}` : `${node.id} is not on the allow list` };
  }
  if (node.op === "WITH") {
    const base = check(node.license, policy);
    if (!base.ok) return base;
    return policy.allowedExceptions?.includes(node.exception)
      ? { ok: true }
      : { ok: false, reason: `exception ${node.exception} is not on the allow list` };
  }
  const results = node.nodes.map((n) => check(n, policy));
  if (node.op === "OR") {
    return results.some((r) => r.ok) ? { ok: true } : { ok: false, reason: results.map((r) => r.reason).join("; ") };
  }
  const failed = results.find((r) => !r.ok);
  return failed ?? { ok: true };
}

/**
 * @param {{ecosystem: string, name: string, version: string, license: string}[]} packages
 * @returns violations with reasons; packages listed in policy.exceptions are skipped.
 */
export function findViolations(packages, policy) {
  const excepted = new Set((policy.exceptions ?? []).map((e) => `${e.ecosystem}:${e.package}`));
  return packages
    .filter((p) => !excepted.has(`${p.ecosystem}:${p.name}`))
    .map((p) => ({ ...p, ...evaluate(p.license, policy) }))
    .filter((r) => !r.ok);
}
