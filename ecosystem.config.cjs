module.exports ={ 
  apps:[
    {
      name: 'safe-backend',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true, // Enable automatic restart
      watch: true, // Watching for file changes (optional)
      max_memory_restart: '1G',
      // Other configurations and environment variables as needed
    }
  ]
};
  
  // export { apps };
  