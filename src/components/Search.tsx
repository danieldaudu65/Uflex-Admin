import React from "react";
import { CiSearch } from "react-icons/ci";
interface SearchProps {
    value: string;
    onChange: (val: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

const Search: React.FC<SearchProps> = ({ value, onChange, onFocus, onBlur }) => {
    return (
        <div className="flex border rounded-lg border-gray-300 w-full items-center px-2 transition-all">
            <CiSearch className="text-gray-500 text-2xl mr-2" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="Search bookings..."
                className="w-full placeholder:text-gray-400 py-2 outline-none"
            />
        </div>
    );
};


export default Search;
