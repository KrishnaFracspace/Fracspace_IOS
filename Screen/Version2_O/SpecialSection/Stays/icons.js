// Inline SVG icons from Stays.dc.html (24×24 viewBox unless noted).
import React from 'react';
import Svg, {Circle, Path, Rect} from 'react-native-svg';
import {colors} from '../theme';

const line = {fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'};

export const STAR_D = 'M12 3.6l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.5l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z';
export const HEART_D =
  'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z';

export function SearchIcon({size = 16, color = 'currentColor'}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...line} stroke={color} strokeWidth={2}>
      <Circle cx="11" cy="11" r="6.5" />
      <Path d="m16 16 4 4" />
    </Svg>
  );
}

export function TicketIcon({color}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" {...line} stroke={color} strokeWidth={1.9}>
      <Path d="M3.5 8.5V6h17v2.5a3 3 0 0 0 0 6V17h-17v-2.5a3 3 0 0 0 0-6z" />
      <Path d="M14 6v11" strokeDasharray="2 2" />
    </Svg>
  );
}

export function SlidersIcon({size = 16, color, strokeWidth = 1.8}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...line} stroke={color} strokeWidth={strokeWidth}>
      <Path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <Circle cx="16" cy="7" r="2" />
      <Circle cx="10" cy="17" r="2" />
    </Svg>
  );
}

export function StarIcon({size = 13, color = colors.gold}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={STAR_D} fill={color} />
    </Svg>
  );
}

export function MuteIcon({muted}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" {...line} stroke="#fff" strokeWidth={2}>
      <Path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <Path d={muted ? 'm16 9.5 5 5M21 9.5l-5 5' : 'M16 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11'} />
    </Svg>
  );
}

export function PlayPauseIcon({playing}) {
  return playing ? (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="#fff">
      <Rect x="6" y="5" width="4" height="14" rx="1" />
      <Rect x="14" y="5" width="4" height="14" rx="1" />
    </Svg>
  ) : (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="#fff">
      <Path d="M8 5.5v13l11-6.5z" />
    </Svg>
  );
}

export function BadgeIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth={1.6}>
      <Circle cx="12" cy="12" r="8.5" />
      <Path
        d="M12 7.5l1.4 2.9 3.1.4-2.3 2.1.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.1 3.1-.4z"
        fill={colors.gold}
        stroke="none"
      />
    </Svg>
  );
}

export function CheckIcon({color}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" {...line} stroke={color} strokeWidth={2.4}>
      <Path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function CameraIcon({color = colors.muted}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round">
      <Path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <Circle cx="12" cy="13" r="3.2" />
    </Svg>
  );
}

export function HeadsetIcon({size = 24, strokeWidth = 1.8, cord = true}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...line} stroke={colors.gold} strokeWidth={strokeWidth}>
      <Path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <Rect x="3.5" y="13.5" width="4" height="6" rx="1.5" />
      <Rect x="16.5" y="13.5" width="4" height="6" rx="1.5" />
      {cord ? <Path d="M18.5 19.5c0 1.2-1.6 1.8-4 1.8" /> : null}
    </Svg>
  );
}

export function ClockIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={2} strokeLinecap="round">
      <Circle cx="12" cy="12" r="8.5" />
      <Path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

export function ChevronIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" {...line} stroke={colors.ink} strokeWidth={2.2}>
      <Path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function DirectionsIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" {...line} stroke={colors.gold} strokeWidth={2}>
      <Path d="M4 12 20 4l-8 16-2-6z" />
    </Svg>
  );
}

export function DownloadIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" {...line} stroke={colors.gold} strokeWidth={2}>
      <Path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" />
    </Svg>
  );
}
