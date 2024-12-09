import React from "react";

interface CustomInputProps {
  label?: string; // Optional label
  type?: string; // Input type (default: "text")
  value: string | number; // Value of the input
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
  className?: string; // Optional custom className
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor="inputId" className="lg:text-lg font-medium">
          {label}
        </label>
      )}
      <input
        id="inputId"
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 outline-none rounded-md border border-secondary bg-transparent ${className}`}
      />
    </div>
  );
};

export default CustomInput;
