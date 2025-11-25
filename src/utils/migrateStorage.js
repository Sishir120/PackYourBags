/**
 * Migration utility to convert old base64-encoded storage to encrypted format
 */
import { secureStorage } from './security'

/**
 * Migrate all storage keys to encrypted format
 */
export function migrateStorageToEncrypted() {
  const keysToMigrate = ['access_token', 'refresh_token', 'user', 'csrf_token']
  
  keysToMigrate.forEach(key => {
    try {
      secureStorage.migrateToEncrypted(key)
    } catch (error) {
      console.warn(`Failed to migrate ${key}:`, error)
    }
  })
}

/**
 * Initialize migration on app load
 */
export function initStorageMigration() {
  // Run migration in the background
  setTimeout(() => {
    migrateStorageToEncrypted()
  }, 1000)
}

