"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = require("./sha256");
const test = (M) => console.log(`\x1b[42m ${M} \x1b[0m \x1b[36m=sha256=>  \x1b[33m${(0, sha256_1.default)(M)} \x1b[0m\n`);
test("");
test("abc");
test("c70938b77acd3f81077d754ef23fff244c377c17df96ec4b864e70c4b81c4ec6");
test("c70938b77acd3f81077d754ef23fff244c377c17df96ec4b864e70c4b81c4ec6c70938b77acd3f81077d754ef23fff244c377c17df96ec4b864e70c4b81c4ec6c70938b77acd3f81077d754ef23fff244c377c17df96ec4b864e70c4b81c4ec6c70938b77acd3f81077d754ef23fff244c377c17df96ec4b864e70c4b81c4ec6c70938b77acd3f81077d754ef23fff244c377c17df96ec4b864e70c4b81c4ec6c70938b77acd3f81077d754ef23fff244c377c17df96ec4b864e70c4b81c4ec6c70938b77acd3f81077d754ef23fff244c377c17df96ec4b864e70c4b81c4ec6c70938b77acd3f81077d754ef23fff244c377c17df96ec4b864e70c4b81c4ec6");
