// Frontend-side permission bitflags.
// NOTE: These must match the backend's bit assignments.
export const PERMISSIONS = {
  ADMIN: 1,
  USER_READ: 2,
  USER_WRITE: 4,
};

export function hasAllPermissions(mask, requiredMask) {
  const m = Number(mask) || 0;
  const r = Number(requiredMask) || 0;
  return (m & r) === r;
}

export function permissionMaskToLabels(mask) {
  const labels = [];
  const m = Number(mask) || 0;
  for (const [key, value] of Object.entries(PERMISSIONS)) {
    if ((m & value) === value) labels.push(key);
  }
  return labels;
}
