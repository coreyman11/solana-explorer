import React from "react";

interface Arg {
  name: string;
  type: string;
  value: string;
}

interface Func {
  name: string;
  kind: string;
  fields: string[];
  args: Arg[]
}

interface Props {
  apiUrl: string;
}

export function ReadContract({ apiUrl }: Props) {
  const [json, setJson] = React.useState('');
  const [functions, setFunctions] = React.useState<Func[]>([]);

  function onClickReadBtn() {
    try {
      const borsh = JSON.parse(json);
      const temp: Func[] = [];
      for(let i = 0; i < borsh.length; i++) {
        const args: Arg[] = borsh[i][1].fields.map((item: string[]) => {
          return {
            name: item[0],
            type: item[1]
          }
        });
        temp.push({
          name: borsh[i][0],
          kind: borsh[i][1].kind,
          fields: borsh[i][1].fields,
          args,
        })
      }
      setFunctions(temp);
    } catch (error) {
      console.log(error);
      setFunctions([]);
    }
  }

  function DrawFunctions() {
    const [parms, setParms] = React.useState<{[key: string]: string}>({});
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
                    placeholder={arg.type}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setParms({ ...parms, [arg.name]: newValue});
                    }}
                  />
                </div>
              )
            }
          </form>
        </div>
        <div className="card-footer card-footer-boxed">
          <button
            className="btn border-primary text-primary"
            onClick={() => {
              console.log(parms);

              // TEST
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
              console.log(TSchema);
              /*
              const contractData = borsh.deserialize(
                TSchema,
                T,
                accountInfo.data,
              );
              */
              // TEST
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
        />
      </form>
      <form className="mt-5">
        <label className="visually-hidden">Schema</label>
        <textarea
          className="form-control form"
          placeholder="Write a schema..."
          data-bs-toggle="autosize"
          rows={10}
          onChange={(e)=>{
            setJson(e.target.value.replaceAll('\'', '"'));
          }}
        />
      </form>
      <button
        className="btn border-primary text-primary mt-2"
        onClick={onClickReadBtn}
      >
        Read
      </button>
      <hr />
      <DrawFunctions />
    </>
  )
}
