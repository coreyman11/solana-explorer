import React from "react";
import {CodeStatus, CodeUpload} from "components/smartcontract/CodeVerification";
import { ReadContract } from "components/smartcontract/ReadContract";
import { useQuery } from "utils/url";

export function SmartContractPage() {
  const query = useQuery();
  const [menu, setMenu] = React.useState(0);
  
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

  const getTitle = (): string => {
    switch (menu) {
      case 0:
        return 'Contract Status';
      case 1:
        return 'Contract Upload';
      case 2:
        return 'Contract Call';
      default:
        return '';
    }
  }

  const draw = (): JSX.Element => {
    switch (menu) {
      case 0:
        return <CodeStatus getBaseURL={getBaseURL} />;
      case 1:
        return <CodeUpload getBaseURL={getBaseURL} />;
      case 2:
        return <ReadContract getRpcURL={getRpcURL} />;
      default:
        return <></>;
    }
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="card-header-title me-auto">
            {getTitle()}
          </h2>
          <ul className="nav nav-tabs nav-tabs-sm card-header-tabs">
            <li className="nav-item">
              <a
                href="#Status"
                className={menu === 0 ? "nav-link active" : "nav-link"}
                onClick={() => setMenu(0)}
              >
                Status
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#Upload"
                className={menu === 1 ? "nav-link active" : "nav-link"}
                onClick={() => setMenu(1)}
              >
                Upload
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#Upload"
                className={menu === 2 ? "nav-link active" : "nav-link"}
                onClick={() => setMenu(2)}
              >
                Call
              </a>
            </li>
          </ul>
        </div>
      </div>
      {
        draw()
      }
    </div>
  );
}
