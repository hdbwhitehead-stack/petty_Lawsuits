export const STATE_TRIBUNAL: Record<string, string> = {
  NSW: 'NCAT (NSW Civil and Administrative Tribunal)',
  VIC: 'VCAT (Victorian Civil and Administrative Tribunal)',
  QLD: 'QCAT (Queensland Civil and Administrative Tribunal)',
  WA:  'SAT (State Administrative Tribunal)',
  SA:  'SACAT (South Australian Civil and Administrative Tribunal)',
  TAS: 'TASCAT (Tasmanian Civil and Administrative Tribunal)',
  ACT: 'ACAT (ACT Civil and Administrative Tribunal)',
  NT:  'Local Court of the Northern Territory',
}

export function parseStateFromLocation(location: string): string | null {
  const matches = location.toUpperCase().match(/\b(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\b/)
  return matches ? matches[1] : null
}
