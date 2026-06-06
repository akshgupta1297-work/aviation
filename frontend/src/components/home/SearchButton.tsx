"use client";

import { BiSearch } from "react-icons/bi";



interface Props {
    onClick?: () => void;
}

const SearchButton = ({ onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className="bg-amber-200 hover:bg-amber-300 transition-all text-amber-700 rounded-xl px-8 py-5 font-semibold flex items-center gap-2"
        >
            <BiSearch size={18} />
            SEARCH
        </button>
    );
}
export default SearchButton