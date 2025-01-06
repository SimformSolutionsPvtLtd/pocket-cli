#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import deployApp from './deployTheApp';

/**
 * CLI entry point
 */
yargs(hideBin(process.argv))
  .command(
    'distribute',
    'Deploy a build to the web app',
    {
      applicationId: {
        type: 'string',
        demandOption: true,
        describe: 'The unique Application Id of the application.'
      },
      buildPath: {
        type: 'string',
        demandOption: true,
        describe: 'Path to the APK or IPA build file.'
      },
      appToken: {
        type: 'string',
        demandOption: true,
        describe: 'The unique Application token of the application.'
      },
      baseUrl: {
        type: 'string',
        demandOption: true,
        describe: 'The base URL of the server.'
      },
      releaseNotes: {
        type: 'string',
        demandOption: false,
        describe: 'Enter your Release Notes for this version.'
      }
    },
    async (argv) => {
      await deployApp(
        argv.applicationId,
        argv.buildPath,
        argv.appToken,
        argv.baseUrl,
        argv.releaseNotes
      );
    }
  )
  .help().argv;
