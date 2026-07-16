import { promises as fs } from "fs"; // 1. Use the asynchronous promises native FS layer
import * as path from "path";

import type { FullConfig } from "@playwright/test";
import ffmpeg from "fluent-ffmpeg";

async function globalTeardown(config: FullConfig) {
  const uniqueOutputDirs = new Set(
    config.projects
      .map((project) => project.outputDir)
      .filter((outputDir) => !!outputDir),
  );

  for (const resultsDir of uniqueOutputDirs) {
    console.log(`Scanning test results path: ${resultsDir}`);

    try {
      // Verify directory existence asynchronously without blocking the thread
      await fs.access(resultsDir);
    } catch {
      continue; // Skip directory if it doesn't exist
    }

    // 2. Asynchronously scan files recursively
    const files = (await fs.readdir(resultsDir, {
      recursive: true,
    })) as string[];
    const webmFiles = files.filter((file) => file.endsWith(".webm"));

    for (const file of webmFiles) {
      const absolutePath = path.join(resultsDir, file);
      const outputPath = absolutePath.replace(".webm", ".mp4");

      // 3. Safeguard: Wait a brief moment if the file size is currently 0 bytes
      // (Signals that the browser context hasn't fully flushed the video buffer yet)
      try {
        const stats = await fs.stat(absolutePath);
        if (stats.size === 0) {
          await new Promise((res) => setTimeout(res, 1000));
        }
      } catch {
        continue; // Skip if the file vanished or was handled elsewhere
      }

      console.log(
        `Converting artifact asynchronously: ${file} to MP4 format...`,
      );

      await new Promise<void>((resolve) => {
        ffmpeg(absolutePath)
          .output(outputPath)
          .on("end", async () => {
            try {
              await fs.unlink(absolutePath); // Async delete original webm to clear space
            } catch (err) {
              console.error(
                `Failed to delete raw video file ${file}:`,
                (err as Error).message,
              );
            }
            resolve();
          })
          .on("error", (err) => {
            console.error(`Failed to transcode ${file}:`, err.message);
            resolve(); // Resolve anyway so one broken clip doesn't stall the pipeline
          })
          .run();
      });
    }
  }
}

export default globalTeardown;
