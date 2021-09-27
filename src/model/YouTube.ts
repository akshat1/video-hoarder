import "reflect-metadata";
import _ from "lodash";
import { Field, Float, Int, ObjectType } from "type-graphql";

const Primitives = [
  "undefined",
  "string",
  "number",
  "boolean",
];
/**
 * Recursively converts c/python style underscored fields to camel-case.
 */
const camelize = (input: Record<string, any>, seen: Set<any> = new Set<any>()): Record<string, any> => {
  // Guard against circular references.
  if (seen.has(input)) {
    return input;
  }

  // typeof null is "object", but null is a singleton.
  if (input === null) {
    return null;
  }

  if (Primitives.indexOf(typeof input) !== -1) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(x => camelize(x));
  }

  const result = {};
  for (const key in input) {
    result[_.camelCase(key)] = camelize(input[key]);
  }

  return result;
}

@ObjectType()
export class YTDownloaderOptions {
  @Field(() => Int)
  httpChunkSize: number;
}

@ObjectType()
export class YTHTTPHeaders {
  @Field(() => String)
  userAgent: string;

  @Field(() => String)
  acceptCharset: string;

  @Field(() => String)
  accept: string;

  @Field(() => String)
  acceptEncoding: string;

  @Field(() => String)
  acceptLanguage: string;
}

@ObjectType()
export class YTFormat {
  @Field(() => String)
  asr?: string;

  @Field(() => String, { nullable: true })
  filesize?: string;

  @Field(() => String)
  formatId: string;

  @Field(() => String)
  formatNote?: string;

  @Field(() => Float, { nullable: true })
  fps?: number;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => Int)
  quality?: number;

  @Field(() => Float)
  tbr?: number;

  @Field(() => String)
  url?: string;

  @Field(() => Int, { nullable: true })
  width?: string;

  @Field(() => String)
  ext?: string;

  @Field(() => String)
  vcodec?: string;

  @Field(() => String)
  acodec?: string;

  @Field(() => String)
  abr?: string;

  @Field(() => YTDownloaderOptions)
  downloaderOptions?: YTDownloaderOptions

  @Field(() => String)
  container?: string;

  @Field(() => String)
  format: string;

  @Field(() => String)
  protocol?: string;

  @Field(() => YTHTTPHeaders)
  httpHeaders?: string;

  static BestAudio: YTFormat = {
    format: "Best Audio (Only)",
    formatId: "BESTAUDIO",
  };

  static BestVideo: YTFormat = {
    format: "Best Video (Only)",
    formatId: "BESTVIDEO",
  };

  static BestBestMerged: YTFormat = {
    format: "Best Video + Best Audio (Merged)",
    formatId: "BESTBESTMERGED",
  };

  static BestBestSeparate: YTFormat = {
    format: "Best Video, Best Audio (Separate)",
    formatId: "BESTBESTSEPERATE",
  };
}

@ObjectType()
export class YTThumbnail {
  @Field(() => Int)
  height: number;

  @Field(() => String)
  url: string;

  @Field(() => Int)
  width: number;

  @Field(() => String)
  resolution: string;

  @Field(() => String)
  id: string;

  static getNumericResolution = (thumb:YTThumbnail): number => thumb.height * thumb.width;
  static sortByResolution = (thumbs:YTThumbnail[]): YTThumbnail[] => _.sortBy(thumbs, YTThumbnail.getNumericResolution);
}

@ObjectType()
export class YTCaptions {
  @Field(() => String)
  ext: string;

  @Field(() => String)
  url: string;
}

@ObjectType()
export class YTCaptionsMap {
  @Field(() => [YTCaptions], { nullable: true })
  af?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  sq?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  am?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ar?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  hy?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  az?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  bn?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  eu?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  be?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  bs?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  bg?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  my?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ca?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ceb?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  zhHans?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  zhHant?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  co?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  hr?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  cs?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  da?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  nl?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  en?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  eo?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  et?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  fil?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  fi?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  fr?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  gl?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ka?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  de?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  el?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  gu?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ht?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ha?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  haw?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  iw?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  hi?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  hmn?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  hu?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  is?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ig?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  id?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ga?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  it?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ja?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  jv?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  kn?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  kk?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  km?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  rw?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ko?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ku?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ky?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  lo?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  la?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  lv?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  lt?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  lb?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  mk?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  mg?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ms?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ml?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  mt?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  mi?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  mr?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  mn?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ne?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  no?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ny?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  or?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ps?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  fa?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  pl?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  pt?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  pa?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ro?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ru?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  sm?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  gd?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  sr?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  sn?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  sd?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  si?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  sk?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  sl?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  so?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  st?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  es?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  su?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  sw?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  sv?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  tg?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ta?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  tt?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  te?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  th?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  tr?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  tk?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  uk?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ur?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  ug?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  uz?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  vi?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  cy?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  fy?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  xh?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  yi?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  yo?: YTCaptions[];
  @Field(() => [YTCaptions], { nullable: true })
  zu?: YTCaptions[];
}

