import sha256 from "./sha256";

const test = (M: string) => console.log(`"${M}" =sha256=> ${sha256(M)}`);

test("");
test("abc");
test("c70938b77acd3f81077d754ef23fff244c377c17df96ec4b864e70c4b81c4ec6");
