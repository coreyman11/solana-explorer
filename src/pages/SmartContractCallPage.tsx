import React from "react";
import { useQuery } from "utils/url";
import { ReadContract } from "components/smartcontract/ReadContract";

export function SmartContractCallPage() {
  const query = useQuery();

  const getRpcURL = (): string => {
    let api = '';
    const network = query.toString();
    switch (network) {
      case 'cluster=testnet':
        api = 'https://api.testnet.solana.com';
        break;
      case 'cluster=devnet':
        api = 'https://api.devnet.solana.com';
        break;
      default:
        api = 'https://api.mainnet-beta.solana.com';
        break;
    }
    return api;
  }

  return (
    <div className="container mt-4">
      <ReadContract getRpcURL={getRpcURL} />
    </div>
  );
}
