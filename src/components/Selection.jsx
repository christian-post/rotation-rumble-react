import React, { useState } from "react";



function Selection({ items, name, onSelectionChange }) {
  const [checkedState, setCheckedState] = useState(
    new Array(items.length).fill(false)
  );

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    // Notify parent component of selected item values
    if (onSelectionChange) {
      const selectedValues = updatedCheckedState
        .map((checked, index) => (checked ? items[index].value : null))
        .filter(Boolean);
      onSelectionChange(selectedValues);
    }
  };

  return (
    <div className="selection">
      <h3>{name}</h3>
      <ul className="selection-list">
        {items.map(({ id, label }, index) => (
          <li key={id}>
            <div className="selection-list-item">
              <input
                type="checkbox"
                id={`${name}-checkbox-${id}`}
                name={name}
                value={items[index].value}
                checked={checkedState[index]}
                onChange={() => handleOnChange(index)}
              />
              <label htmlFor={`${name}-checkbox-${id}`}>{label}</label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Selection;
