import { MountDetails } from "~/types"

export const showDiskUsage = (details?: MountDetails) => {
  return details?.total_space && details?.total_space > 0
}

// Formats a byte count into a human readable string using binary units.
// The unit is chosen per value, so "149.49 GB" and "1.00 TB" can coexist.
// The switch happens at 1000 (not 1024) so values like 1000.28 GB read as
// "0.98 TB" instead of an awkward five-digit number of gigabytes.
export const formatBytes = (bytes?: number, digits = 2) => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB"]
  let value = bytes && bytes > 0 ? bytes : 0
  let unit_i = 0
  while (unit_i < units.length - 1 && value >= 1000) {
    value /= 1024
    unit_i++
  }
  return `${value.toFixed(unit_i === 0 ? 0 : digits)} ${units[unit_i]}`
}

// Kept for compatibility with the storage management page, which expects
// "used / total unit". Now each side is formatted independently.
export const toReadableUsage = (details: MountDetails) => {
  return `${formatBytes(details.used_space)} / ${formatBytes(
    details.total_space,
  )}`
}

// Detailed but compact: the numbers a user actually needs, with units that
// match each value instead of one unit forced on both.
export const toDetailedUsage = (details: MountDetails) => {
  return `${formatBytes(details.used_space)} used · ${formatBytes(
    details.free_space,
  )} free`
}

export const formatPercentage = (details: MountDetails) => {
  return `${usedPercentage(details).toFixed(1)}%`
}

// Full sentence used as a tooltip / title.
export const toFullUsage = (details: MountDetails) => {
  return (
    `${formatBytes(details.used_space)} used · ` +
    `${formatBytes(details.free_space)} free · ` +
    `${formatBytes(details.total_space)} total ` +
    `(${formatPercentage(details)})`
  )
}

export const usedPercentage = (details: MountDetails) => {
  if (!details.total_space || details.total_space <= 0) return 0.0
  const total = details.total_space
  const used =
    !details.used_space || details.used_space <= 0 ? 0.0 : details.used_space
  return used >= total ? 100.0 : (used / total) * 100.0
}

export const nearlyFull = (details: MountDetails) => {
  return details.free_space! / details.total_space! < 0.1
}
