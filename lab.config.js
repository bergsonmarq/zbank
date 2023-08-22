module.exports = {
    transform: 'node_modules/lab-transform-typescript',
    threshold: 100,
    coverage: true,
    lint: true,
    cli: {
        paths: ['./test']
      }
  };
  