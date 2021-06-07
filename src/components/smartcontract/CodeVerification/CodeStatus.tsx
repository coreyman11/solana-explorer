import React from "react";

interface Props {
  getBaseURL: () => string;
};

export function CodeStatus({ getBaseURL }: Props) {
  const [address, setAddress] = React.useState<string>('');
  const [status, setStatus] = React.useState<{
    address: string;
    verify: boolean;
    datetime?: Date;
    toolVersion?: string
  }>({address: '', verify: false});

  const getStatus = async () => {
    try {
      const res = await fetch(`${getBaseURL()}/account/${address}/program_verify`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      // { verify: true/false, datetime: datetime, tool_version: version }
      const json = await res.json();
      setStatus({ address, verify: json.verify })
    } catch (error) {
      console.error(error);
      setStatus({ address, verify: false })
    }
  }

  const downloadCode = async () => {
    try {
      const res = await fetch(`${getBaseURL()}/account/${address}/program_download`, {
        method: "GET",
        headers: { "Content-Type": "application/zip" }
      });
      console.log(res);
      // TODO: save zip
    } catch (error) {
      console.error(error);
    }
  }

  const downloadSuggestedSchema = async () => {
    try {
      const res = await fetch(`${getBaseURL()}/account/${address}/suggested_data_schema`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const json = await res.json();
      console.log(json);
      // TODO: save json
    } catch (error) {
      console.error(error);
    }
  }

  const downloadSchema = async () => {
    try {
      const res = await fetch(`${getBaseURL()}/account/${address}/data_schema`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const json = await res.json();
      console.log(json);
      // TODO: save json
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <form className="mt-5">
        <label className="visually-hidden">Contract Address</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="address"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAddress(event.target.value);
          }}
        />
      </form>
      <div className="mb-3">
        <button
          className={`btn border-primary text-primary`}
          disabled={address === ''}
          onClick={getStatus}
        >
          get status
        </button>
        <button
          className={`btn border-primary text-primary`}
          disabled={address === ''}
          onClick={downloadCode}
        >
          download code
        </button>
        <button
          className={`btn border-primary text-primary`}
          disabled={address === ''}
          onClick={downloadSuggestedSchema}
        >
          download suggested schema
        </button>
        <button
          className={`btn border-primary text-primary`}
          disabled={address === ''}
          onClick={downloadSchema}
        >
          download schema
        </button>
      </div>
      <div>
        {
          status.address && `address: ${status.address}`
        }
      </div>
      <div>
        {
          status.address && `status: ${status.verify}`
        }
      </div>
      <div>
        {
          (status.address && status.datetime) && `datetime: ${status.datetime}`
        }
      </div>
      <div>
        {
          (status.address && status.toolVersion) && `version: ${status.toolVersion}`
        }
      </div>
    </>
  )
}
