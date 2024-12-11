const fs = require("fs");
const path = require("path");

function parseEventStream(rawData) {
  const events = [];
  const lines = rawData.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("data: ")) {
      const jsonStr = line.substring(6).trim();
      try {
        const event = JSON.parse(jsonStr);
        events.push(event);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    }
  });

  return events;
}

function generateEventFile(events, outputPath) {
  const content = `export const events = ${JSON.stringify(events, null, 2)};`;
  fs.writeFileSync(outputPath, content, "utf8");
  console.log(`Events file generated at: ${outputPath}`);
}

function main() {
  const mockDir = path.resolve(process.cwd(), "src/playground/mocks");
  const rawDirPath = path.resolve(mockDir, "handlers/events/raw");
  const outputDirPath = path.resolve(mockDir, "handlers/events");
  try {
    const files = fs.readdirSync(rawDirPath);

    files.forEach((file) => {
      const inputFilePath = path.join(rawDirPath, file);
      const outputFilePath = path.join(
        outputDirPath,
        `${path.parse(file).name}.ts`
      );

      const rawData = fs.readFileSync(inputFilePath, "utf8");
      const events = parseEventStream(rawData);
      generateEventFile(events, outputFilePath);
      fs.unlinkSync(inputFilePath);
      console.log(`Generated file: ${outputFilePath}`);
    });

    console.log("All event files generated successfully.");
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

main();
