// Resolver for jest snapshots.
// Ref: https://github.com/jestjs/jest/issues/1650#issuecomment-475912058

module.exports = {
  testPathForConsistencyCheck: 'some/example.test.js',

  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace(/\.test\.([tj]sx?)/, `.test.$1${snapshotExtension}`),

  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath.replace(snapshotExtension, ''),
};
