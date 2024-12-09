import Image from "next/image";
import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

interface Option {
  value: string | number;
  label: string;
  icon?: string;
}

interface CustomSelectorProps {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  className?: string;
}

const CustomSelector: React.FC<CustomSelectorProps> = ({
  label,
  value,
  onChange,
  options,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 lg:text-lg font-medium">{label}</label>
      )}
      <div className="relative">
        <div
          onClick={toggleDropdown}
          className={`flex items-center justify-between w-full px-4 py-2.5 outline-none rounded-md border bg-transparent cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-2">
            {selectedOption?.icon && (
              <Image
                src={selectedOption.icon}
                alt={`${selectedOption.label} icon`}
                className="w-5 h-5"
                width={100}
                height={100}
                quality={100}
              />
            )}
            <span>{selectedOption?.label || "Select an option"}</span>
          </div>
          <IoMdArrowDropdown
            className={`text-xl transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute left-0 w-full mt-1 rounded-md overflow-hidden border border-border-secondary z-10 bg-white shadow-lg">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
                  value === option.value
                    ? "bg-gray-200 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {option.icon && (
                  <Image
                    src={option.icon}
                    alt={`${option.label} icon`}
                    className="w-5 h-5"
                    width={100}
                    height={100}
                    quality={100}
                  />
                )}
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelector;
