import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { InputField } from "./InputField";

function Dropzone(props) {
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
      props.setImage && props.setImage(file);
      props.handleSubmit && props.handleSubmit(file);
      setImageAsUrl(URL.createObjectURL(file));
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      {props.formField ? (
        <InputField {...getInputProps()} name={props.name} />
      ) : (
        <input {...getInputProps()} />
      )}
      {props.dragable ? (
        isDragActive ? (
          <p>Drop the files here ...</p>
        ) : imageAsUrl ? (
          <img src={imageAsUrl} className="Imageupload" />
        ) : props.children ? (
          props.children
        ) : (
          <p className="Imagedrope font-xssss">
            Drag 'n' drop some files here, or click to select files
          </p>
        )
      ) : props.children ? (
        props.children
      ) : (
        <p className="Imagedrope font-xssss">
          Drag 'n' drop some files here, or click to select files
        </p>
      )}
    </div>
  );
}

Dropzone.defaultProps = {
  name: "image",
  formField: true,
  dragable: true,
};

export default Dropzone;
