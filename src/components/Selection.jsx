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
    <>
      <p className="span-bold">{name}</p>
      {items.map(({ id, label }, index) => (
        <div className="selection-list-item" key={id}>
          <input
            className="checkbox"
            type="checkbox"
            id={`${name}-checkbox-${id}`}
            name={name}
            value={items[index].value}
            checked={checkedState[index]}
            onChange={() => handleOnChange(index)}
          />
          <label htmlFor={`${name}-checkbox-${id}`}>{label}</label>
        </div>
        ))}
    </>
  );
}

export default Selection;
