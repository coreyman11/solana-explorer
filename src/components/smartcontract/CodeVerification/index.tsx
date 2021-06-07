import React from "react";
import {CodeStatus} from "./CodeStatus";
import {CodeUpload} from "./CodeUpload";

interface Props {
  getBaseURL: () => string;
}

export function CodeVerification({ getBaseURL }: Props) {
  const [isStatus, setIsStatus] = React.useState(true);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-header-title me-auto">
            Code Verification
          </h3>
          <ul className="nav nav-tabs nav-tabs-sm card-header-tabs">
            <li className="nav-item">
              <a
                href="#Status"
                className={isStatus ? "nav-link active" : "nav-link"}
                onClick={() => setIsStatus(true)}
              >
                Status
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#Upload"
                className={!isStatus ? "nav-link active" : "nav-link"}
                onClick={() => setIsStatus(false)}
              >
                Upload
              </a>
            </li>
          </ul>
        </div>
      </div>
      {
        isStatus ? <CodeStatus getBaseURL={getBaseURL} /> : <CodeUpload getBaseURL={getBaseURL} />
      }
    </>
  )
}