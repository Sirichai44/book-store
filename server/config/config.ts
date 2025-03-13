import mongoose from "mongoose"

export const getEnv = () => {
  return {
    PORT: Number(process.env.PORT) || 8080,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
    MONGODB_USER: process.env.MONGODB_USER || "root",
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || "P@ssw0rd",
    MONGODB_DATABASE: process.env.MONGODB_DATABASE || "bookstore",
  }
}

export const validObjectID = (id: string) => {
  const valid = mongoose.Types.ObjectId.isValid(id)
  return valid
}
