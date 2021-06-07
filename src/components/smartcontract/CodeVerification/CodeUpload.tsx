import React from "react";
import JSZip from "jszip";

interface Props {
  getBaseURL: () => string;
};

export function CodeUpload({ getBaseURL }: Props) {
  const [zipFile, setZipFile] = React.useState<{selectedFile: any | null}>({selectedFile: null});
  const [schema, setSchema] = React.useState<{selectedFile: any | null}>({selectedFile: null});
  const [list, setList] = React.useState<{name: string, dir: boolean, date: Date}[]>([]);
  const [address, setAddress] = React.useState<string>('');
  const [status, setStatus] = React.useState<{uploading: boolean; success: boolean}>({uploading: false, success: false});
  const [status2, setStatus2] = React.useState<{uploading: boolean; success: boolean}>({uploading: false, success: false});

  const onFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFile = event.target.files ? event.target.files[0] : null;
      if (selectedFile) {
        const zip = new JSZip();
        zip.loadAsync(selectedFile)
          .then((data) => {
            setZipFile({ selectedFile });
            const items = Object.keys(data.files).map((key) => {
              return {
                name: data.files[key].name,
                dir: data.files[key].dir,
                date: data.files[key].date,
              }
            })
            setList(
              items.filter(item => item.name.indexOf('__MACOSX/') === -1).filter(item => item.name.indexOf('.DS_Store') === -1)
            );
            setAddress('');
          })
          .catch(() => {
            setZipFile({ selectedFile: null });
            setList([]);
          });
      } else {
        setZipFile({ selectedFile: null });
        setList([]);
        setAddress('');
      }
    } catch (error) {
      setZipFile({ selectedFile: null });
      setList([]);
      setAddress('');
    }
  }

  const onFileUpload = async () => {
    try {
      setStatus({uploading: true, success: false});
      const formData = new FormData();  
      formData.append( 
        "program", 
        zipFile.selectedFile, 
        zipFile.selectedFile.name 
      );
      const res = await fetch(`${getBaseURL()}/account/${address}/program_upload`, {
        method: "POST",
        headers: { "Content-Type": "application/zip" },
        body: formData
      });
      console.log(res);
      setStatus({uploading: false, success: true});
    } catch (error) {
      setStatus({uploading: false, success: false});
    }
  }

  const listItems = () => {
    const items = list.map((item, index) =>
      <li key={index}>
        {item.name}
      </li>
    );
    return (
      <ul>{items}</ul>
    );
  }

  return (
    <>
      <h1>Uploade Code</h1>
      <form>
        <div className="form-group">
          <input
            type="file"
            className="mb-5"
            onChange={onFileLoad}
          />
        </div>
      </form>
      <div className="mb-5">
        <h2>File Details:</h2>
        <p>{`File Name : ${zipFile.selectedFile ? zipFile.selectedFile.name : ''}`}</p> 
        <p>{`File Type : ${zipFile.selectedFile ? zipFile.selectedFile.type : ''}`}</p> 
        <p> 
          {`Last Modified : ${zipFile.selectedFile ? zipFile.selectedFile.lastModifiedDate.toDateString() : ''}`}
        </p>
      </div>
      <div className="mb-5">
        <h2>File List:</h2>
        <div>{listItems()}</div>
      </div>
      <form className="mt-5">
        <input
          type="text"
          disabled={!zipFile.selectedFile}
          className="form-control mb-5"
          placeholder="contract address"
          value={address}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAddress(event.target.value);
          }}
        />
      </form>
      <button
        className={!zipFile.selectedFile ? "btn btn-white" : `btn border-primary text-primary`}
        disabled={!zipFile.selectedFile || address === '' || status.uploading}
        onClick={onFileUpload}
      >
        Upload Source Files (.zip)
      </button>
      <hr className="mt-5" />
      <h1>Uploade Schema</h1>
      <form>
        <div className="form-group">
          <input
            type="file"
            className="mb-5"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const selectedFile = event.target.files ? event.target.files[0] : null;
              setSchema({selectedFile});
            }}
          />
        </div>
      </form>
      <button
        className={!schema.selectedFile ? "btn btn-white" : `btn border-primary text-primary`}
        disabled={!schema.selectedFile || address === '' || status2.uploading}
        onClick={async () => {
          try {
            setStatus2({uploading: true, success: false});
            const formData = new FormData();  
            formData.append( 
              "schema", 
              schema.selectedFile, 
              schema.selectedFile.name 
            );      
            const res = await fetch(`${getBaseURL()}/account/${address}/data_schema`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: formData
            });
            console.log(res);
            setStatus2({uploading: false, success: true});
          } catch (error) {
            setStatus2({uploading: false, success: false});
          }
        }}
      >
        Upload JSON Schema (.json)
      </button>
    </>
  )
}
