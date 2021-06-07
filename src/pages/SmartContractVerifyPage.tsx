import { CodeVerification } from "components/smartcontract/CodeVerification";

const API = ''; // TODO: url setting

export function SmartContractVerifyPage() {

  return (
    <div className="container mt-4">
      <CodeVerification apiUrl={API} />
    </div>
  );
}
