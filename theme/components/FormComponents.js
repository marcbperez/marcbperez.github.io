import htm from "https://esm.sh/htm";
import { h } from "https://esm.sh/preact";

const html = htm.bind(h);
const capitalise = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export function Select({ id, value, onChange, options }) {
  return html`<div>
    <label for=${id}>${capitalise(id)}</label>
    <select
      id=${id}
      value=${value}
      onChange=${onChange}
    >
      ${options.map((option) => html`<option value=${option}>
        ${capitalise(option)}
      </option>`)}
    </select>
  </div>`;
}

export function Checkbox({ id, value, onChange }) {
  return html`<div>
    <label for=${id}>
      <input
        id=${id}
        type="checkbox"
        checked=${value === "on"}
        onChange=${onChange}
      />
      ${capitalise(id)}
    </label>
  </div>`;
}
