import htm from "https://esm.sh/htm";
import { h, render } from "https://esm.sh/preact";
import { useState, useLayoutEffect } from "https://esm.sh/preact/hooks";
import { useStoredState } from "./hooks/useStoredState.js";
import { Checkbox, Select } from "./components/FormComponents.js";

const html = htm.bind(h);

export function ThemeForm() {
  // Adds the selected option as css class to the body if it exists,
  // and removes the css classes of all the other options from the body.
  const updateBodyFromSelect = (id, value) => {
    for (let i = 0; i < fields[id]["options"].length; i++) {
      if (fields[id]["options"][i] === value) {
        document.body.classList.add(fields[id]["options"][i]);
      } else {
        document.body.classList.remove(fields[id]["options"][i]);
      }
    }
  };

  // Adds the checkbox id as css class to the body if checked,
  // otherwise removes the css class from the body.
  const updateBodyFromCheckbox = (id, value) => {
    (value === "on")
      ? document.body.classList.add(id)
      : document.body.classList.remove(id);
  };

  // Form values, shared through "stored state", because there might be several
  // instances of this component in the same page (ie. header and footer).
  const [values, setValues] = useState({});
  // Load the "stored state" into the form values after calling "save", without
  // updating the body classes.
  const { save, read } = useStoredState("themeform", () => {
    let values = {};
    for (const [key, field] of Object.entries(fields)) {
      values[key] = read(key) || field["default"];
    }

    setValues(values);
  });

  const onChangeSelect = (e) => {
    const { id, value } = e.currentTarget;
    const { updateBody } = fields[id];
    save(id, value);
    updateBody(id, value);
  };

  const onChangeCheckbox = (e) => {
    const { id, checked } = e.currentTarget;
    const { updateBody } = fields[id];
    const value = checked ? "on" : "off";
    save(id, value);
    updateBody(id, value);
  };

  const fields = {
    theme: {
      type: "select",
      options: ["detect", "light", "dark"],
      default: "detect",
      onChange: onChangeSelect,
      updateBody: (id, value) => {
        let detected;
        if (value === "detect") {
          detected = matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark" : "light";
        }

        updateBodyFromSelect(id, detected || value);
      },
    },
    text: {
      type: "select",
      options: ["small", "medium", "large"],
      default: "medium",
      onChange: onChangeSelect,
      updateBody: updateBodyFromSelect,
    },
    font: {
      type: "select",
      options: ["monospace", "sans-serif", "serif"],
      default: "monospace",
      onChange: onChangeSelect,
      updateBody: updateBodyFromSelect,
    },
    stretch: {
      type: "checkbox",
      default: "off",
      onChange: onChangeCheckbox,
      updateBody: updateBodyFromCheckbox,
    },
  };

  useLayoutEffect(() => {
    let values = {};
    for (const [key, field] of Object.entries(fields)) {
      values[key] = read(key) || field["default"];
      field.updateBody(key, values[key]);
    }

    setValues(values);
  }, []);

  return html`<form>
    ${Object.entries(fields).map(([key, field]) => {
    switch (field["type"]) {
      case "select":
        return html`<${Select}
          id=${key}
          value=${values[key]}
          onChange=${field["onChange"]}
          options=${field["options"]}
        />`;
      case "checkbox":
        return html`<${Checkbox}
          id=${key}
          value=${values[key]}
          onChange=${field["onChange"]}
        />`;
      default:
        return null;
    }
  })}
  </form>`;
}

const elements = document.getElementsByClassName("theme-form");
for (let i = 0; i < elements.length; i++) {
  render(html`<${ThemeForm} />`, elements[i]);
}
