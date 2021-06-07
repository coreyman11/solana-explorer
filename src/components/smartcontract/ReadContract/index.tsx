import React from "react";
import { Connection, PublicKey } from '@solana/web3.js';
const borsh = require('borsh');

interface Arg {
  name: string;
  type: string | [number, string];
}

interface Func {
  name: string;
  kind: string;
  fields: string[];
  args: Arg[]
}

interface Props {
  getRpcURL: () => string;
}

export function ReadContract({ getRpcURL }: Props) {
  const [address, setAddress] = React.useState<string>('');
  const [error0, setError0] = React.useState<{success: boolean, msg: string}>({success: false, msg: ''});
  const [json, setJson] = React.useState('');
  const [functions, setFunctions] = React.useState<Func[]>([]);
  const [attrs, setAttrs] = React.useState<{[key0: string]: {[key1: string]: {type: string, value: string}}}>({});
  const [error1, setError1] = React.useState<{success: boolean, msg: string}>({success: false, msg: ''});

  const onClickConnectionBtn = async () => {
    try {
      const connection = new Connection(getRpcURL(), "confirmed");
      const contractPubkey = new PublicKey(address);
      const accountInfo = await connection.getAccountInfo(contractPubkey);
      if (accountInfo === null) {
        setError0({success: false, msg: 'Error: cannot find the token account'});
        return;
      }
      setError0({success: true, msg: 'Success'});
      setJson('');
    } catch (error) {
      console.log(error);
      setError0({success: false, msg: error.toString()});
    }
  }

  function onClickParseBtn() {
    try {
      const data = JSON.parse(json);
      const temp0: Func[] = [];
      for(let i = 0; i < data.length; i++) {
        const temp1: {[key: string]: {type: string, value: string}} = {};
        const args: Arg[] = data[i][1].fields.map((item: string[]) => {
          temp1[item[0]] = { type: item[1], value: ''};
          return {
            name: item[0],
            type: item[1]
          };
        });
        setAttrs({...attrs, [i.toString()]: temp1 });
        temp0.push({
          name: data[i][0],
          kind: data[i][1].kind,
          fields: data[i][1].fields,
          args,
        })
      }
      setError1({success: true, msg: 'Success'});
      setFunctions(temp0);
    } catch (error) {
      console.error(error);
      setError1({success: false, msg: error.toString()});
      setFunctions([]);
    }
  }

  function DrawFunctions() {
    const items = functions.map((item, i) =>
      <div className="card mt-4" key={i}>
        <div className="card-header">
          {`${item.name} (kind: ${item.kind})`}
        </div>
        <div className="card-body">
          <form>
            {
              item.args.map((arg, j) =>
                <div className={j ? 'mt-3' : ''} key={j}>
                  <label className="visually-hidden">{`${arg.name}`}</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={arg.type.toString()}
                    disabled
                    value={attrs[i.toString()][arg.name].value}
                  />
                </div>
              )
            }
          </form>
        </div>
        <div className="card-footer card-footer-boxed">
          <button
            className="btn border-primary text-primary"
            disabled={!address}
            onClick={async () => {
              class T {
                fields = {};
                constructor(fields: {} | undefined = undefined) {
                  if (fields) {
                    this.fields = fields;
                  }
                }
              }
              
              const TSchema = new Map([
                [ T, {kind: item.kind, fields: item.fields} ],
              ]);

              const connection = new Connection(getRpcURL(), "confirmed");
              const contractPubkey = new PublicKey(address);
              const accountInfo = await connection.getAccountInfo(contractPubkey);
              
              if (accountInfo !== null) {
                const parsed = borsh.deserialize(
                  TSchema,
                  T,
                  accountInfo.data,
                );
                
                const temp: {[key: string]: {type: string, value: string}} = {};
                // eslint-disable-next-line array-callback-return
                Object.keys(attrs[i.toString()]).map((key) => {
                  const type = attrs[i.toString()][key].type;
                  const value = typeof type === 'string' ? parsed.fields[key] : new PublicKey(Buffer.from(parsed.fields[key])).toBase58();
                  temp[key] = { type, value };
                });
                console.log(temp);
                setAttrs({...attrs, [i.toString()]: temp});
              }
            }}
          >
            Call
          </button>
        </div>
      </div>
    );
    return <>{items}</>;
  }

  return (
    <>
      <h1>Read Contract</h1>
      <form className="mt-5">
        <label className="visually-hidden">Contract Address</label>
        <input
          type="text"
          className="form-control"
          placeholder="address"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAddress(event.target.value);
          }}
        />
        <span className={error0.success ? 'text-success' : 'text-danger'}>{error0.msg}</span>
      </form>
      <button
        className="btn border-primary text-primary mt-2"
        disabled={!address}
        onClick={onClickConnectionBtn}
      >
        Connection
      </button>
      <form className="mt-5">
        <label className="visually-hidden">Schema</label>
        <textarea
          className="form-control form"
          placeholder="Write a schema..."
          data-bs-toggle="autosize"
          disabled={!error0.success}
          rows={5}
          onChange={(e)=>{
            setJson(e.target.value.replaceAll('\'', '"'));
          }}
        />
        <span className={error1.success ? 'text-success' : 'text-danger'}>{error1.msg}</span>
      </form>
      <button
        className="btn border-primary text-primary mt-2"
        disabled={!error0.success}
        onClick={onClickParseBtn}
      >
        Parse
      </button>
      <DrawFunctions />
    </>
  )
}
