import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';

// Run every 15 minutes
export const startCleanupCron = () => {
  cron.schedule('*/15 * * * *', async () => {
    console.log('[Cron] Running scheduled disk cleanup task...');
    
    const maxAgeMs = 60 * 60 * 1000; // 1 hour
    const now = Date.now();
    
    const dirsToClean = [
      path.join(__dirname, '../../uploads'),
      path.join(__dirname, '../../output')
    ];

    for (const dir of dirsToClean) {
      try {
        const files = await fs.readdir(dir);
        let deletedCount = 0;

        for (const file of files) {
          // Skip hidden files like .gitkeep
          if (file.startsWith('.')) continue;

          const filePath = path.join(dir, file);
          try {
            const stats = await fs.stat(filePath);
            if (now - stats.mtimeMs > maxAgeMs) {
              await fs.unlink(filePath);
              deletedCount++;
            }
          } catch (err) {
            console.error(`[Cron] Failed to process file ${filePath}:`, err);
          }
        }
        
        if (deletedCount > 0) {
          console.log(`[Cron] Cleaned up ${deletedCount} old files from ${dir}`);
        }
      } catch (err) {
        // Directory might not exist yet, which is fine
        console.error(`[Cron] Failed to read directory ${dir}:`, err);
      }
    }
  });
};
