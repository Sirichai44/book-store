import { describe, expect, it, jest } from "bun:test"
import { getEnv, validObjectID } from "./config"

describe("Config", () => {
  describe("check object id", () => {
    it("should be valid", () => {
      const objectId = "60f7b3b3d9f4f3b3b3b3b3b3"
      const valid = validObjectID(objectId)
      expect(valid).toBeTruthy()
    })

    it("should be invalid", () => {
      const objectId = "60f7b3b3d9f4f3b3b3b3b3b"
      const valid = validObjectID(objectId)
      expect(valid).toBeFalsy()
    })
  })
})
