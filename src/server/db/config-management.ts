/**
 * This file is in the db directory, but there's nothing kept in the "database". It's all text files and directories.
 * See the relevant dev-note file.
 */
import { getLogger } from "../../logger";
import { ConfigurationPreset } from "../../model/ConfigurationPreset";
import fs from "fs/promises";
import path from "path";
import md5 from "blueimp-md5";
import PQueue from "p-queue";

const rootLogger = getLogger("db/config-management");
const DefaultFileName = "default";
const CommonDirectoryName = "common";

const getRootConfigDirectoryPath = ():string => path.join(process.cwd(), "config");

const getPresetName = (userName: string, filePath) => {
  const fileName = path.basename(filePath);
  const withoutExtension = fileName.substr(0, fileName.length - path.extname(fileName).length);
  if (userName)
    return `(${userName} ${withoutExtension})`;
  return withoutExtension;
};

interface MakeConfigPresetArgs {
  tool: string
  /** A missing userName indicates this is the common config. */
  userName?: string
  filePath: string
  configurationValue: string
};

const makeConfigPreset = ({ tool, userName, filePath, configurationValue }: MakeConfigPresetArgs ):ConfigurationPreset => ({
  tool,
  id: md5(filePath),
  name: getPresetName(userName, filePath),
  configurationValue,
});

/**
 * This function does not check whether the given file is a common file or overridden file. The caller must try the
 * user specific file first, and failing that, try the common file.
 * 
 * It's this way because fs.exists is now deprecated and while we _can_ call existsSync in a promise and check the
 * existence of an overridden file first and failing that use the common file as a fallback, that logic will probably be better
 * placed in the caller.
 */
const getConfigFilePath = (args: {tool: string, userName: string, configName: string}): string => {
  const {
    tool,
    userName,
    configName = DefaultFileName
  } = args;

  // For now, let's just assume everything is a .conf.
  const configFileName = `${configName}.conf`;
  return path.join(getRootConfigDirectoryPath(), userName, tool, configFileName);
};

/**
 * Get the default configuration for the given tool and user.
 * If the file does not exist in the user directory, then we will look in the common directory.
 */
export const getDefaultConfig = async (args:{ tool: string, userName: string}): Promise<ConfigurationPreset> => {
  const logger = getLogger("getDefaultConfig", rootLogger);
  logger.debug(args);
  let configurationValue;
  try {
    const filePath = getConfigFilePath({
      ...args,
      configName: DefaultFileName,
    });
    configurationValue = await fs.readFile(filePath, "utf-8");
    logger.debug("Got user specific config");
    return makeConfigPreset({
      tool: args.tool,
      userName: args.userName,
      configurationValue,
      filePath,
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      logger.debug("User has not overridden this file. Let's try in common directory.");
      const filePath = getConfigFilePath({
        ...args,
        userName: CommonDirectoryName,
        configName: DefaultFileName,
      });
      configurationValue = await fs.readFile(filePath, "utf-8");
      logger.debug("Got common config");
      return makeConfigPreset({
        tool: args.tool,
        configurationValue,
        filePath,
      });
    }
  }
};

/**
 * Get configuration presets for the given tool and user.
 */
export const getPresets = async (args: { tool: string, userName: string}): Promise<ConfigurationPreset[]> => {
  const logger = getLogger("getConfigPresets", rootLogger);
  logger.debug(args);
  const {
    tool,
    userName,
  } = args;
  const filePaths:string[] = [];
  const queue = new PQueue({ concurrency: 4 });
  const presets:ConfigurationPreset[] = [];
  
  try {
    logger.debug("gather common presets");
    const directoryPath = path.join(getRootConfigDirectoryPath(), CommonDirectoryName, tool);
    const fileNames = await fs.readdir(directoryPath);
    logger.debug(`${fileNames.length} in ${directoryPath}`);
    await queue.addAll(fileNames.map(fileName =>
      async () => {
        const filePath = path.join(directoryPath, fileName);
        logger.debug(`Reading ${filePath}`);
        const configurationValue = await fs.readFile(filePath, "utf-8");
        presets.push(makeConfigPreset({
          tool: args.tool,
          configurationValue,
          filePath,
        }));
      }
    ));
  } catch (error) {
    logger.error(error);
  }

  try {
    logger.debug("gather any overrides or user-specific presets.");
    const directoryPath = path.join(getRootConfigDirectoryPath(), userName, tool);
    const fileNames = await fs.readdir(directoryPath);
    logger.debug(`${fileNames.length} in ${directoryPath}`);
    await queue.addAll(fileNames.map(fileName =>
      async () => {
        const filePath = path.join(directoryPath, fileName);
        const configurationValue = await fs.readFile(filePath, "utf-8");
        presets.push(makeConfigPreset({
          tool: args.tool,
          userName: args.userName,
          configurationValue,
          filePath,
        }));
      }
    ));
  } catch (error) {
    logger.error(error);
  }

  return presets;
};
