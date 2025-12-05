import React from "react";

type LoginCompoProps = {
    label: string;
    placeholder: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function LoginCompo({
    label,
    placeholder,
    type,
    name,
    value,
    onChange,
}: LoginCompoProps) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 text-gray-700">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="rounded-full border px-3 py-2 outline-none focus:border-black"
                placeholder={placeholder}
            />
        </div>
    );
}
