/**
 * Compares two semver version strings (e.g., "2.10.0" vs "2.9.0").
 * 
 * Returns:
 *  -1 if currentVersion < latestVersion
 *   0 if currentVersion === latestVersion
 *   1 if currentVersion > latestVersion
 */
export const compareVersions = (currentVersion, latestVersion) => {
  if (typeof currentVersion !== 'string' || typeof latestVersion !== 'string') {
    return 0;
  }

  const cleanCurrent = currentVersion.trim().replace(/^v/i, '');
  const cleanLatest = latestVersion.trim().replace(/^v/i, '');

  const partsCurrent = cleanCurrent.split('.').map(part => parseInt(part, 10) || 0);
  const partsLatest = cleanLatest.split('.').map(part => parseInt(part, 10) || 0);

  const maxLength = Math.max(partsCurrent.length, partsLatest.length);

  for (let i = 0; i < maxLength; i++) {
    const numCurrent = partsCurrent[i] !== undefined ? partsCurrent[i] : 0;
    const numLatest = partsLatest[i] !== undefined ? partsLatest[i] : 0;

    if (numCurrent < numLatest) {
      return -1;
    }
    if (numCurrent > numLatest) {
      return 1;
    }
  }

  return 0;
};
