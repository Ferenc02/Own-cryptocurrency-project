import fs from "fs";
import path from "path";
const logFilePath = "./blockhain/src/logs/";

export function logError(error) {
  const timestamp = new Date().toLocaleString();
  const dateFolder = timestamp.split(",")[0].replace(/\//g, "-");

  // This gets the time portion of the timestamp and replaces colons with dashes
  const logFileName = `${timestamp
    .split(",")[1]
    .trim()
    .replace(/:/g, "-")}.log`;

  const fullFolderPath = path.join(logFilePath, dateFolder);

  // Check if todays date folder exists, if not create it
  if (!fs.existsSync(fullFolderPath)) {
    fs.mkdirSync(fullFolderPath, { recursive: true });
  }

  // Create the log message with the timestamp and error stack
  const logMessage = `${timestamp} - ERROR Message: ${error.message}\n${timestamp} - ERROR Stack: ${error.stack}\n\n `;

  fs.appendFile(path.join(fullFolderPath, logFileName), logMessage, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
  });

  // Log so the user knows an error occurred
  console.error(
    `============\n❗ An error occurred. ❗\nERROR: ${error.message}\n❗Check the logs for more details. ❗\n============`
  );
}
