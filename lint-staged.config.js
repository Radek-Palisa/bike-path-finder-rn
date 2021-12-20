module.exports = {
  '**/*.ts?(x)': allStagedFiles => [
    `eslint --cache ${allStagedFiles.join(' ')}`,
    'tsc -p tsconfig.json --noEmit',
  ],
};
