import { User } from "../model/User";
import { YTMetadata } from "../model/YouTube";
import { getLogger } from "./logger";
import { promises as fs } from "fs";
import yaml from "js-yaml";
import path from "path";

interface DownloadLocationRuleMatch {
  /**
   * - Optional.
   * - Obtained from the video URL.
   * - May be a regexp (e.g. /.+/, or, /^TechnologyConne(ction|xtra)s$/ )
   */
  hostname?: string;
  
  /**
   * - Optional.
   * - Obtained from video metadata.
   * - May be a regexp 
   */
  channel?: string;

  /**
   * - Optional.
   * - Obtained from video metadata.
   * - May be a regexp 
   */
  uploader?: string;

  /**
   * - Optional.
   * - Obtained from video metadata.
   * - May be a regexp 
   */
  title?: string;

  /**
   * - Optional.
   * - Obtained from video metadata.
   * - May be a regexp 
   */
  fulltitle?: string;

  /**
   * - Optional.
   * - Obtained from video metadata.
   * - May be a regexp 
   */
  extractor?: string;
}

interface DownloadLocationRule {
  /** Name of the rule. This is required because it's useful for troubleshooting purposes. */
  name: string;
  /** The match object. */
  match: DownloadLocationRuleMatch;
  /** Target download location. */
  location: string;
}

interface CustomDownloadLocationConfig {
  rules: DownloadLocationRule[];
}

const validateRule = (rule: DownloadLocationRule): boolean => {
  const hasMatch = (typeof rule.match !== "undefined") && Object.keys(rule.match).length > 0;
  const hasLocation = typeof rule.location === "string";
  const hasName = typeof rule.name === "string";
  if (!hasName) {
    throw new Error("Rule is missing a name");
  }

  if (!hasLocation) {
    throw new Error(`Rule ${rule.name} is missing the property "location".`);
  }

  if (!hasMatch) {
    throw new Error(`Rule ${rule.name} should have a valid (non-empty) match property.`);
  }

  return true;
}

const RegExpPattern = /^\/([^/]+)\/$/;
const matchValues = (reference: string, value: string): boolean => {
  const matches = reference.match(RegExpPattern);
  if (matches) {
    // reference is a regexp
    const referencePattern = new RegExp(matches[1]);
    return referencePattern.test(value);
  }

  return reference === value;
};

const isMatchingRule = (rule: DownloadLocationRule, user: User, metadata: YTMetadata): boolean => {
  const {
    match,
  } = rule;

  const {
    channel,
    extractor,
    fulltitle,
    webpageUrl,
    title,
    uploader,
  } = metadata;

  if (match.channel) {
    if (!matchValues(match.channel, channel)) {
      return false;
    }
  }

  if (match.extractor) {
    if (!matchValues(match.extractor, extractor)) {
      return false;
    }
  }

  if (match.fulltitle) {
    if (!matchValues(match.fulltitle, fulltitle)) {
      return false;
    }
  }

  if (match.hostname) {
    if (!matchValues(match.hostname, new URL(webpageUrl).hostname)) {
      return false;
    }
  }

  if (match.title) {
    if (!matchValues(match.title, title)) {
      return false;
    }
  }

  if (match.uploader) {
    if (!matchValues(match.uploader, uploader)) {
      return false;
    }
  }

  // No mismatches mean a match
  // Which further means that an empty match object would match everything
  // which is why we throw an error if a match object is missing or empty.
  return true;
}

const getCustomDownloadLocation = (rules: DownloadLocationRule[], user: User, metadata: YTMetadata): string|null => {
  const matchingRules = rules.filter(rule => isMatchingRule(rule, user, metadata));
  // Problem: Multiple rules may match a given job. We must find the one with the highest specificity.
  // Solution:
  //   - All the conditions in the match block must be satisfied in order to
  //     be considered a match
  //   - Therefore, we simply need to find the rule with the greatest number
  //     of conditions in order to find the most specific (and thus the best)
  //     rule.
  //   - If we have multiple matching rules with the same specificity then we
  //     use the one which appears first in the config.
  matchingRules.sort((r1, r2) => {
    return Object.keys(r2.match).length - Object.keys(r1.match).length;
  });
  const bestRule = matchingRules[0];
  return bestRule ? bestRule.location : null;
};

const downloadRoot = "/workspace/downloads";
export const getDownloadLocation = async (metadata: YTMetadata, user: User): Promise<string> => {
  const logger = getLogger("getDownloadLocation");
  const pathElements = [
    downloadRoot,
    user.userName,
  ];

  let rules = [];
  try {
    const customLocationModulePath = path.join(process.cwd(), "config", "location.yml");
    const buffLocationRules = await fs.readFile(customLocationModulePath);
    const config = yaml.load(buffLocationRules.toString("utf-8")) as CustomDownloadLocationConfig;
    rules = config.rules;
  } catch (err) {
    logger.error(err);
  }
  rules.forEach(validateRule);
  const customLocation = getCustomDownloadLocation(rules, user, metadata);
  if (customLocation) {
    pathElements.push(customLocation);
  }

  // Ensure the target directory exists.
  const directoryPath = path.join(...pathElements);
  await fs.mkdir(directoryPath, { recursive: true });

  // Return the full download path which can be passed to ytdl.
  pathElements.push("%(title)s.%(ext)s");
  return path.join(...pathElements);
};
