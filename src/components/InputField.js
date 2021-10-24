import { ChevronDownIcon } from "@chakra-ui/icons";
import { FormControl, FormErrorMessage, Icon, Select } from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";
import "../../new.css";

export const InputField = React.forwardRef(
  ({ textarea, select, ...props }, ref) => {
    const [field, { error }] = useField(props);

    return (
      <FormControl isInvalid={!!error}>
        {textarea ? (
          <textarea {...field} {...props} id={field.name} />
        ) : select ? (
          <Select
            p="0px"
            {...field}
            placeholder={props.placeholder}
            className={props.className}
            id={field.name}
            icon={<ChevronDownIcon className="dropDownIconStyle" />}
          >
            {props.listData?.map((value) => (
              <option value={value}>{value}</option>
            ))}
          </Select>
        ) : (
          <input ref={ref} {...field} {...props} id={field.name} />
        )}

        {error ? (
          <FormErrorMessage color="red">{error}</FormErrorMessage>
        ) : null}
      </FormControl>
    );
  }
);
