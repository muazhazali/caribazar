import { pb } from '@/lib/pocketbase'
import { PBReport, transformReport } from '@/lib/pocketbase-types'
import { Report } from '@/lib/types'

/**
 * Create a new report for a bazaar
 */
export async function createReport(
  bazaarId: string,
  reason: string,
  details: string
): Promise<Report | null> {
  try {
    const record = await pb.collection('reports').create<PBReport>({
      bazaar: bazaarId,
      reason,
      details,
      status: 'pending',
    })
    return transformReport(record)
  } catch (error) {
    console.error('Error creating report:', error)
    return null
  }
}

/**
 * Get all reports for a specific bazaar (admin only)
 */
export async function getReportsByBazaar(bazaarId: string): Promise<Report[]> {
  try {
    const records = await pb.collection('reports').getFullList<PBReport>({
      filter: `bazaar="${bazaarId}"`,
      expand: 'bazaar',
      sort: '-created',
    })
    return records.map(transformReport)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return []
  }
}

/**
 * Update report status (admin only)
 */
export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'resolved' | 'dismissed'
): Promise<Report | null> {
  try {
    const record = await pb.collection('reports').update<PBReport>(reportId, { status })
    return transformReport(record)
  } catch (error) {
    console.error('Error updating report:', error)
    return null
  }
}

/**
 * Get all reports with optional filtering (admin only)
 */
export async function getAllReports(
  statusFilter?: 'pending' | 'resolved' | 'dismissed'
): Promise<Report[]> {
  try {
    const filter = statusFilter ? `status="${statusFilter}"` : ''
    const records = await pb.collection('reports').getFullList<PBReport>({
      filter,
      expand: 'bazaar',
      sort: '-created',
    })
    return records.map(transformReport)
  } catch (error) {
    console.error('Error fetching all reports:', error)
    return []
  }
}
