import * as apn from 'apn'
import { ENV, APN_KEY, APN_KEY_ID, APN_TEAM_ID } from '../env'

// sandbox or production APN service
const isProduction = ENV === 'production'

// configuring APN with credentials
const apnOptions = {
  token: {
    key: APN_KEY,
    keyId: APN_KEY_ID,
    teamId: APN_TEAM_ID,
  },
  production: isProduction,
}

export const apnProvider = new apn.Provider(apnOptions)
