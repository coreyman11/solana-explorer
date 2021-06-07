import { CodeVerification } from "components/smartcontract/CodeVerification";
import { useQuery } from "utils/url";

export function SmartContractVerifyPage() {
  const query = useQuery();

  const getBaseURL = (): string => {
    let api = 'https://solanaszn.dsrvlabs.com/api';
    const network = query.toString();
    switch (network) {
      case 'cluster=testnet':
        api = api + '/testnet';
        break;
      case 'cluster=devnet':
        api = api + '/devnet';
        break;
      default:
        api = api + '/mainnet-beta';
        break;
    }
    return api;
  }

  return (
    <div className="container mt-4">
      <CodeVerification getBaseURL={getBaseURL} />
    </div>
  );
}
