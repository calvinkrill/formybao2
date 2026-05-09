/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Page = 'home' | 'letter' | 'mood' | 'gallery' | 'music' | 'secrets' | 'daily' | 'game' | 'final';

export interface Memory {
  id: string;
  image: string;
  caption: string;
  description?: string;
  date: string;
  filter?: string;
  voiceNote?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  note?: string;
}

export interface SecretNote {
  id: string;
  label: string;
  content: string;
  password?: string;
}
