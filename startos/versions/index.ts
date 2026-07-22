import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_11_1_9 } from './v0.11.1_9'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_11_1_9],
})
