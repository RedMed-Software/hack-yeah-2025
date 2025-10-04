import { Configuration, FrontendApi } from '@ory/client-fetch'

const defaultBasePath = 'http://localhost:4000'
const oryBasePath = import.meta.env.VITE_ORY_SDK_URL || defaultBasePath

const configuration = new Configuration({
  basePath: oryBasePath,
  credentials: 'include',
})

export const ory = new FrontendApi(configuration)
export { oryBasePath }
