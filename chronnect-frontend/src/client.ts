import { createClient } from "postchain-client";

export const clientPromise = (async () => {
  const client = await createClient({
    nodeUrlPool: "https://node0.projectnet.chromia.dev:7740",
    blockchainRid: "A96C12971ED1C2036C762A99909121CDD39C62B000BEAE982B529CFE6F61398F"
  });
  return client;
})();
