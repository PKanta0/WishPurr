import React from "react";

type RegisterCompoProps = {
    label: string;
    placeholder: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function RegisterCompo({
    label,
    placeholder,
    name,
    type = "text",
    value,
    onChange,
}: RegisterCompoProps) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 text-gray-700">{label}</label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="rounded-full border px-3 py-2 outline-none focus:border-black"
                placeholder={placeholder}
            />
        </div>
    );
}
