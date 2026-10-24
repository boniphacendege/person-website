import { BlogArticle, Book, ReadingMaterial } from '../types';

const CONTENT_CACHE_NAME = 'boniphace-reading-cache-v1';
const SAVED_MATERIALS_KEY = 'bn_offline_saved_materials_v1';
const READING_PROGRESS_PREFIX = 'bn_reading_progress_';

// Check if browser supports Cache API
const hasCacheApi = typeof window !== 'undefined' && 'caches' in window;

/**
 * Register Service Worker for offline PWA capabilities
 */
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // SW registered
          if (reg.installing) {
            console.log('Service Worker installing');
          } else if (reg.active) {
            console.log('Service Worker active');
          }
        })
        .catch((err) => {
          console.warn('Service Worker registration skipped or failed:', err);
        });
    });
  }
}

/**
 * Cache blogs array in Cache API and localStorage fallback
 */
export async function cacheBlogsOffline(blogs: BlogArticle[]): Promise<void> {
  if (!blogs || blogs.length === 0) return;

  // 1. localStorage backup
  try {
    localStorage.setItem('bn_cached_blogs', JSON.stringify(blogs));
  } catch {}

  // 2. Cache API
  if (hasCacheApi) {
    try {
      const cache = await caches.open(CONTENT_CACHE_NAME);
      const response = new Response(JSON.stringify(blogs), {
        headers: { 'Content-Type': 'application/json' },
      });
      await cache.put('/api/blogs', response);
    } catch (err) {
      console.warn('Cache API put failed for blogs:', err);
    }
  }
}

/**
 * Retrieve cached blogs when offline
 */
export async function getCachedBlogsOffline(): Promise<BlogArticle[]> {
  // 1. Try Cache API first
  if (hasCacheApi) {
    try {
      const cache = await caches.open(CONTENT_CACHE_NAME);
      const matched = await cache.match('/api/blogs');
      if (matched) {
        const data = await matched.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
  }

  // 2. Try localStorage fallback
  try {
    const raw = localStorage.getItem('bn_cached_blogs');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return [];
}

/**
 * Cache books array in Cache API and localStorage fallback
 */
export async function cacheBooksOffline(books: Book[]): Promise<void> {
  if (!books || books.length === 0) return;

  try {
    localStorage.setItem('bn_cached_books', JSON.stringify(books));
  } catch {}

  if (hasCacheApi) {
    try {
      const cache = await caches.open(CONTENT_CACHE_NAME);
      const response = new Response(JSON.stringify(books), {
        headers: { 'Content-Type': 'application/json' },
      });
      await cache.put('/api/books', response);
    } catch (err) {
      console.warn('Cache API put failed for books:', err);
    }
  }
}

/**
 * Retrieve cached books when offline
 */
export async function getCachedBooksOffline(): Promise<Book[]> {
  if (hasCacheApi) {
    try {
      const cache = await caches.open(CONTENT_CACHE_NAME);
      const matched = await cache.match('/api/books');
      if (matched) {
        const data = await matched.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
  }

  try {
    const raw = localStorage.getItem('bn_cached_books');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return [];
}

/**
 * Explicitly save an article or book preview for offline reading
 */
export async function saveMaterialForOffline(material: ReadingMaterial): Promise<boolean> {
  if (!material || !material.title) return false;

  try {
    // 1. Update localStorage list
    const existing = getSavedMaterialsSync();
    const filtered = existing.filter((m) => m.title !== material.title);
    filtered.unshift(material);
    localStorage.setItem(SAVED_MATERIALS_KEY, JSON.stringify(filtered));

    // 2. Put into Cache Storage
    if (hasCacheApi) {
      const cache = await caches.open(CONTENT_CACHE_NAME);
      const safeKey = `/offline/material/${encodeURIComponent(material.title)}`;
      const response = new Response(JSON.stringify(material), {
        headers: { 'Content-Type': 'application/json' },
      });
      await cache.put(safeKey, response);

      // Pre-cache cover image if present
      if (material.coverUrl && material.coverUrl.startsWith('http')) {
        try {
          fetch(material.coverUrl, { mode: 'no-cors' })
            .then((imgRes) => cache.put(material.coverUrl!, imgRes))
            .catch(() => {});
        } catch {}
      }
    }

    // Inform service worker if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_OFFLINE_ARTICLE',
        id: material.title,
        data: material,
      });
    }

    return true;
  } catch (err) {
    console.warn('Notice saving material for offline:', err);
    return false;
  }
}

/**
 * Remove an article or book preview from offline saved list
 */
export async function removeMaterialFromOffline(title: string): Promise<boolean> {
  try {
    const existing = getSavedMaterialsSync();
    const updated = existing.filter((m) => m.title !== title);
    localStorage.setItem(SAVED_MATERIALS_KEY, JSON.stringify(updated));

    if (hasCacheApi) {
      const cache = await caches.open(CONTENT_CACHE_NAME);
      const safeKey = `/offline/material/${encodeURIComponent(title)}`;
      await cache.delete(safeKey);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if material is saved for offline
 */
export function isMaterialSavedSync(title?: string): boolean {
  if (!title) return false;
  const list = getSavedMaterialsSync();
  return list.some((item) => item.title === title);
}

/**
 * Get all saved offline materials (synchronous helper)
 */
export function getSavedMaterialsSync(): ReadingMaterial[] {
  try {
    const raw = localStorage.getItem(SAVED_MATERIALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

/**
 * Save user reading progress for a specific material (0-100%)
 */
export function saveReadingProgress(title: string, progress: number): void {
  if (!title) return;
  try {
    const clamped = Math.min(100, Math.max(0, Math.round(progress)));
    localStorage.setItem(`${READING_PROGRESS_PREFIX}${title}`, String(clamped));
  } catch {}
}

/**
 * Get saved reading progress for a specific material (0-100%)
 */
export function getReadingProgress(title: string): number {
  if (!title) return 0;
  try {
    const val = localStorage.getItem(`${READING_PROGRESS_PREFIX}${title}`);
    if (val !== null) {
      const num = parseInt(val, 10);
      return isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
    }
  } catch {}
  return 0;
}
