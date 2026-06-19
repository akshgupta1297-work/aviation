"use client";

interface Props {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const LocationInput = ({
    label,
    value,
    onChange,
}: Props) => {
    return (
        <div className="border rounded-xl p-4 bg-white w-full">
            <p className="text-sm text-gray-500 mb-1">{label}</p>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search airport or city"
                className="w-full outline-none text-lg font-semibold"
            />
        </div>
    )
}

export default LocationInput




import { getAirportsQuery } from "@/lib/services/api";
import { Airport } from "@/lib/store/features/airport/airportSlice";
import { debounce } from "@/utils/functions";
import type { Key } from "@heroui/react";

import {
    Autocomplete,
    EmptyState,
    Header,
    Label,
    ListBox,
    SearchField,
    Separator,
    useFilter,
} from "@heroui/react";
import { memo, useEffect, useMemo, useState } from "react";

export const WithSections = memo(function WithSections({
    label,
    value,
    onChange,
}: Props) {
    const [selectedKey, setSelectedKey] = useState<Key | null>(value);
    const [airportsKey, setAirportsKey] = useState<[Airport] | never[]>();
    const { contains } = useFilter({ sensitivity: "base" });
    console.log(selectedKey);

    const changeVal = (val: Key | null) => {
        onChange(val as string)
        setSelectedKey(val)
    }

    const debouncedFetch = useMemo(
        () =>
            debounce((query: string) => {
                getAirportsWithQuery(query)
            }, 500),
        [] // Empty dependency array ensures this function persists across renders
    );

    useEffect(() => {
        getAirports()
    }, [])


    const getAirports = async () => {
        if (!airportsKey?.length) {
            const airports = await getAirportsQuery()
            if (airports.length > 0) {
                setAirportsKey(airports)
            }
        }
    }
    const getAirportsWithQuery = async (query: string) => {
        if (query.length >= 3) {
            const airports = await getAirportsQuery(query)
            if (airports.length > 0) {
                setAirportsKey(airports)
            } else {
                setAirportsKey([])
            }
        } else if (!query.length) {
            const airports = await getAirportsQuery()
            if (airports.length > 0) {
                setAirportsKey(airports)
            }
        }
    }
    const handleChange = (value: string) => {
        debouncedFetch(value);       // Triggers the delayed API execution
    };

    return (
        <Autocomplete
            className="w-full"
            placeholder="Select a airport"
            selectionMode="single"
            value={selectedKey}
            onChange={(val) => changeVal(val)}
        >
            <div onClick={() => getAirports()} className="border rounded-xl px-4 py-3 bg-white w-full">
                <Label className="text-sm text-gray-500 mb-1">{label}</Label>
                <br />
                <Autocomplete.Trigger className={"min-w-39 shadow-none hover:bg-transparent"}>
                    <Autocomplete.Value />
                    <Autocomplete.ClearButton />
                    {/* <Autocomplete.Indicator /> */}
                </Autocomplete.Trigger>
                <Autocomplete.Popover>
                    <Autocomplete.Filter filter={contains}>
                        <SearchField aria-label="search" autoFocus name="search" variant="secondary">
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input onChange={(e) => handleChange(e.target.value)} placeholder="Search airport..." />
                                <SearchField.ClearButton />
                            </SearchField.Group>
                        </SearchField>
                        <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                            <ListBox.Section>
                                <Header>Suggested</Header>
                                {airportsKey?.map((airport) => {
                                    return (
                                        <ListBox.Item className="p-0" key={airport.id} id={airport.id} textValue={`${airport.city}, ${airport.airport_name}, ${airport.iata_code}`}>
                                            <div className="flex w-full single-line-trim p-2 justify-between">
                                                <span className="font-bold search-airport-name">{airport.city}, {airport.country_iso2}</span>
                                                <span className="font-bold search-airport-name">{airport.iata_code}</span>
                                                <span className="font-bold hidden display-airport-name">{airport.city}, {airport.iata_code} - {airport.airport_name}</span>
                                            </div>
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    )
                                })}
                            </ListBox.Section>
                        </ListBox>
                    </Autocomplete.Filter>
                </Autocomplete.Popover>
            </div>
        </Autocomplete>
    );
})