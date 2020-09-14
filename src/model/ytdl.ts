export interface YTDLInformation {
  binaryPath: string,
  binaryVersion: string,
  globalConfig: string,
}

export const DummyYTDLInfo = {
  binaryPath: "-",
  binaryVersion: "-",
  globalConfig: "",
};

export const isDummyInfo = (info: YTDLInformation): boolean => info === DummyYTDLInfo;
