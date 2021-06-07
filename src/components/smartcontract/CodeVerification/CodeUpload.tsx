import React from "react";
import JSZip from "jszip";

interface Props {
  apiUrl: string;
}

export function CodeUpload({ apiUrl }: Props) {
  const [zipFile, setZipFile] = React.useState<{selectedFile: any | null}>({selectedFile: null});
  const [list, setList] = React.useState<{name: string, dir: boolean, date: Date}[]>([]);
  const [address, setAddress] = React.useState<string>('');
  const [status, setStatus] = React.useState<{uploading: boolean; success: boolean}>({uploading: false, success: false});

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
        "solana", 
        zipFile.selectedFile, 
        zipFile.selectedFile.name 
      );
  
      const res = await fetch(`${apiUrl}/contact/${address}/upload`, {
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
      <input
        type="file"
        className="mb-5"
        onChange={onFileLoad}
      />
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
        Upload
      </button>
    </>
  )
}