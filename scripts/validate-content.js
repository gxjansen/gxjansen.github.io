#!/usr/bin/env node
import { validateExternalContent, saveValidationReport, createValidationStatus } from '../src/utils/validate-external-content.ts';
import { pressCoverage } from '../src/data/press-coverage.ts';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🔍 Starting external content validation...\n');
  
  try {
    // Run validation
    const report = await validateExternalContent(pressCoverage);
    
    // Save the full report
    const reportsDir = path.join(__dirname, '..', 'validation-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const reportPath = path.join(reportsDir, `validation-report-${new Date().toISOString().split('T')[0]}.json`);
    saveValidationReport(report, reportPath);
    
    // Create status file
    const status = createValidationStatus(report);
    const statusPath = path.join(__dirname, '..', 'src', 'data', 'content-availability.json');
    
    // Ensure directory exists
    const statusDir = path.dirname(statusPath);
    if (!fs.existsSync(statusDir)) {
      fs.mkdirSync(statusDir, { recursive: true });
    }
    
    fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
    console.log(`\n✅ Content availability status saved to: ${statusPath}`);
    
    // Create human-readable summary
    if (report.unavailable > 0) {
      console.log('\n⚠️  Unavailable Content Summary:');
      console.log('================================');
      
      const unavailableByType = {
        youtube: [],
        spotify: [],
        article: []
      };
      
      report.results
        .filter(r => !r.available)
        .forEach(r => {
          unavailableByType[r.type].push(r);
        });
      
      if (unavailableByType.youtube.length > 0) {
        console.log('\n📺 YouTube Videos:');
        unavailableByType.youtube.forEach(r => {
          console.log(`   ❌ ${r.url}`);
        });
      }
      
      if (unavailableByType.spotify.length > 0) {
        console.log('\n🎵 Spotify Episodes:');
        unavailableByType.spotify.forEach(r => {
          console.log(`   ❌ ${r.url}`);
        });
      }
      
      if (unavailableByType.article.length > 0) {
        console.log('\n📄 Articles:');
        unavailableByType.article.forEach(r => {
          console.log(`   ❌ ${r.url}`);
        });
      }
    }
    
    // Exit with appropriate code
    process.exit(report.unavailable > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}