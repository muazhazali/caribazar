import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Suppress expected console.error output from tested error-handling paths
vi.spyOn(console, 'error').mockImplementation(() => {})
