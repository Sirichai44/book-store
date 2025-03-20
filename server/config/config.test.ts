import { describe, expect, it, jest } from "bun:test"
import { getEnv, validObjectID } from "./config"

describe("Config", () => {
  describe("Check object ID", () => {
    it("should be valid", () => {
      const objectId = "60f7b3b3d9f4f3b3b3b3b3b3"
      const valid = validObjectID(objectId)
      expect(valid).toBeTruthy()
    })

    it("Should be invalid", () => {
      const objectId = "60f7b3b3d9f4f3b3b3b3b3b"
      const valid = validObjectID(objectId)
      expect(valid).toBeFalsy()
    })
  })

  describe("Get ENV", () => {
    it("Should return environment variables", () => {
      const env = getEnv()
      expect(env.PORT).toBeDefined()
      expect(env.MONGODB_URI).toBeDefined()
      expect(env.MONGODB_USER).toBeDefined()
      expect(env.MONGODB_PASSWORD).toBeDefined()
      expect(env.MONGODB_DATABASE).toBeDefined()
    })
  })
})
