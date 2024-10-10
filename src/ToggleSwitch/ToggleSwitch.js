import React from 'react';
import './ToggleSwitch.scss';

const ToggleSwitch = ({ Name, isOn, handleToggle }) => {
  return (
    <div className="toggle-switch small-switch">
      <input
        type="checkbox"
        className="toggle-switch-checkbox"
        name={Name}
        id={Name}
        checked={isOn}
        onChange={handleToggle}
      />
      <label className="toggle-switch-label" htmlFor={Name}>
        <span className="toggle-switch-inner" data-yes="On" data-no="Off"/>
        <span className="toggle-switch-switch" />
      </label>
    </div>
  );
};

export default ToggleSwitch;