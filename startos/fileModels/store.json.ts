import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const storeJson = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/store.json',
  },
  z.object({
    syncNotified: z.boolean().catch(false),
    everSynced: z.boolean().catch(false),
  }),
)
