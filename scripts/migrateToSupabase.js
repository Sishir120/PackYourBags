/**
 * Migration Script: Mock Data → Supabase
 * 
 * Run this script to populate your Supabase database with destinations data
 * 
 * Usage: node scripts/migrateToSupabase.js
 */

const { createClient } = require('@supabase/supabase-js')
const mockDestinations = require('../src/data/mockDestinations').mockDestinations
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Supabase credentials not found in .env.local')
    console.log('\nMake sure .env.local contains:')
    console.log('  VITE_SUPABASE_URL=https://your-project.supabase.co')
    console.log('  VITE_SUPABASE_ANON_KEY=your-anon-key')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrate() {
    console.log('🚀 Starting migration to Supabase...\n')
    console.log(`📊 Found ${mockDestinations.length} destinations to migrate\n`)

    let successCount = 0
    let errorCount = 0
    const errors = []

    for (const destination of mockDestinations) {
        try {
            const { data, error } = await supabase
                .from('destinations')
                .insert(destination)
                .select()
                .single()

            if (error) {
                throw error
            }

            successCount++
            console.log(`✅ ${successCount}/${mockDestinations.length} Migrated: ${destination.name}`)
        } catch (error) {
            errorCount++
            console.error(`❌ Failed: ${destination.name} - ${error.message}`)
            errors.push({ destination: destination.name, error: error.message })
        }
    }

    console.log('\n📈 Migration Summary:')
    console.log(`   ✅ Success: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)

    if (errors.length > 0 && errors.length < 10) {
        console.log('\n🔍 Details of failed migrations:')
        errors.forEach(({ destination, error }) => {
            console.log(`   - ${destination}: ${error}`)
        })
    }

    console.log('\n✨ Migration complete!')
    console.log('🔄 Restart your dev server to see the changes')
}

// Run migration
migrate().catch(error => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
})
