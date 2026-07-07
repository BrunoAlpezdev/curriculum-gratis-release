import { describe, it, expect } from "vitest"
import { urlAbsoluta } from "@/lib/formato"

describe("urlAbsoluta", () => {
  it("deja pasar urls con esquema http/https/mailto/tel", () => {
    expect(urlAbsoluta("https://a.com")).toBe("https://a.com")
    expect(urlAbsoluta("http://a.com")).toBe("http://a.com")
    expect(urlAbsoluta("mailto:x@a.com")).toBe("mailto:x@a.com")
    expect(urlAbsoluta("tel:+56911112222")).toBe("tel:+56911112222")
  })

  it("agrega mailto: a emails", () => {
    expect(urlAbsoluta("juan@a.cl")).toBe("mailto:juan@a.cl")
  })

  it("prepende https:// a dominios y perfiles", () => {
    expect(urlAbsoluta("linkedin.com/in/juan")).toBe("https://linkedin.com/in/juan")
    expect(urlAbsoluta("/github.com/juan")).toBe("https://github.com/juan")
  })

  it("no deja pasar esquemas peligrosos como javascript:", () => {
    expect(urlAbsoluta("javascript:alert(1)")).toBe("https://javascript:alert(1)")
  })
})
