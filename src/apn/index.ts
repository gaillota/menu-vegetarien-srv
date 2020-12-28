import * as path from 'path'
import * as apn from 'apn'
import * as env from '../env'

// sandbox or production APN service
const isProduction = env.ENV === 'production'

// configuring APN with credentials
const apnOptions = {
  token: {
    key: path.join(__dirname, '../../../certs/AuthKey_2RJC6G83YU.p8'),
    keyId: env.APN_KEY_ID,
    teamId: env.APN_TEAM_ID,
  },
  production: isProduction,
}

export const apnProvider = new apn.Provider(apnOptions)
