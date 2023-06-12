declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET: string
      DB_HOST: string
      HOST_PORT: number
      DB_PORT: string
      DB_USER: string
      DB_PASSWORD: string
      DB_DATABASE: string
    }
  }
}
export {}
