const sum = (...args: number[]) =>
  args.reduce((acc, curr) => (acc + curr) % 2 ** 32, 0);

const ROTR = (x: number, d: number, size: number = 32) => {
  d %= size;
  return ((2 ** d - 1) & x) * 2 ** (size - d) + (x >>> d);
};

const Ch = (x: number, y: number, z: number) => ((x & y) ^ (~x & z)) >>> 0;
const Maj = (x: number, y: number, z: number) =>
  ((x & y) ^ (x & z) ^ (y & z)) >>> 0;

const S = (a: number, b: number, c: number) => (x: number) =>
  (ROTR(x, a) ^ ROTR(x, b) ^ ROTR(x, c)) >>> 0;
const S0 = S(2, 13, 22);
const S1 = S(6, 11, 25);

const s = (a: number, b: number, c: number) => (x: number) =>
  (ROTR(x, a) ^ ROTR(x, b) ^ (x >>> c)) >>> 0;
const s0 = s(7, 18, 3);
const s1 = s(17, 19, 10);

const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

const H = [
  [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ],
];

const padMsg = (M: string) => {
  const l = M.length * 8;
  // 128 = 0b10000000
  M += String.fromCharCode(128);
  const k = 63 - ((M.length + 1) % 64);
  for (let i = 0; i < k; i++) M += String.fromCharCode(0);
  M += String.fromCharCode(l / 2 ** 32);
  M += String.fromCharCode(l & (2 ** 32 - 1));
  return M;
};

const _arr = (l: number) => Array.from({ length: l }, (_, i) => i);

type Block = number[];
const divideIntoBlocks = (M: string) => {
  const blockNb = Math.floor(M.length / 64);
  const blocks: Block[] = [];

  _arr(blockNb).forEach((b) => {
    blocks[b] = [];
    _arr(16).forEach(
      (w) =>
        (blocks[b][w] = _arr(4).reduce(
          (acc, curr) =>
            acc + M.charCodeAt(b * 64 + w * 4 + curr) * 2 ** (8 * (3 - curr)),
          0
        ))
    );
  });

  return blocks;
};

const preprocess = (M: string) => divideIntoBlocks(padMsg(M));

const sha256 = (M: string) => {
  const blocks = preprocess(M);
  blocks.forEach((block, i) => {
    const W = [];
    for (let t = 0; t < 64; t++)
      t < 16
        ? W.push(block[t])
        : W.push(sum(s1(W[t - 2]), W[t - 7], s0(W[t - 15]), W[t - 16]));

    let [a, b, c, d, e, f, g, h] = H[i];
    for (let t = 0; t < 64; t++) {
      const T1 = sum(h, S1(e), Ch(e, f, g), K[t], W[t]);
      const T2 = sum(S0(a), Maj(a, b, c));
      h = g;
      g = f;
      f = e;
      e = sum(d, T1);
      d = c;
      c = b;
      b = a;
      a = sum(T1, T2);
    }
    H[i + 1] = [
      sum(a, H[i][0]),
      sum(b, H[i][1]),
      sum(c, H[i][2]),
      sum(d, H[i][3]),
      sum(e, H[i][4]),
      sum(f, H[i][5]),
      sum(g, H[i][6]),
      sum(h, H[i][7]),
    ];
  });

  const digest = H[blocks.length]
    .map((v) => "00000000".slice(0, -v.toString(16).length) + v.toString(16))
    .join("");
  return digest;
};

export default sha256;
