"use client";

interface Props {
    label: string;
    value: string;
    disabled?: boolean;
    onChange: (value: string) => void;
}

const DatePickerField = ({
    label,
    value,
    disabled,
    onChange,
}: Props) => {
    return (
        <div className="border rounded-xl p-4 bg-white min-w-[180px]">
            <p className="text-sm text-gray-500 mb-1">{label}</p>

            <input
                name={label}
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full ${value && "text-green-700"} outline-none text-lg font-semibold bg-transparent`}
                disabled={disabled}
            />
        </div>
    )
}

export default DatePickerField