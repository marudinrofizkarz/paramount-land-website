#!/usr/bin/env node

/**
 * Production Build Script
 * 
 * This script handles production builds with smart environment validation.
 * It will validate environment variables but allow build to continue with warnings
 * for better deployment flexibility.
 */

const { spawn } = require('child_process');

console.log('🚀 Starting production build process...\n');

// Check if we're in Vercel environment
const isVercel = process.env.VERCEL === '1' || process.env.CI === 'true';
const isProduction = process.env.NODE_ENV === 'production';

if (isVercel) {
  console.log('🔧 Vercel environment detected');
  console.log('📋 Environment variables will be validated...\n');
}

// Run environment validation
const validation = spawn('node', ['scripts/validate-environment.js'], {
  stdio: 'pipe',
  env: { ...process.env }
});

let validationOutput = '';
validation.stdout.on('data', (data) => {
  validationOutput += data.toString();
  process.stdout.write(data);
});

validation.stderr.on('data', (data) => {
  validationOutput += data.toString();
  process.stderr.write(data);
});

validation.on('close', (validationCode) => {
  console.log('\n' + '='.repeat(60));
  
  if (validationCode === 0) {
    console.log('✅ Environment validation passed');
    console.log('🏗️  Proceeding with build...\n');
    startBuild();
  } else {
    console.log('⚠️  Environment validation failed');
    
    if (isVercel && isProduction) {
      console.log('🚨 This is a production deployment on Vercel');
      console.log('📋 Please set the missing environment variables in Vercel dashboard');
      console.log('🔗 Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables\n');
      
      // In production Vercel, we should fail the build
      console.log('❌ Build cancelled - missing environment variables');
      process.exit(1);
    } else {
      console.log('🛠️  Development/Preview build - continuing with warnings');
      console.log('⚠️  Some features may not work without proper environment variables\n');
      startBuild();
    }
  }
});

function startBuild() {
  console.log('🏗️  Running Next.js build...\n');
  
  const build = spawn('npx', ['next', 'build'], {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  build.on('close', (buildCode) => {
    if (buildCode === 0) {
      console.log('\n✅ Build completed successfully!');
      if (isVercel) {
        console.log('🚀 Ready for deployment on Vercel');
      }
    } else {
      console.log('\n❌ Build failed');
      process.exit(buildCode);
    }
  });
  
  build.on('error', (error) => {
    console.error('❌ Build error:', error);
    process.exit(1);
  });
}
