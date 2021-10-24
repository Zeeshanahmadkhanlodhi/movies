import { Button, Spinner } from "react-bootstrap";
import React from "react";
const AsyncButton = ({ loading, children, ...props }) =>
  loading ? (
    <div className={props.className}>
      <Spinner animation="border" />
    </div>
  ) : (
    <Button {...props}>{children}</Button>
  );

export default AsyncButton;
