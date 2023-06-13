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
      JWT_SECRET: string
      CLOUDINARY_NAME: string
      CLOUDINARY_API_KEY: string
      CLOUDINARY_API_SECRET: string
    }
  }
}
export {}