@ObjectType()
export class YTMetadata {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => [YTFormat])
  formats: YTFormat[];

  @Field(() => [YTThumbnail])
  thumbnails: YTThumbnail[];

  @Field(() => String)
  description: string;

  @Field(() => String)
  uploadDate: string;

  @Field(() => String)
  uploader: string;

  @Field(() => String)
  uploaderId: string;

  @Field(() => String)
  uploaderUrl: string;

  @Field(() => String)
  channelId: string;

  @Field(() => String)
  channelUrl: string;

  @Field(() => Int)
  duration: number;

  @Field(() => Int)
  viewCount: number;

  @Field(() => Float)
  averageRating: number;

  @Field(() => Int)
  ageLimit: number;

  @Field(() => String)
  webpageUrl: string;

  @Field(() => [String])
  categories: string[]

  @Field(() => [String])
  tags: string[]

  @Field(() => Boolean, { nullable: true })
  isLive?: boolean;

  @Field(() => YTCaptionsMap, { nullable: true })
  automaticCaptions?: YTCaptionsMap;

  @Field(() => Int)
  likeCount: number;

  @Field(() => Int)
  dislikeCount: number;

  @Field(() => String)
  channel: string;

  @Field(() => String, { nullable: true })
  track?: string;

  @Field(() => String, { nullable: true })
  artist?: string;

  @Field(() => String, { nullable: true })
  album?: string;

  @Field(() => String, { nullable: true })
  creator?: string;

  @Field(() => String, { nullable: true })
  altTitle?: string;

  @Field(() => String)
  extractor: string;

  @Field(() => String)
  webpageUrlBasename: string;

  @Field(() => String)
  extractorKey: string;

  @Field(() => String, { nullable: true })
  playlist?: string;

  @Field(() => Int, { nullable: true })
  playlistIndex?: number;

  @Field(() => String)
  thumbnail: string;

  @Field(() => String)
  displayId: string;

  @Field(() => [String], { nullable: true })
  requestedSubtitles?: string[];

  @Field(() => [YTFormat], { nullable: true })
  requestedFormats?: YTFormat[];

  @Field(() => String)
  format: string;

  @Field(() => String)
  formatId: string;

  @Field(() => Int)
  width: number;

  @Field(() => Int)
  height: number;

  @Field(() => String, { nullable: true })
  resolution?: string;

  @Field(() => Float, { nullable: true })
  fps?: number;

  @Field(() => String, { nullable: true })
  vcodec?: string;

  @Field(() => Float, { nullable: true })
  vbr?: number;

  @Field(() => Float, { nullable: true })
  stretchedRatio?: number;

  @Field(() => String, { nullable: true })
  acodec?: string;

  @Field(() => Float, { nullable: true })
  abr?: number;

  @Field(() => String)
  ext: string;

  @Field(() => String)
  fulltitle: string;

  @Field(() => String)
  filename: string;

  static fromJSON(blob: Record<string, any>): YTMetadata {
    return camelize(blob) as YTMetadata;
  }

  static hasVideo(metadata: YTMetadata): boolean {
    return !!metadata.formats?.find(f => f.vcodec !== "none")
  }

  static hasAudio(metadata: YTMetadata): boolean {
    return !!metadata.formats?.find(f => f.acodec !== "none")
  }

  static getFormatsForUI(metadata: YTMetadata): YTFormat[] {
    const formats = [];
    const hasVideo = YTMetadata.hasVideo(metadata);
    const hasAudio = YTMetadata.hasAudio(metadata);
    if (hasAudio && hasVideo) {
      formats.push(YTFormat.BestBestMerged);
      formats.push(YTFormat.BestBestSeparate);
    }

    if (hasVideo) {
      formats.push(YTFormat.BestVideo);
    }

    if (hasAudio) {
      formats.push(YTFormat.BestAudio);
    }
    
    formats.push(..._.reverse(_.sortBy(metadata.formats, "quality")));
    return formats;
  }
}
