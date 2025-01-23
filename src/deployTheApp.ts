import fs from 'fs';
import axios from 'axios';
import { ApkParser, IpaParser } from 'build-info-parser';
import FormData from 'form-data';
import ApiConst from './ApiConst';
import AppConst from './AppConst';
import { getApkName } from './CommonUtils';
import jwt from 'jsonwebtoken';
import { DecodedToken } from './types/CommonTypes';

const FileType = {
  Apk: 'apk',
  Ipa: 'ipa'
};

const FileContentType = {
  Ipa: 'application/octet-stream',
  Apk: 'application/vnd.android.package-archive'
};

/**
 * Extract the build data from the file
 * @param file - The build file
 * @param fileType - The type of the build file
 * @param blobData - The blob data of the build file
 * @returns - The extracted build data
 */
const fileDataExtract = async (file: any, fileType: string, blobData: Blob) => {
  if (fileType === FileType.Ipa && file) {
    // @ts-ignore
    const parser = new IpaParser(file);
    try {
      const applicationData = await parser.parse();
      return {
        ...applicationData,
        name: String(
          applicationData?.CFBundleDisplayName ?? AppConst.appDefaultName
        ),
        package: String(
          applicationData?.CFBundleIdentifier ?? AppConst.appDefaultPackage
        ),
        versionCode: Number(
          applicationData?.CFBundleVersion ?? AppConst.appDefaultVersionCode
        ),
        versionName: String(
          applicationData?.CFBundleShortVersionString ??
            AppConst.appDefaultVersion
        ),
        fileType: FileType.Ipa,
        fileContentType: FileContentType.Ipa,
        appIcon: applicationData?.icon ?? '',
        fileSize: blobData.size
      };
    } catch (error) {
      console.error(error);
    }
  } else if (fileType === FileType.Apk && file) {
    const parser = new ApkParser(file);
    try {
      const applicationData = await parser.parse();
      if (blobData.size) {
        return {
          ...applicationData,
          name:
            getApkName(applicationData?.application?.label) ??
            AppConst.appDefaultName,
          fileType: FileType.Apk,
          fileContentType: FileContentType.Apk,
          appIcon: applicationData?.icon ?? '',
          fileSize: blobData.size
        };
      }
    } catch (error) {
      console.error(`Error parsing APK File: ${error}`);
    }
  } else {
    console.error('Invalid file type');
  }
};

/**
 * Main function to handle the post-build process
 */
const deployApp = async (
  applicationId: string,
  buildPath: string,
  appToken: any,
  baseUrl?: string,
  releaseNotes?: string
) => {
  // Use applicationId and buildPath in your deployment logic
  console.log(`Deploying Application ID: ${applicationId}`);
  console.log(`Using Build Path: ${buildPath}`);

  if (!applicationId) {
    console.error('Application ID is missing');
    process.exit(1);
  }
  if (!buildPath || !fs.existsSync(buildPath)) {
    console.error('Build file not found:', buildPath);
    process.exit(1);
  }
  if (!appToken) {
    console.error('App token is missing');
    process.exit(1);
  }

  const decodedToken = jwt.decode(appToken) as DecodedToken;
  const decodedBaseUrl = decodedToken?.baseUrl;
  const currentUrl = baseUrl || decodedBaseUrl;

  if (!currentUrl) {
    console.error('Base URL is missing');
    process.exit(1);
  }
  const fileType = buildPath?.split('.')?.pop() ?? FileType.Apk;

  const currentFileContentType =
    fileType === FileType.Ipa ? FileContentType.Ipa : FileContentType.Apk;

  const fileBuffer = fs.readFileSync(buildPath);

  const formData = new FormData();

  const blobData = new Blob([fileBuffer], {
    type: currentFileContentType
  });

  if (blobData?.size > AppConst.maximumFileSize * 1024 * 1024) {
    throw new Error(
      `File size exceeds the allowed limit of ${AppConst.maximumFileSize} MB.`
    );
  }

  try {
    console.log('Processing build...');
    const buildInfo = await fileDataExtract(buildPath, fileType, blobData);

    formData.append('appToken', appToken);
    formData.append('currentFileContentType', currentFileContentType);
    formData.append('baseUrl', currentUrl);
    formData.append('applicationId', applicationId);
    formData.append('buildInfo', JSON.stringify(buildInfo));

    if (releaseNotes) {
      releaseNotes = `<pre>${releaseNotes}</pre>`;
      formData.append('releaseNotes', releaseNotes);
    }

    const fileStream = fs.createReadStream(buildPath);

    fileStream.on('error', err => {
      console.error('Error reading the file:', err);
    });

    formData.append('file', fileStream, {
      contentType: currentFileContentType,
      filename: `${AppConst.appDefaultName}.${fileType}`
    });

    console.log('deployAppToPocketDeploy');
    const response = await axios.post(
      `${currentUrl}/${ApiConst.deployAppToPocketDeploy}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${appToken}`
        }
      }
    );

    console.log('Build Uploaded successfully');
    return response;
  } catch (error) {
    console.error(
      'Error during post-build process:',
      error.response?.data ?? error
    );
  }
};

export default deployApp;
