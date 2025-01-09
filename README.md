# pocket-cli

Pocket CLI is a command-line tool designed to streamline the deployment process for mobile applications to "Pocket Deploy".

## Installation

```bash
npm install -g simform-pocket-cli
```

## Distribution

```bash
pocket distribute --applicationId "yourApplicationID" --buildPath "yourBuildPath" --appToken "YourAppToken" --baseUrl "base url of the server" --releaseNotes "formatted release notes"
```

## Example

```bash
pocket distribute --applicationId "<yourApplicationId>" --buildPath "<yourPath>/Downloads/app-release.apk" --appToken "<yourAppToken>" --baseUrl "<yourBaseUrl>/functions/v1/" --releaseNotes "formatted release notes"
```

## How to get Application ID and App Token

1. Log in to Pocket Deploy and navigate to your app's detail page.
2. Go to the Settings tab:

   - Application ID: Find it displayed here.
   - App Token: Click the Add Connection button to generate a new token.

   Note: The App Token can only be generated once. Make sure to store it securely after generating.

## Awesome Mobile Libraries

- Check out our other [available awesome mobile libraries](https://github.com/SimformSolutionsPvtLtd/Awesome-Mobile-Libraries)

## License

- [MIT License](./LICENSE)
