/**
 * Sports Configuration for SportSpot
 * 8 sports available on the platform with icons and colors
 */

import { Colors } from './theme';

export interface Sport {
  id: string;
  name: string;
  iconName: string; // MaterialCommunityIcons name from @expo/vector-icons
  color: string;
  description?: string;
}

/**
 * Available sports in SportSpot
 * Displayed in filters, search, and venue detail screens
 */
export const SPORTS: Sport[] = [
  {
    id: 'basketball',
    name: 'Basketball',
    iconName: 'basketball',
    color: Colors.primary,
    description: 'Indoor and outdoor basketball courts',
  },
  {
    id: 'tennis',
    name: 'Tennis',
    iconName: 'tennis',
    color: Colors.accent1,
    description: 'Professional and recreational tennis courts',
  },
  {
    id: 'badminton',
    name: 'Badminton',
    iconName: 'badminton',
    color: Colors.accent2,
    description: 'Indoor badminton halls and courts',
  },
  {
    id: 'cricket',
    name: 'Cricket',
    iconName: 'cricket',
    color: '#FF9500', // Orange
    description: 'Cricket grounds and practice nets',
  },
  {
    id: 'football',
    name: 'Football',
    iconName: 'soccer',
    color: '#00C853', // Green
    description: 'Football fields and soccer pitches',
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    iconName: 'volleyball',
    color: '#2979F0', // Deep blue
    description: 'Volleyball courts and sand courts',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    iconName: 'bike',
    color: '#D32F2F', // Red
    description: 'Cycling tracks and cycling clubs',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    iconName: 'swim',
    color: '#00BCD4', // Cyan
    description: 'Swimming pools and aquatic centers',
  },
];

/**
 * Sport lookup utilities
 */

/**
 * Get sport by ID
 */
export function getSportById(id: string): Sport | undefined {
  return SPORTS.find((sport) => sport.id === id);
}

/**
 * Get sport by name
 */
export function getSportByName(name: string): Sport | undefined {
  return SPORTS.find((sport) => sport.name.toLowerCase() === name.toLowerCase());
}

/**
 * Get all sport IDs
 */
export function getAllSportIds(): string[] {
  return SPORTS.map((sport) => sport.id);
}

/**
 * Get all sport names
 */
export function getAllSportNames(): string[] {
  return SPORTS.map((sport) => sport.name);
}

/**
 * Check if a sport ID is valid
 */
export function isValidSportId(id: string): boolean {
  return SPORTS.some((sport) => sport.id === id);
}
