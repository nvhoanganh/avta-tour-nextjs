import "react-toastify/dist/ReactToastify.css";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, StylesConfig } from "react-select";
import { Controller } from "react-hook-form";
import { useState } from "react";

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    display: "inline-block",
    width: "100%",
  }),
};

const EditableDropdown = ({ name, control, options, defaultValue }) => {
  const _options = options.map((x) => ({
    value: x,
    label: x,
  }));

  if (!!defaultValue && !_options.find((x) => x.value === defaultValue)) {
    _options.push({ value: defaultValue, label: defaultValue });
  }

  const [allOptions, setAllOptions] = useState(_options);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur } }) => {
        return (
          <CreatableSelect
            className="selector"
            onChange={(
              newValue, actionMeta
            ) => {
              if (actionMeta.action === "clear") {
                onChange(null);
              } else {
                onChange(newValue.value);
                if (actionMeta.action === "create-option") {
                  // add new
                  setAllOptions((val) => {
                    return [
                      ...val,
                      { value: newValue.value, label: newValue.label },
                    ];
                  });
                }
              }
            }}
            value={
              typeof value === "string"
                ? {
                  value: value,
                  label: value,
                }
                : value?.value
            }
            formatCreateLabel={(d) => `Use "${d}"`}
            getOptionLabel={(d) => d?.label}
            createOptionPosition="last"
            styles={customStyles}
            options={allOptions}
          />
        );
      }}
    />
  );
};
export default EditableDropdown;
