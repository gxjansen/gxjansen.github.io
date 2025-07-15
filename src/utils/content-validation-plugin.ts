import type { AstroIntegration } from 'astro';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { validateExternalContent, saveValidationReport, createValidationStatus } from './validate-external-content';
import { pressCoverage } from '../data/press-coverage';

export function contentValidationPlugin(): AstroIntegration {
  return {
    name: 'content-validation',
    hooks: {
      'astro:build:start': async ({ logger }) => {
        logger.info('Starting external content validation...');
        
        try {
          // Skip validation in preview/development unless explicitly enabled
          const shouldValidate = process.env.VALIDATE_CONTENT === 'true' || process.env.ASTRO_MODE === 'production';
          
          if (!shouldValidate) {
            logger.info('Skipping content validation (not in production mode)');
            return;
          }

          // Validate press coverage content
          const report = await validateExternalContent(pressCoverage);
          
          // Save the full report
          const reportsDir = path.join(process.cwd(), 'dist', '_validation');
          const reportPath = path.join(reportsDir, 'content-validation-report.json');
          saveValidationReport(report, reportPath);
          
          // Create a simplified status file for runtime use
          const status = createValidationStatus(report);
          const statusPath = path.join(process.cwd(), 'src', 'data', 'content-availability.json');
          
          // Ensure directory exists
          const statusDir = path.dirname(statusPath);
          if (!fs.existsSync(statusDir)) {
            fs.mkdirSync(statusDir, { recursive: true });
          }
          
          fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
          
          // Log summary
          if (report.unavailable > 0) {
            logger.warn(`Found ${report.unavailable} unavailable content items`);
            
            // Create a human-readable log file
            const logPath = path.join(reportsDir, 'unavailable-content.log');
            const logContent = [
              `Content Validation Report - ${new Date().toISOString()}`,
              `========================================`,
              `Total Checked: ${report.totalChecked}`,
              `Available: ${report.available}`,
              `Unavailable: ${report.unavailable}`,
              ``,
              `Unavailable Content:`,
              `-------------------`
            ];
            
            report.results
              .filter(r => !r.available)
              .forEach(r => {
                logContent.push(`[${r.type.toUpperCase()}] ${r.url}`);
                logContent.push(`  Error: ${r.error}`);
                logContent.push('');
              });
            
            fs.writeFileSync(logPath, logContent.join('\n'));
            logger.info(`Detailed unavailable content log saved to: ${logPath}`);
          } else {
            logger.info('All external content is available! 🎉');
          }
          
        } catch (error) {
          logger.error(`Content validation failed: ${error}`);
          // Don't fail the build, just log the error
        }
      }
    }
  };
}